// serviceMatcher.js
//
// Turns a plain-English request ("deep clean my 3 bedroom house in Sandton
// tomorrow morning") into booking fields. It runs entirely offline: no API key,
// no tokens, no network. The AI service (Mistral) is only an optional extra.
//
// This exact file is used by BOTH the website and the backend, so they always
// agree. Keep the two copies identical.
//
// IMPORTANT: the extra-task ids below must match `serviceExtraTasks` in
// FormalBookingFlow.jsx, and the time slots must match its `timeSlots`.

export const SERVICE_TYPES = [
  'Indoor Services',
  'Outdoor Services',
  'Office Cleaning',
  'Moving Cleaning',
  'Laundry & Ironing',
  "Mom's Helper",
  'Elder Care',
  'Event Cleaning',
];

export const TIME_SLOTS = [
  '07:00 - 07:30', '07:30 - 08:00', '08:00 - 08:30', '08:30 - 09:00',
  '09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00',
  '11:00 - 11:30', '11:30 - 12:00', '12:00 - 12:30', '12:30 - 13:00',
];

const FIRST_SLOT_MIN = 7 * 60;
const LAST_SLOT_MIN = 12 * 60 + 30;

// Hour limits come from the price tables in FormalBookingFlow.jsx.
const HOURS_RULES = {
  'Indoor Services': { min: 3, max: 8, step: 1 },
  'Outdoor Services': { min: 3.5, max: 8, step: 0.5 },
  'Office Cleaning': { min: 3, max: 8, step: 0.5 },
  'Moving Cleaning': { min: 3, max: 8, step: 0.5 },
  "Mom's Helper": { min: 3, max: 8, step: 0.5 },
  'Elder Care': { min: 3, max: 8, step: 0.5 },
};

export const LAUNDRY_BUNDLES = {
  small: { label: 'Small Bundle', hours: 3 },
  family: { label: 'Family Bundle', hours: 4 },
  busyWeek: { label: 'Busy Week Bundle', hours: 5 },
  bigWash: { label: 'Big Wash Bundle', hours: 6 },
  mega: { label: 'Mega Wash Bundle', hours: 7 },
  unlimited: { label: 'Unlimited Bundle', hours: 8 },
};

export const EVENT_SIZES = {
  small: { label: 'Small', guests: '≤50 guests' },
  medium: { label: 'Medium', guests: '51–150 guests' },
  large: { label: 'Large', guests: '151–300 guests' },
  extraLarge: { label: 'Extra Large', guests: '300+ guests' },
};

export const EVENT_SCOPES = {
  base: 'Base Service',
  preSetup: 'Pre-Event Setup',
  duringSupport: 'During Event Support',
  postDeepClean: 'Post-Event Deep Clean',
  fullPackage: 'Full Package',
};

export const HOME_SIZES = {
  small: 'Small Home: 1-2 Bedrooms',
  medium: 'Medium Home: 3-4 Bedrooms',
  large: 'Large Home: 5+ Bedrooms',
};

// [id, label, pattern]  (ids/labels mirror serviceExtraTasks in the booking flow)
export const SERVICE_EXTRAS = {
  'Indoor Services': [
    ['fridge', 'Inside Fridge', /\b(fridge|refrigerator|freezer)\b/],
    ['oven', 'Inside Oven', /\b(oven|stove|stovetop|hob)\b/],
    ['cabinets', 'Inside Cabinets', /\b(cabinets?|cupboards?|drawers?|pantry)\b/],
    ['windows-interior', 'Interior Windows', /\b(windows?|glass|window sills?)\b/],
    ['walls', 'Interior Walls', /\b(walls?|skirting|scuff marks?)\b/],
    ['ironing', 'Ironing', /\b(ironing|ironed|iron (?:my|the|some|all|clothes|shirts))\b/],
    ['laundry', 'Laundry', /\b(laundry|wash(?:ing)? (?:my |the |some |all )?(?:clothes|linen|bedding))\b/],
    ['carpet-cleaning', 'Carpet Cleaning', /\b(carpets?|rugs?|upholstery|couch(?:es)?|sofas?|mattress(?:es)?)\b/],
  ],
  'Outdoor Services': [
    ['garden-maintenance', 'Garden Maintenance', /\b(garden(?:ing|er|s)?|lawns?|mow(?:ing|er)?|hedges?|weeds?|weeding|prun(?:e|ing)|shrubs?|flower ?beds?|landscap\w+|trim(?:ming)? (?:the )?(?:trees?|hedges?|bushes))\b/],
    ['pool-cleaning', 'Pool Cleaning', /\b(pool|swimming pool)\b/],
    ['patio-cleaning', 'Patio Cleaning', /\b(patio|deck|paving|braai area|stoep|veranda|verandah|courtyard)\b/],
    ['windows-exterior', 'Exterior Windows', /\b(windows?|glass)\b/],
    ['gutter-cleaning', 'Gutter Cleaning', /\b(gutters?|downpipes?)\b/],
    ['driveway', 'Driveway Cleaning', /\b(driveway|paving|pressure wash\w*|jet wash\w*)\b/],
    ['fence-cleaning', 'Fence Cleaning', /\b(fence|fences|fencing)\b/],
    ['Dog walking', 'Dog walking', /\b(dog walk\w*|walk (?:my |our |the )?dogs?|dog walker)\b/],
  ],
  'Office Cleaning': [
    ['desk-sanitization', 'Desk Sanitization', /\b(desks?|workstations?|cubicles?|sanitis\w+|sanitiz\w+|disinfect\w*)\b/],
    ['kitchen-area', 'Kitchen Area', /\b(kitchen\w*|pantry|tea ?room|canteen)\b/],
    ['bathroom-deep', 'Bathroom Deep Clean', /\b(bathrooms?|toilets?|restrooms?|washrooms?)\b/],
    ['windows-office', 'Office Windows', /\b(windows?|glass)\b/],
    ['carpet-vacuum', 'Carpet Vacuuming', /\b(carpets?|vacuum(?:ing)?|floors?)\b/],
    ['trash-removal', 'Trash Removal', /\b(trash|bins?|rubbish|waste|garbage)\b/],
    ['conference-room', 'Conference Room', /\b(conference rooms?|boardrooms?|board rooms?|meeting rooms?)\b/],
    ['electronics', 'Electronics Dusting', /\b(electronics|computers?|screens?|monitors?|keyboards?|equipment)\b/],
  ],
  'Moving Cleaning': [
    ['deep-clean-all', 'Deep Clean All Rooms', /\b(deep clean\w*|every ?thing|all rooms|whole (?:house|flat|apartment|place)|top to bottom|full clean)\b/],
    ['fridge-freezer', 'Fridge & Freezer', /\b(fridge|refrigerator|freezer)\b/],
    ['oven-stove', 'Oven & Stove', /\b(oven|stove|stovetop|hob)\b/],
    ['all-cabinets', 'All Cabinets', /\b(cabinets?|cupboards?|drawers?|wardrobes?|pantry)\b/],
    ['all-windows', 'All Windows', /\b(windows?|glass)\b/],
    ['wall-marks', 'Remove Wall Marks', /\b(wall marks?|marks? on (?:the )?walls?|scuff\w*|walls?)\b/],
    ['carpet-steam', 'Carpet Steam Clean', /\b(carpets?|rugs?|steam clean\w*)\b/],
    ['balcony-patio', 'Balcony/Patio', /\b(balcony|patio|stoep|veranda|verandah)\b/],
  ],
  'Laundry & Ironing': [
    ['wash-fold', 'Wash & Fold', /\b(wash(?:ing)? (?:and|&|n) fold|laundry|wash(?:ing)? (?:my |the |some |all )?(?:clothes|clothing|linen))\b/],
    ['ironing-service', 'Ironing Service', /\b(ironing|ironed|iron (?:my|the|some|all|clothes|shirts))\b/],
    ['delicate-items', 'Delicate Items', /\b(delicates?|silk|wool|lace|cashmere|dry ?clean\w*)\b/],
    ['bed-linen', 'Bed Linen', /\b(bed ?linen|sheets?|duvets?|bedding|blankets?|comforters?|pillow ?cases?)\b/],
    ['towels', 'Towels', /\b(towels?)\b/],
    ['curtains', 'Curtains', /\b(curtains?|drapes?)\b/],
    ['steam-press', 'Steam Pressing', /\b(steam(?:ing)?|press(?:ing)?)\b/],
    ['hang-fold', 'Hang & Fold', /\b(hang(?:ing)? (?:and|&|n) fold|hang(?:ing)?|on hangers?)\b/],
  ],
  "Mom's Helper": [
    ['meal-prep', 'Meal Prep', /\b(meal ?prep\w*|cook(?:ing)?|dinner|lunch|snacks?|prepare (?:a )?meals?)\b/],
    ['children-pickup', 'Children Pickup', /\b(school (?:run|pick ?up|pickup|drop ?off|collect\w*)|pick ?up (?:the |my |our )?(?:kids|children|boys|girls)|collect (?:the |my |our )?(?:kids|children)|drop ?off)\b/],
    ['light-cleaning', 'Light Cleaning', /\b(clean(?:ing)?|tidy(?:ing)?|dishes|sweep\w*|mop\w*)\b/],
    ['laundry-kids', 'Kids Laundry', /\b(laundry|washing|ironing)\b/],
    ['organize', 'Organizing', /\b(organi[sz]\w*|declutter\w*|sort(?:ing)?)\b/],
    ['grocery-help', 'Grocery Help', /\b(grocer\w*|shopping|errands?)\b/],
    ['play-supervision', 'Play Supervision', /\b(babysit\w*|baby ?sit\w*|supervis\w*|play(?:ing)?|watch(?:ing)? (?:the |my |our )?(?:kids|children|baby))\b/],
    ['homework-help', 'Homework Help', /\b(homework|lessons?|studying|study help|reading help)\b/],
  ],
  'Elder Care': [
    ['companion', 'Companionship', /\b(companion(?:ship)?|company|chat(?:ting)?|lonely|keep (?:him|her|them|my \w+) company|sit with)\b/],
    ['medication-remind', 'Medication Reminders', /\b(medications?|medicine|pills|meds|tablets)\b/],
    ['meal-prep-elder', 'Meal Preparation', /\b(meal ?prep\w*|cook(?:ing)?|meals?|lunch|dinner|breakfast)\b/],
    ['light-exercise', 'Light Exercise', /\b(exercis\w*|walk(?:ing|s)?|stretch\w*|physio\w*)\b/],
  ],
  'Event Cleaning': [
    ['setup-cleanup', 'Setup & Cleanup', /\b(set ?up|setting up|clean ?up|clean-up|tidy up)\b/],
    ['post-party-deep', 'Deep Clean Post-Event', /\b(deep clean\w*|post[- ]?(?:event|party|wedding)|after the (?:party|event|wedding))\b/],
    ['waste-removal', 'Waste & Trash Removal', /\b(trash|rubbish|waste|garbage|bins?|bottles?|litter)\b/],
    ['floor-restoration', 'Floor Restoration', /\b(floors?|mop\w*|polish\w*|scrub\w*)\b/],
    ['furniture-sanitize', 'Furniture Sanitization', /\b(furniture|chairs?|tables?|sanitis\w+|sanitiz\w+|disinfect\w*)\b/],
    ['window-clean', 'Window & Glass Cleaning', /\b(windows?|glass(?:es|ware)?)\b/],
    ['kitchen-deep', 'Kitchen Deep Clean', /\b(kitchen\w*|catering area)\b/],
    ['bathroom-restore', 'Bathroom Restoration', /\b(bathrooms?|toilets?|restrooms?|washrooms?)\b/],
  ],
};

/* ------------------------------------------------------------------ */
/* Text preparation                                                    */
/* ------------------------------------------------------------------ */

const NUM_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90,
};
const NUM_WORD_RE = new RegExp(
  '\\b(' + Object.keys(NUM_WORDS).join('|') + ')\\b(?=\\s*-?\\s*(?:hours?|hrs?|bed|bedrooms?|bathrooms?|loads?|baskets?|bags?|guests?|people|persons|kids|children|staff|employees|items?|pieces?|days?|weeks?|cleaners?|rooms?|o\'?clock|am|pm))',
  'g'
);

// Common words people mistype. Only these are auto-corrected, and only when the
// typo is very close, so ordinary words are never rewritten into something else.
const VOCAB = [
  'laundry', 'ironing', 'cleaning', 'cleaner', 'gardening', 'gardener', 'office', 'wedding',
  'bedroom', 'bedrooms', 'bathroom', 'bathrooms', 'kitchen', 'window', 'windows', 'tomorrow', 'afternoon',
  'evening', 'morning', 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday',
  'friday', 'weekend', 'january', 'february', 'september', 'october', 'november', 'december',
  'babysitter', 'elderly', 'groceries', 'carpets', 'driveway', 'birthday', 'urgent', 'urgently',
  'tonight', 'apartment', 'medication', 'homework', 'immediately',
];
const VOCAB_SET = new Set(VOCAB);
// Real words that sit one letter away from a vocab word but mean something else.
const PROTECT = new Set(['officer', 'officers', 'mourning', 'cleaned', 'cleaners', 'cleans', 'gardens']);

// Optimal-string-alignment distance (a swap of two letters counts as 1).
function editDistance(a, b) {
  const al = a.length;
  const bl = b.length;
  if (Math.abs(al - bl) > 2) return 3;
  const d = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
  for (let i = 0; i <= al; i++) d[i][0] = i;
  for (let j = 0; j <= bl; j++) d[0][j] = j;
  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[al][bl];
}

function fixTypos(text) {
  return text
    .split(' ')
    .map((tok) => {
      const bare = tok.replace(/[^a-z]/g, '');
      if (bare.length < 5 || bare !== tok || VOCAB_SET.has(bare) || PROTECT.has(bare)) return tok;
      const limit = bare.length <= 6 ? 1 : 2;
      let best = null;
      let bestDist = limit + 1;
      for (const word of VOCAB) {
        if (word[0] !== bare[0]) continue;
        const dist = editDistance(bare, word);
        if (dist < bestDist) {
          best = word;
          bestDist = dist;
        }
      }
      return best && bestDist <= limit ? best : tok;
    })
    .join(' ');
}

function prepare(raw) {
  let s = String(raw || '').slice(0, 1500).toLowerCase();
  s = s
    .replace(/[’‘`´]/g, "'")
    .replace(/½/g, '.5')
    .replace(/\ba\s+hundred\b|\bone\s+hundred\b/g, '100')
    .replace(/(\d)\s*(?:and a half|and half)\b/g, '$1.5')
    .replace(/[^a-z0-9:'./@&+\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  s = fixTypos(s);
  s = s.replace(NUM_WORD_RE, (w) => String(NUM_WORDS[w]));
  s = s.replace(/\bhome office\b/g, 'home study'); // not a workplace
  return ` ${s} `;
}

/* ------------------------------------------------------------------ */
/* Service detection                                                   */
/* ------------------------------------------------------------------ */

// "clean the house / my flat / the kitchen": a home clean, even if laundry is mentioned too.
const HOUSE_CLEAN_RE = /\bclean(?:ing|ed)?\s+(?:up\s+)?(?:the |my |our |a )?(?:whole |entire )?(house|home|flat|apartment|place|townhouse|bedrooms?|kitchen|bathrooms?)\b/;

// [pattern, weight]. Every pattern counts once, however often it appears.
const SIGNALS = {
  'Event Cleaning': [
    [/\b(events?)\b/, 3],
    [/\b(party|parties)\b/, 3],
    [/\b(weddings?)\b/, 3.5],
    [/\b(birthday|baby shower|bridal shower|engagement|celebrations?|reception(?! area)|funeral|gala|expo|festival|gathering|matric dance|prom|functions?)\b/, 2.5],
    [/\bconference\b(?!\s*rooms?)/, 2.5],
    [/\bguests\b/, 2],
    [/\bvenue\b/, 2.5],
    [/\b(after|post)[- ]?(?:the |my |our |a )?(party|event|wedding|function|celebration)\b/, 2],
  ],
  'Moving Cleaning': [
    [/\b(moving|move|moved)\s+(?:in|into|out|out of|to|house|home|day)\b/, 4],
    [/\b(move[- ]?out|move[- ]?in|moveout|movein)\b/, 4],
    [/\b(vacat\w+|hand ?over|deposit|landlord|lease|relocat\w+|removals?|removalists?|new (?:place|house|home|flat|apartment)|old (?:place|house|home|flat|apartment))\b/, 3],
  ],
  'Laundry & Ironing': [
    [/\blaundry\b|\blaundromat\b/, 4],
    [/\b(ironing|ironed)\b|\biron (?:my|the|some|all|these|those|clothes|shirts)\b/, 3.5],
    [/\bwash(?:ing)? (?:my |our |the |some |all )?(?:clothes|clothing|laundry|linen|shirts|garments|duvets?|bedding|towels)\b/, 4],
    [/\bwash(?:ing)? ?(?:and|&|n) ?(?:fold|iron|press)\b/, 4],
    [/\b(clothes|clothing|garments?|shirts|linen|duvets?|bedding|towels)\b/, 1.5],
    [/\bwash loads?\b|\bloads? of (?:washing|laundry)\b|\d+ loads?\b/, 3],
  ],
  'Office Cleaning': [
    [/\b(offices?|workplace|work place)\b/, 4],
    [/\b(boardrooms?|board rooms?|meeting rooms?|conference rooms?|cubicles?|open[- ]plan|desks)\b/, 3],
    [/\b(staff|employees|commercial|business|premises|retail|shop|store|salon|clinic|warehouse|factory)\b/, 1.5],
  ],
  'Outdoor Services': [
    [/\b(garden(?:ing|er|ers|s)?|lawns?|yard|backyard|mow(?:ing|er)?|hedges?|weeds?|weeding|prun(?:e|ing)|landscap\w+|irrigation)\b/, 4],
    [/\b(pool|swimming pool)\b/, 4],
    [/\b(patio|deck|paving|braai area|stoep|veranda|verandah|courtyard)\b/, 2.5],
    [/\b(gutters?|driveway|fence|fences|fencing|roof|exterior|outdoors?|pressure wash\w*|jet wash\w*)\b/, 3],
    [/\b(shrubs?|flower ?beds?|plants?|trees?|leaves|compost)\b/, 2],
    [/\b(dog walk\w*|walk (?:my |our |the )?dogs?|dog walker)\b/, 4.5],
    [/\boutside\b/, 1],
  ],
  "Mom's Helper": [
    [/\b(mom'?s? helper|mother'?s? helper|mommy'?s? helper|mum'?s? helper|nanny|nannies|au pair|babysit\w*|baby ?sit\w*|childcare|child care|child ?minder)\b/, 5],
    [/\b(kids?|child|children|toddlers?|babies|baby|newborn|infant|son|daughter)\b/, 2],
    [/\b(school (?:run|pick ?up|pickup|drop ?off|collect\w*)|pick ?up (?:the |my |our )?(?:kids|children)|collect (?:the |my |our )?(?:kids|children)|homework|after[- ]?school|creche|daycare|play ?date|play supervision)\b/, 3],
    [/\b(busy mom|working mom|single mom|new mom|mom|mum|mommy)\b/, 0.5],
  ],
  'Elder Care': [
    [/\b(elder|elderly|senior citizens?|seniors?|pensioner|retiree|retirement|frail|frailty|dementia|alzheimer\w*|bedridden|wheelchair|caregiver|care ?giver|carer|old age|palliative|home ?based care)\b/, 4.5],
    [/\b(?:my|our)\s+(?:old|ageing|aging)\s+(?:mother|father|mom|dad|mum|parents?|gran\w*|grand\w*|aunt|uncle)\b/, 5],
    [/\b(gran(?:ny|dma|dpa)?|grand(?:mother|father|parents?|ma|pa))\b/, 1.5],
    [/\b(companion(?:ship)?|medications?|medicine|pills|meds|check on (?:him|her|them)|sitter|home care|personal care|bathing)\b/, 3],
    [/\b(?:a bit of|some|keep (?:him|her|them|my \w+)) company\b/, 3],
  ],
  'Indoor Services': [
    [/\b(house|home|flat|apartment|townhouse|studio|bachelor)\b/, 1.5],
    [/\b(?:my|our) place\b/, 1.5],
    [HOUSE_CLEAN_RE, 2.5],
    [/\b(bed ?rooms?)\b|\b\d+ ?bed\b/, 1],
    [/\b(lounge|living room|kitchen|bathrooms?|toilets?|floors?|carpets?|mop(?:ping)?|vacuum(?:ing)?|dust(?:ing)?)\b/, 0.75],
    [/\b(clean(?:ing|er|ers)?|tidy|tidying)\b/, 0.75],
    [/\b(deep clean|spring clean|domestic|maid|housekeep\w*)\b/, 1.5],
  ],
};

// When scores tie, the more specific service wins.
const PRIORITY = [
  'Event Cleaning', 'Moving Cleaning', 'Laundry & Ironing', 'Office Cleaning', 'Outdoor Services',
  "Mom's Helper", 'Elder Care', 'Indoor Services',
];

function scoreServices(t) {
  const scores = {};
  for (const [service, list] of Object.entries(SIGNALS)) {
    let sum = 0;
    for (const [re, weight] of list) if (re.test(t)) sum += weight;
    scores[service] = sum;
  }

  // "washing" on its own is weak (window washing, car washing...)
  if (/\bwashing\b/.test(t) && !/\b(windows?|pressure|car|dish|dishes|floor|floors)\s+washing\b/.test(t)) {
    scores['Laundry & Ironing'] += 1.5;
  }

  // "clean the house and do the ironing" is a house clean with ironing as an extra
  if (HOUSE_CLEAN_RE.test(t)) scores['Laundry & Ironing'] *= 0.5;

  // Ages: "82 years old" points to elder care, "5 years old" to a child helper.
  const age = t.match(/\b(\d{1,3})[- ]?(?:years? old|yrs? old|y\/o|yo)\b/);
  if (age) {
    const n = Number(age[1]);
    if (n >= 65) scores['Elder Care'] += 4;
    else if (n <= 12) scores["Mom's Helper"] += 3;
  }
  return scores;
}

function pickService(scores, currentService) {
  const ranked = Object.entries(scores).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    if (a[0] === currentService) return -1;
    if (b[0] === currentService) return 1;
    return PRIORITY.indexOf(a[0]) - PRIORITY.indexOf(b[0]);
  });
  const [topName, top] = ranked[0];
  const second = ranked[1][1];
  if (top < 1.5) return { serviceType: null, confidence: 'low', top, second };
  let confidence = 'low';
  if (top >= 6 || (top >= 4 && top >= second * 1.8)) confidence = 'high';
  else if (top >= 2 && top > second) confidence = 'medium';
  return { serviceType: topName, confidence, top, second };
}

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(2, '0');
const toYMD = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const fromYMD = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const addDays = (d, n) => {
  const x = new Date(d.getTime());
  x.setUTCDate(x.getUTCDate() + n);
  return x;
};
const makeDate = (y, m, d) => {
  const dt = new Date(Date.UTC(y, m, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m && dt.getUTCDate() === d ? dt : null;
};

const MONTH_INDEX = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
const MONTH_RE = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
const monthIdx = (name) => MONTH_INDEX[name.slice(0, 3)];
const WEEKDAYS = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
const UNIT_AFTER = '(?!\\s*(?:bed|bath|hours?|hrs?|people|guests?|loads?|items?|kids|children|staff|employees|rooms?))';

function extractDate(t, today, notes) {
  const year = today.getUTCFullYear();
  const done = (date, matched) => ({ date, rest: t.replace(matched, ' ') });

  // a date without a year that has already passed means next year
  const roll = (m, d) => {
    let dt = makeDate(year, m, d);
    if (dt && dt < today) dt = makeDate(year + 1, m, d);
    return dt;
  };
  const fullYear = (y) => (y < 100 ? 2000 + y : y);
  const fixPast = (dt, matched) => {
    if (dt && dt < today) {
      notes.push('That date has already passed, so please pick a new date.');
      return { date: null, rest: t.replace(matched, ' ') };
    }
    return done(dt, matched);
  };

  let m = t.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
  if (m) return fixPast(makeDate(+m[1], +m[2] - 1, +m[3]), m[0]);

  m = t.match(new RegExp('\\b(\\d{1,2})\\/(\\d{1,2})(?:\\/(\\d{2,4}))?\\b' + UNIT_AFTER));
  if (m && +m[2] >= 1 && +m[2] <= 12) {
    const dt = m[3] ? makeDate(fullYear(+m[3]), +m[2] - 1, +m[1]) : roll(+m[2] - 1, +m[1]);
    if (dt) return m[3] ? fixPast(dt, m[0]) : done(dt, m[0]);
  }

  m = t.match(/\b(\d{1,2})\.(\d{1,2})\.(\d{2,4})\b/);
  if (m) {
    const dt = makeDate(fullYear(+m[3]), +m[2] - 1, +m[1]);
    if (dt) return fixPast(dt, m[0]);
  }

  m = t.match(new RegExp('\\b(\\d{1,2})(?:st|nd|rd|th)?\\s*(?:of\\s+)?' + MONTH_RE + '\\b(?:\\s*,?\\s*(20\\d{2}))?'));
  if (m) {
    const mi = monthIdx(m[2]);
    const dt = m[3] ? makeDate(+m[3], mi, +m[1]) : roll(mi, +m[1]);
    if (dt) return m[3] ? fixPast(dt, m[0]) : done(dt, m[0]);
  }

  m = t.match(new RegExp('\\b' + MONTH_RE + '\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b' + UNIT_AFTER + '(?:\\s*,?\\s*(20\\d{2}))?'));
  if (m) {
    const mi = monthIdx(m[1]);
    const dt = m[3] ? makeDate(+m[3], mi, +m[2]) : roll(mi, +m[2]);
    if (dt) return m[3] ? fixPast(dt, m[0]) : done(dt, m[0]);
  }

  m = t.match(/\bin (\d{1,2}) (days?|weeks?)\b/);
  if (m) return done(addDays(today, +m[1] * (m[2].startsWith('week') ? 7 : 1)), m[0]);

  m = t.match(/\bday after tomorrow\b/);
  if (m) return done(addDays(today, 2), m[0]);
  m = t.match(/\btomorrow\b/);
  if (m) return done(addDays(today, 1), m[0]);
  m = t.match(/\b(today|tonight|this (?:morning|afternoon|evening))\b/);
  if (m) return done(today, m[1] === 'today' ? m[0] : '');

  const dow = today.getUTCDay();
  const nextWeek = /\bnext week\b/.test(t);
  m = t.match(/\b(?:(next|this|coming|on|by)\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tues?|wed|thu(?:rs?)?|fri|sat)\b/);
  if (m && (m[2].endsWith('day') || m[1])) {
    const full = Object.keys(WEEKDAYS).find((d) => d.startsWith(m[2].slice(0, 3)));
    const target = WEEKDAYS[full];
    if (nextWeek) {
      const nextMonday = addDays(today, ((1 - dow + 7) % 7) || 7);
      return done(addDays(nextMonday, (target + 6) % 7), m[0] + '|next week');
    }
    let delta = (target - dow + 7) % 7;
    if (delta === 0 && m[1] !== 'this') delta = 7;
    return done(addDays(today, delta), m[0]);
  }

  m = t.match(/\b(next |this |the )?week ?ends?\b/);
  if (m) {
    let delta = (6 - dow + 7) % 7;
    if (dow === 0) delta = 0; // it is already the weekend
    if (m[1] === 'next ') delta += 7;
    return done(addDays(today, delta), m[0]);
  }

  m = t.match(/\bnext week\b/);
  if (m) return done(addDays(today, ((1 - dow + 7) % 7) || 7), m[0]);

  m = t.match(/\bnext month\b/);
  if (m) {
    const dt = makeDate(today.getUTCFullYear(), today.getUTCMonth() + 1, 1) || addDays(today, 30);
    return done(dt, m[0]);
  }

  m = t.match(/\bend of (?:the |this )?month\b/);
  if (m) return done(makeDate(year, today.getUTCMonth() + 1, 0) || today, m[0]);

  m = t.match(/\bthe (\d{1,2})(?:st|nd|rd|th)\b/);
  if (m) {
    let dt = makeDate(year, today.getUTCMonth(), +m[1]);
    if (dt && dt < today) dt = makeDate(year, today.getUTCMonth() + 1, +m[1]);
    if (dt) return done(dt, m[0]);
  }

  return { date: null, rest: t };
}

/* ------------------------------------------------------------------ */
/* Times                                                               */
/* ------------------------------------------------------------------ */

const toMinutes = (h, min, meridiem) => {
  let hour = h;
  if (meridiem === 'pm' && hour < 12) hour += 12;
  else if (meridiem === 'am' && hour === 12) hour = 0;
  else if (!meridiem && hour >= 1 && hour <= 6) hour += 12; // "at 4" means 4pm
  return hour * 60 + (min || 0);
};

// A bare number ("at 9") is only a time when it ends the sentence or is followed by a
// time-ish word. Anything else ("about 3 baskets", "at 4 hours") is a quantity.
const TIME_AFTER_HOUR = "(?=\\s*(?:$|ish\\b|sharp\\b|please\\b|pls\\b|if\\b|and\\b|or\\b|to\\b|until\\b|till\\b|so\\b|but\\b|then\\b|on\\b|for\\b|in the\\b|tomorrow\\b|today\\b|tonight\\b|next\\b|this\\b|every\\b|each\\b|monday|tuesday|wednesday|thursday|friday|saturday|sunday|sat\\b|sun\\b|[,.;!?]))";

function extractTime(t) {
  let m;
  let minutes = null;
  let remove = null;
  let wordNote = false;

  if ((m = t.match(/\b(half|quarter) (past|to) (\d{1,2})\b/))) {
    const h = +m[3];
    const base = toMinutes(h, 0, null);
    minutes = m[1] === 'half' ? base + 30 : m[2] === 'past' ? base + 15 : base - 15;
    remove = m[0];
  } else if ((m = t.match(/\b(\d{1,2})[:h.](\d{2})\s*(am|pm|a\.m\.?|p\.m\.?)?(?![\d])/))) {
    const h = +m[1];
    const mi = +m[2];
    const mer = m[3] ? m[3][0] + 'm' : null;
    const okDot = m[0].includes('.') ? mer || (mi % 15 === 0 && h >= 6 && h <= 18) : true;
    if (h <= 23 && mi <= 59 && okDot && !/^\d{1,2}\.\d{2}\s*(?:hours?|hrs?)/.test(t.slice(m.index))) {
      minutes = toMinutes(h, mi, mer);
      remove = m[0];
    }
  }
  if (minutes === null && (m = t.match(/\b(\d{1,2})\s*(am|pm|a\.m\.?|p\.m\.?)(?![a-z])/))) {
    if (+m[1] >= 1 && +m[1] <= 12) {
      minutes = toMinutes(+m[1], 0, m[2][0] + 'm');
      remove = m[0];
    }
  }
  if (minutes === null) {
    m = t.match(new RegExp("(?:\\bat|@|\\baround|\\babout|\\bfrom|\\bby|\\bbefore|\\bafter|\\bstarting|\\bbetween|\\bstart)\\s+(\\d{1,2})(?:\\s*o'?clock)?\\b" + TIME_AFTER_HOUR));
    if (m && +m[1] >= 1 && +m[1] <= 23) {
      minutes = toMinutes(+m[1], 0, null);
      remove = m[0];
    } else if ((m = t.match(/\b(\d{1,2}) o'?clock\b/)) && +m[1] >= 1 && +m[1] <= 12) {
      minutes = toMinutes(+m[1], 0, null);
      remove = m[0];
    }
  }
  if (minutes === null) {
    if (/\b(early morning|first thing|crack of dawn|sunrise|before (?:the )?(?:opening|staff|work|office hours))\b/.test(t)) minutes = 7 * 60;
    else if (/\bmid[- ]?morning\b/.test(t)) minutes = 10 * 60;
    else if (/\b(morning|mornings)\b/.test(t)) minutes = 9 * 60;
    else if (/\b(noon|midday|lunch ?time)\b/.test(t)) minutes = 12 * 60;
    else if (/\b(afternoon|afternoons)\b/.test(t)) { minutes = 13 * 60; wordNote = true; }
    else if (/\b(evening|evenings|tonight|night)\b/.test(t)) { minutes = 18 * 60; wordNote = true; }
  }

  if (minutes === null) return { slot: null, rest: t };
  const rest = remove ? t.replace(remove, ' ') : t;
  return { slot: minutes, rest, wordNote };
}

function slotFromMinutes(minutes, notes) {
  let m = Math.round(minutes / 30) * 30;
  if (m < FIRST_SLOT_MIN) {
    m = FIRST_SLOT_MIN;
    notes.push('Our earliest start time is 07:00.');
  } else if (m > LAST_SLOT_MIN) {
    m = LAST_SLOT_MIN;
  }
  const f = (x) => `${pad(Math.floor(x / 60))}:${pad(x % 60)}`;
  const slot = `${f(m)} - ${f(m + 30)}`;
  return TIME_SLOTS.includes(slot) ? slot : null;
}

/* ------------------------------------------------------------------ */
/* Hours and service-specific options                                  */
/* ------------------------------------------------------------------ */

export function normalizeHours(service, hours) {
  const rule = HOURS_RULES[service];
  const n = Number(hours);
  if (!rule || !Number.isFinite(n)) return null;
  const stepped = rule.step === 1 ? Math.round(n) : Math.round(n * 2) / 2;
  return Math.min(rule.max, Math.max(rule.min, stepped));
}

function explicitHours(t) {
  let m = t.match(/\b(\d+(?:\.\d+)?)\s*(?:-|to|or)\s*(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\b/);
  if (m) return Math.max(+m[1], +m[2]);
  m = t.match(/\b(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\b/);
  if (m) return +m[1];
  m = t.match(/\b(\d+(?:\.\d+)?)h\b(?!\d)/);
  if (m && +m[1] <= 12) return +m[1];
  if (/\b(full|whole|entire|all)[- ]day\b/.test(t)) return 8;
  if (/\bhalf (?:a )?day\b|\bhalf-day\b/.test(t)) return 4;
  if (/\b(couple of|couple) hours\b/.test(t)) return 2;
  if (/\b(few|several) hours\b/.test(t)) return 3;
  return null;
}

const bedroomCount = (t) => {
  const m = t.match(/\b(\d{1,2})\s*-?\s*(?:bed ?rooms?|bdrm|br|bed)\b/);
  return m ? +m[1] : null;
};

function homeSizeFrom(t, bedrooms) {
  if (bedrooms != null) return bedrooms <= 2 ? 'small' : bedrooms <= 4 ? 'medium' : 'large';
  if (/\b(studio|bachelor|tiny|small (?:flat|apartment|house|place|home))\b/.test(t)) return 'small';
  if (/\b(mansion|huge|double[- ]storey|big house|large (?:house|home)|big home)\b/.test(t)) return 'large';
  return null;
}

function estimateHours(service, t, ctx) {
  const { bedrooms, extraCount } = ctx;
  let h;
  const deep = /\b(deep|spring|thorough|filthy|very dirty|neglected|move[- ]?out|move[- ]?in)\b/.test(t);
  const messy = /\b(messy|dirty|after (?:a |the )?party)\b/.test(t);
  const light = /\b(quick|light|touch[- ]?up|maintenance|just tidy)\b/.test(t);

  switch (service) {
    case 'Indoor Services': {
      if (bedrooms != null) h = bedrooms <= 1 ? 3 : bedrooms === 2 ? 4 : bedrooms === 3 ? 5 : bedrooms === 4 ? 6 : 7;
      else if (homeSizeFrom(t, null) === 'small') h = 3;
      else if (homeSizeFrom(t, null) === 'large') h = 7;
      if (h == null) {
        // no size given: only guess when the customer said how thorough it should be
        if (deep) return normalizeHours(service, 7);
        if (light) return normalizeHours(service, 4);
        return null;
      }
      h += (deep ? 2 : messy ? 1 : 0) - (light ? 1 : 0);
      break;
    }
    case 'Outdoor Services': {
      if (extraCount === 0 && !/\b(large|big|huge|acre)\b/.test(t) && !/\b(small|tiny)\b/.test(t)) return null;
      h = 3.5 + 0.5 * extraCount;
      if (/\b(large|big|huge|acre|overgrown)\b/.test(t)) h += 1.5;
      if (/\b(small|tiny)\b/.test(t)) h -= 0.5;
      break;
    }
    case 'Office Cleaning': {
      const staff = t.match(/\b(\d{1,3})\s*(?:staff|employees|people|desks|workers)\b/);
      if (staff) {
        const n = +staff[1];
        h = n <= 10 ? 3 : n <= 30 ? 4.5 : n <= 60 ? 6 : 8;
      } else if (/\b(whole|entire) building\b/.test(t)) h = 8;
      else if (/\b(small office)\b/.test(t)) h = 3;
      else if (/\b(large|big)\b/.test(t)) h = 6;
      else return null;
      break;
    }
    case 'Moving Cleaning': {
      if (bedrooms != null) h = bedrooms <= 1 ? 3 : bedrooms === 2 ? 4 : bedrooms === 3 ? 5.5 : bedrooms === 4 ? 6.5 : 8;
      else if (homeSizeFrom(t, null) === 'small') h = 3.5;
      else if (homeSizeFrom(t, null) === 'large') h = 7;
      else return null;
      if (/\b(oven|carpets?|windows?)\b/.test(t)) h += 0.5;
      break;
    }
    case "Mom's Helper":
    case 'Elder Care':
      if (/\b(after[- ]?school|few hours)\b/.test(t)) h = 3;
      else return null;
      break;
    default:
      return null;
  }
  return normalizeHours(service, h);
}

function laundryBundleFrom(t) {
  const byCount = (n, steps) => {
    const keys = ['small', 'family', 'busyWeek', 'bigWash', 'mega'];
    for (let i = 0; i < steps.length; i++) if (n <= steps[i]) return keys[i];
    return 'unlimited';
  };
  let m = t.match(/\b(\d{1,3})\s*(?:\+)?\s*(?:wash )?(?:loads?|baskets?|bags?)\b/);
  if (m) return byCount(+m[1], [2, 4, 6, 8, 10]);
  m = t.match(/\b(\d{1,3})\s*(?:\+)?\s*(?:items?|pieces?|garments?|shirts|clothes)\b/);
  if (m) return byCount(+m[1], [15, 30, 45, 60, 75]);
  if (/\b(unlimited|huge|mountain|piles)\b/.test(t)) return 'unlimited';
  if (/\b(mega|very big)\b/.test(t)) return 'mega';
  if (/\b(big wash|big load|lots of|plenty of)\b/.test(t)) return 'bigWash';
  if (/\b(busy week|whole week|week'?s? (?:worth|of))\b/.test(t)) return 'busyWeek';
  if (/\b(family|household)\b/.test(t)) return 'family';
  if (/\b(small|a few|couple|just a bit|little)\b/.test(t)) return 'small';
  return null;
}

function eventDetails(t) {
  const out = {};
  const g = t.match(/\b(\d{1,4})\s*\+?\s*(?:guests?|people|persons|pax|attendees|visitors)\b/);
  let size = null;
  if (g) {
    const n = +g[1];
    size = n <= 50 ? 'small' : n <= 150 ? 'medium' : n <= 300 ? 'large' : 'extraLarge';
  } else if (/\b(intimate|small gathering|house party|few friends)\b/.test(t)) size = 'small';
  else if (/\b(huge|massive|very big)\b/.test(t)) size = 'large';
  if (size) {
    out.eventSize = size;
    out.eventPackage = size;
    out.eventGuestCount = EVENT_SIZES[size].guests;
  }

  const pre = /\b(before|pre[- ]?(?:event|party|wedding)|set ?up|setting up|prepare|preparation)\b/.test(t);
  const during = /\b(during|throughout|while|ongoing|on the day|all night)\b/.test(t);
  const post = /\b(after|afterwards|post[- ]?(?:event|party|wedding)|clean ?up|clean-up|mess|aftermath|morning after|leftover)\b/.test(t);
  if (/\b(everything|full package|all stages|whole event|start to finish|before,? during|before and after|pre and post)\b/.test(t) || (pre && post) || (pre && during) || (during && post)) {
    out.eventCleaningScope = 'fullPackage';
  } else if (post) out.eventCleaningScope = 'postDeepClean';
  else if (during) out.eventCleaningScope = 'duringSupport';
  else if (pre) out.eventCleaningScope = 'preSetup';
  else if (/\b(basic|just the venue|venue only)\b/.test(t)) out.eventCleaningScope = 'base';
  return out;
}

function officeRequests(t) {
  const flags = {
    extraProviders: /\b(extra|more|additional|another) (?:cleaners?|staff|people|providers?)\b|\bteam of\b/.test(t),
    highRiskAreas: /\b(high[- ]risk|hazard\w*|server room|laborator\w+|lab|clinic|medical|sensitive area)\b/.test(t),
    earlyMorning: /\b(early morning|before (?:the )?(?:staff|work|opening|office hours)|first thing)\b/.test(t),
    afterHours: /\b(after[- ]?hours|after (?:work|closing|5)|outside (?:of )?office hours|weekend)\b/.test(t),
    biohazard: /\b(biohazard|blood|bodily fluids?|sewage|mould|mold)\b/.test(t),
  };
  const on = Object.fromEntries(Object.entries(flags).filter(([, v]) => v));
  return Object.keys(on).length ? on : null;
}

/* ------------------------------------------------------------------ */
/* Location, urgency                                                   */
/* ------------------------------------------------------------------ */

const PLACES = [
  'Johannesburg', 'Joburg', 'Sandton', 'Randburg', 'Midrand', 'Centurion', 'Pretoria', 'Cape Town',
  'Durban', 'Soweto', 'Fourways', 'Rosebank', 'Bryanston', 'Roodepoort', 'Benoni', 'Boksburg',
  'Kempton Park', 'Bloemfontein', 'Gqeberha', 'Port Elizabeth', 'Stellenbosch', 'Umhlanga',
  'Sea Point', 'Bedfordview', 'Edenvale', 'Alberton', 'Krugersdorp', 'Polokwane', 'Nelspruit',
  'East London', 'Pietermaritzburg', 'Ballito', 'Century City', 'Claremont', 'Rondebosch',
];
const NOT_PLACES = new Set([
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'January', 'February',
  'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
  'I', 'The', 'My', 'Our', 'We', 'Tomorrow', 'Today', 'Tonight', 'Next', 'This',
]);

function extractLocation(raw) {
  const text = String(raw || '').slice(0, 1500);
  for (const place of PLACES) {
    if (new RegExp(`\\b${place}\\b`, 'i').test(text)) return place;
  }
  const m = text.match(/\b(?:in|at|near|around)\s+([A-Z][A-Za-z'’-]+(?:\s+[A-Z][A-Za-z'’-]+){0,2})/);
  if (m) {
    const first = m[1].split(/\s+/)[0];
    if (!NOT_PLACES.has(first)) return m[1];
  }
  return null;
}

function urgencyFrom(t) {
  if (/\b(urgent|urgently|asap|as soon as possible|immediately|right away|right now|emergency|straight away|today|tonight|this morning|this afternoon|last minute)\b/.test(t)) return 'urgent';
  if (/\b(flexible|whenever|no rush|any ?time|not urgent)\b/.test(t)) return 'flexible';
  return 'normal';
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function localToday(date = new Date()) {
  return {
    today: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    nowMinutes: date.getHours() * 60 + date.getMinutes(),
  };
}

export function zonedToday(timeZone = 'Africa/Johannesburg', date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type) => Number(parts.find((p) => p.type === type)?.value);
  return {
    today: `${get('year')}-${pad(get('month'))}-${pad(get('day'))}`,
    nowMinutes: get('hour') * 60 + get('minute'),
  };
}

export function matchService(description, opts = {}) {
  const clock = opts.today ? { today: opts.today, nowMinutes: opts.nowMinutes ?? null } : localToday();
  const today = fromYMD(clock.today);
  const notes = [];

  const t0 = prepare(description);

  const scores = scoreServices(t0);
  const picked = pickService(scores, opts.currentService);
  const svc = picked.serviceType || (SERVICE_TYPES.includes(opts.currentService) ? opts.currentService : 'Indoor Services');

  const dateResult = extractDate(t0, today, notes);
  const timeResult = extractTime(dateResult.rest);
  let scheduledTime = null;
  if (timeResult.slot !== null) {
    scheduledTime = slotFromMinutes(timeResult.slot, notes);
    const startMin = timeResult.slot;
    if (timeResult.slot > LAST_SLOT_MIN && scheduledTime) {
      notes.push(`Our start times run 07:00 to 13:00, so we picked the closest one (${scheduledTime.slice(0, 5)}).`);
    }
    if (clock.nowMinutes != null && dateResult.date && toYMD(dateResult.date) === clock.today && startMin <= clock.nowMinutes) {
      notes.push('That time has already passed today, so please check the date.');
    }
  }
  const scheduledDate = dateResult.date ? toYMD(dateResult.date) : null;

  // extras for the service we are booking
  const extraTasks = [];
  for (const [id, , re] of SERVICE_EXTRAS[svc] || []) if (re.test(t0)) extraTasks.push(id);
  // "pool" and "gutters" etc. must not trigger "windows" just because of "glass"
  const bedrooms = bedroomCount(t0);

  const result = {
    serviceType: picked.serviceType,
    confidence: picked.confidence,
    hoursNeeded: null,
    hoursExplicit: false,
    urgency: urgencyFrom(t0),
    location: extractLocation(description),
    scheduledDate,
    scheduledTime,
    extraTasks,
    homeSize: null,
    eventSize: null,
    eventGuestCount: null,
    eventPackage: null,
    eventCleaningScope: null,
    laundryBundle: null,
    officeSpecialRequests: null,
    notes,
    source: 'local',
  };

  if (svc === 'Indoor Services') result.homeSize = homeSizeFrom(t0, bedrooms);

  if (svc === 'Event Cleaning') {
    Object.assign(result, eventDetails(t0));
  } else if (svc === 'Laundry & Ironing') {
    const bundle = laundryBundleFrom(t0);
    if (bundle) {
      result.laundryBundle = bundle;
      result.hoursNeeded = LAUNDRY_BUNDLES[bundle].hours;
    }
  } else {
    const explicit = explicitHours(t0);
    if (explicit != null) {
      const fixed = normalizeHours(svc, explicit);
      result.hoursNeeded = fixed;
      result.hoursExplicit = true;
      if (fixed != null && fixed > explicit) {
        notes.push(`The minimum for ${svc} is ${fixed} hours, so we set it to ${fixed}.`);
      }
    } else {
      result.hoursNeeded = estimateHours(svc, t0, { bedrooms, extraCount: extraTasks.length });
    }
    if (svc === 'Office Cleaning') result.officeSpecialRequests = officeRequests(t0);
  }

  return result;
}

// Turns a match into the next bookingDetails object. Only fields that were
// actually detected are changed, so nothing the customer already chose is wiped.
export function applyMatchToDetails(prev, r) {
  const next = { ...prev };
  const service = r.serviceType || prev.serviceType;
  const changed = service !== prev.serviceType;
  next.serviceType = service;

  const valid = new Set((SERVICE_EXTRAS[service] || []).map(([id]) => id));
  const kept = changed ? [] : (prev.extraTasks || []).filter((id) => valid.has(id));
  next.extraTasks = Array.from(new Set([...kept, ...(r.extraTasks || []).filter((id) => valid.has(id))]));

  if (service === 'Laundry & Ironing') {
    if (r.laundryBundle) {
      next.laundryBundle = r.laundryBundle;
      next.hoursNeeded = LAUNDRY_BUNDLES[r.laundryBundle].hours;
    }
  } else if (service !== 'Event Cleaning') {
    if (r.hoursNeeded != null) next.hoursNeeded = r.hoursNeeded;
    else if (changed) next.hoursNeeded = normalizeHours(service, prev.hoursNeeded) ?? prev.hoursNeeded;
  }

  if (service === 'Indoor Services' && r.homeSize) next.homeSize = r.homeSize;

  if (service === 'Event Cleaning') {
    if (r.eventSize) {
      next.eventSize = r.eventSize;
      next.eventPackage = r.eventPackage || r.eventSize;
      next.eventGuestCount = r.eventGuestCount || EVENT_SIZES[r.eventSize].guests;
    }
    if (r.eventCleaningScope) next.eventCleaningScope = r.eventCleaningScope;
  }

  if (service === 'Office Cleaning' && r.officeSpecialRequests) {
    next.officeSpecialRequests = { ...(prev.officeSpecialRequests || {}), ...r.officeSpecialRequests };
  }

  if (r.scheduledDate) next.scheduledDate = r.scheduledDate;
  if (r.scheduledTime) next.scheduledTime = r.scheduledTime;
  if (r.urgency) next.urgency = r.urgency;
  return next;
}

const prettyDate = (ymd) =>
  fromYMD(ymd).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });

// What we understood, for the little chips under the matcher.
export function summarizeDetails(d) {
  const out = [{ key: 'service', label: 'Service', value: d.serviceType }];
  if (d.serviceType === 'Indoor Services' && d.homeSize) out.push({ key: 'home', label: 'Home', value: HOME_SIZES[d.homeSize] });
  if (d.serviceType === 'Laundry & Ironing') {
    if (d.laundryBundle) out.push({ key: 'bundle', label: 'Bundle', value: LAUNDRY_BUNDLES[d.laundryBundle].label });
  } else if (d.serviceType === 'Event Cleaning') {
    if (d.eventSize) out.push({ key: 'size', label: 'Event size', value: `${EVENT_SIZES[d.eventSize].label} (${EVENT_SIZES[d.eventSize].guests})` });
    if (d.eventCleaningScope) out.push({ key: 'scope', label: 'Scope', value: EVENT_SCOPES[d.eventCleaningScope] });
  } else if (d.hoursNeeded) {
    out.push({ key: 'hours', label: 'Hours', value: `${d.hoursNeeded} hours` });
  }
  if (d.scheduledDate) out.push({ key: 'date', label: 'Date', value: prettyDate(d.scheduledDate) });
  if (d.scheduledTime) out.push({ key: 'time', label: 'Start', value: d.scheduledTime.slice(0, 5) });
  const labels = Object.fromEntries((SERVICE_EXTRAS[d.serviceType] || []).map(([id, label]) => [id, label]));
  const extras = (d.extraTasks || []).map((id) => labels[id]).filter(Boolean);
  if (extras.length) out.push({ key: 'extras', label: 'Extras', value: extras.join(', ') });
  return out;
}

// Fields the customer still has to fill in before they can continue.
export function missingFields(d) {
  const missing = [];
  if (!d.scheduledDate) missing.push('a date');
  if (!d.scheduledTime) missing.push('a start time');
  if (d.serviceType === 'Event Cleaning') {
    if (!d.eventSize) missing.push('the event size');
    if (!d.eventCleaningScope) missing.push('the cleaning scope');
  }
  if (d.serviceType === 'Laundry & Ironing' && !d.laundryBundle) missing.push('a laundry bundle');
  return missing;
}