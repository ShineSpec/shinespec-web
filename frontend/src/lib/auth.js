// src/lib/auth.js
//
// One place that hands out Clerk tokens. Use `await getAuthToken()` right before a
// request instead of reading localStorage once and hanging on to it.
//
// VITE_CLERK_JWT_TEMPLATE=shinespec  -> uses your 12-hour JWT template
// (unset)                            -> uses Clerk's default 60s session token; still
//                                       works, it just gets refreshed on every call

const TEMPLATE = import.meta.env.VITE_CLERK_JWT_TEMPLATE || undefined;
const REUSE_MARGIN_MS = 10 * 60 * 1000; // reuse the stored token only if it has > 10 min left

const decodeJwt = (jwt) => {
  try {
    const b64 = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, "=")));
  } catch {
    return null;
  }
};

const waitForClerk = async (timeoutMs = 10000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (window.Clerk?.loaded) return window.Clerk;
    await new Promise((r) => setTimeout(r, 100));
  }
  return null;
};

export const clearStoredAuth = () => {
  if (localStorage.getItem("token") || localStorage.getItem("user")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
  }
};

export async function getAuthToken({ force = false } = {}) {
  // Clerk is loaded and nobody is signed in -> no token, and drop any stale one
  if (window.Clerk?.loaded && !window.Clerk.user) {
    clearStoredAuth();
    return null;
  }

  if (!force) {
    const cached = localStorage.getItem("token");
    const claims = cached && decodeJwt(cached);
    if (claims?.exp && claims.exp * 1000 - Date.now() > REUSE_MARGIN_MS) {
      const currentUserId = window.Clerk?.loaded ? window.Clerk.user?.id : null;
      if (!currentUserId || currentUserId === claims.sub) return cached;
    }
  }

  const clerk = await waitForClerk();
  if (!clerk?.session) return null;

  const token = await clerk.session.getToken({
    ...(TEMPLATE ? { template: TEMPLATE } : {}),
    skipCache: force
  });

  if (token) localStorage.setItem("token", token);
  return token || null;
}

// fetch() with a fresh token, retried once with a forced refresh on a 401
export async function authFetch(path, options = {}) {
  const base = import.meta.env.VITE_API_BASE_URL;
  const run = async (force) => {
    const token = await getAuthToken({ force });
    return fetch(`${base}${path}`, {
      ...options,
      headers: { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
  };
  let res = await run(false);
  if (res.status === 401) res = await run(true);
  return res;
}