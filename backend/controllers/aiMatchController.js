// aiMatchController.js
//
// POST /api/auth/ai-service-match
//
// Works with NO Mistral key, NO Mistral tokens and NO internet to Mistral.
//   1. Every request is understood by lib/serviceMatcher.js (instant, free).
//   2. Mistral is only asked when that cannot tell which service is meant, so most
//      requests never spend a token.
//   3. If Mistral fails for any reason (out of credit, rate limited, slow, down) the
//      local answer is returned as normal and Mistral is paused for a while so we
//      stop sending requests that are going to fail.
//   4. The endpoint is public, so Mistral calls are capped per visitor and overall to
//      protect your credit from being drained.

import axios from "axios";
import { matchService, zonedToday, normalizeHours, SERVICE_TYPES } from "../lib/serviceMatcher.js";

const MISTRAL_URL = process.env.MISTRAL_API_URL || "https://api.mistral.ai/v1/chat/completions";
const MODEL = process.env.MISTRAL_MODEL || "mistral-small-latest"; // cheap and plenty for classifying
const TIMEOUT_MS = Number(process.env.AI_MATCH_TIMEOUT_MS) || 6000;
const PER_VISITOR_PER_HOUR = Number(process.env.AI_MATCH_PER_IP_HOUR) || 20;
const ALL_VISITORS_PER_HOUR = Number(process.env.AI_MATCH_GLOBAL_HOUR) || 300;
const HOUR = 60 * 60 * 1000;

/* ----------------------------- circuit breaker ---------------------------- */

let pausedUntil = 0;
let softFailures = 0;

const aiAvailable = () => Boolean(process.env.MISTRAL_API_KEY) && Date.now() >= pausedUntil;

function recordFailure(err) {
  const status = err?.response?.status;
  const body = JSON.stringify(err?.response?.data || "").toLowerCase();
  const noCredit =
    status === 401 || status === 402 || status === 403 || /insufficient|credit|billing|quota/.test(body);

  if (noCredit) {
    pausedUntil = Date.now() + 30 * 60 * 1000;
    console.warn(`[ai-match] Mistral refused (${status || "no status"}): paused for 30 min, using built-in matcher.`);
  } else if (status === 429) {
    const retryAfter = Number(err.response?.headers?.["retry-after"]);
    pausedUntil = Date.now() + (retryAfter > 0 ? retryAfter * 1000 : 2 * 60 * 1000);
    console.warn("[ai-match] Mistral rate limited: pausing briefly, using built-in matcher.");
  } else {
    softFailures += 1;
    if (softFailures >= 3) {
      pausedUntil = Date.now() + 60 * 1000;
      softFailures = 0;
      console.warn("[ai-match] Mistral failing repeatedly: pausing for 1 min.");
    }
  }
}

/* ------------------------------ spend limits ------------------------------ */

const visitors = new Map(); // visitor -> { count, resetAt }
let allCount = 0;
let allResetAt = Date.now() + HOUR;

function withinBudget(req) {
  const now = Date.now();
  if (now >= allResetAt) {
    allCount = 0;
    allResetAt = now + HOUR;
  }
  if (allCount >= ALL_VISITORS_PER_HOUR) return false;

  const who =
    String(req.headers?.["x-forwarded-for"] || "").split(",")[0].trim() || req.ip || req.socket?.remoteAddress || "unknown";
  if (visitors.size > 5000) {
    for (const [key, v] of visitors) if (now >= v.resetAt) visitors.delete(key);
    if (visitors.size > 5000) visitors.clear();
  }
  let entry = visitors.get(who);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + HOUR };
    visitors.set(who, entry);
  }
  if (entry.count >= PER_VISITOR_PER_HOUR) return false;

  entry.count += 1;
  allCount += 1;
  return true;
}

/* ---------------------------------- cache --------------------------------- */

const cache = new Map(); // key -> { value, expires }
const CACHE_MS = 10 * 60 * 1000;
const cacheKey = (text) => text.toLowerCase().replace(/\s+/g, " ").trim();
const cacheGet = (key) => {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  cache.delete(key);
  return null;
};
const cacheSet = (key, value) => {
  if (cache.size >= 500) cache.delete(cache.keys().next().value);
  cache.set(key, { value, expires: Date.now() + CACHE_MS });
};

/* --------------------------------- Mistral -------------------------------- */

// Small on purpose: the AI only decides the service (and a rough number of hours).
// Dates, times, extras and options are read by the built-in matcher, which is more
// reliable at them than a language model.
async function classifyWithMistral(text) {
  const key = cacheKey(text);
  const cached = cacheGet(key);
  if (cached) return cached;

  try {
    const response = await axios.post(
      MISTRAL_URL,
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You classify customer requests for a home and business services company. Reply with JSON only.",
          },
          {
            role: "user",
            content: `Pick the service that fits the request between the triple quotes.
Services: "Indoor Services" (cleaning a home), "Outdoor Services" (garden, pool, yard, exterior, dog walking), "Office Cleaning", "Moving Cleaning" (move in/out), "Laundry & Ironing", "Mom's Helper" (nanny, kids, babysitting), "Elder Care", "Event Cleaning" (parties, weddings, functions).
Reply as {"serviceType": "<one service above, or null if unclear>", "hoursNeeded": <number from 3 to 8, or null>}

"""${text.slice(0, 500)}"""`,
          },
        ],
        max_tokens: 40,
        temperature: 0,
        response_format: { type: "json_object" },
      },
      {
        timeout: TIMEOUT_MS,
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    softFailures = 0;
    const content = response.data?.choices?.[0]?.message?.content || "";
    let parsed = null;
    try {
      parsed = JSON.parse(content.replace(/```json\n?|```/g, "").trim());
    } catch {
      const named = SERVICE_TYPES.find((s) => content.includes(s));
      parsed = named ? { serviceType: named } : null;
    }

    // never trust the model's output: only accept values we recognise
    const serviceType = SERVICE_TYPES.includes(parsed?.serviceType) ? parsed.serviceType : null;
    const hours = Number(parsed?.hoursNeeded);
    const value = serviceType
      ? { serviceType, hoursNeeded: Number.isFinite(hours) ? normalizeHours(serviceType, hours) : null }
      : null;
    cacheSet(key, value);
    return value;
  } catch (err) {
    recordFailure(err);
    return null;
  }
}

/* --------------------------------- handler -------------------------------- */

const SAFE_DEFAULT = {
  serviceType: null,
  confidence: "low",
  hoursNeeded: null,
  hoursExplicit: false,
  urgency: "normal",
  location: null,
  scheduledDate: null,
  scheduledTime: null,
  extraTasks: [],
  notes: [],
  source: "local",
};

export const aiServiceMatch = async (req, res) => {
  const description = typeof req.body?.description === "string" ? req.body.description.trim().slice(0, 600) : "";
  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  try {
    const currentService = SERVICE_TYPES.includes(req.body?.currentService) ? req.body.currentService : undefined;
    const clock = zonedToday("Africa/Johannesburg");

    let result = matchService(description, { ...clock, currentService });

    if (!result.serviceType && aiAvailable() && withinBudget(req)) {
      const ai = await classifyWithMistral(description);
      if (ai?.serviceType) {
        const redo = matchService(description, { ...clock, currentService: ai.serviceType });
        redo.serviceType = ai.serviceType;
        const hourly = ai.serviceType !== "Laundry & Ironing" && ai.serviceType !== "Event Cleaning";
        if (redo.hoursNeeded == null && ai.hoursNeeded != null && hourly) redo.hoursNeeded = ai.hoursNeeded;
        redo.confidence = "medium";
        redo.source = "ai";
        result = redo;
      }
    }

    return res.json(result);
  } catch (error) {
    // never fail the customer's booking because of the matcher
    console.error("[ai-match] unexpected error:", error);
    return res.json({ ...SAFE_DEFAULT });
  }
};