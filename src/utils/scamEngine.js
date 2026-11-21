/*
 * TRUSTTRAP scam detection engine.
 * Deterministic, rule-based, runs entirely in the browser.
 * Every score is the sum of the weights of rules that matched, capped at 100.
 * This is an educational tool. It cannot verify whether a message is genuine.
 */

export const MIN_ANALYSIS_LENGTH = 10;

export const RISK_LEVELS = [
  { key: 'LOW', label: 'LOW RISK', min: 0, tone: 'safe', headline: 'Few known warning signs were found.' },
  { key: 'CAUTION', label: 'CAUTION', min: 25, tone: 'warn', headline: 'Several warning signs. Verify before you act.' },
  { key: 'HIGH', label: 'HIGH RISK', min: 50, tone: 'danger', headline: 'Strong scam indicators are present.' },
  { key: 'CRITICAL', label: 'CRITICAL RISK', min: 75, tone: 'critical', headline: 'Multiple high-severity scam patterns were matched.' },
];

const RISKY_TLDS = ['xyz', 'top', 'click', 'link', 'buzz', 'tk', 'ml', 'ga', 'cf', 'gq', 'online', 'site', 'shop', 'live', 'icu'];
const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'rb.gy', 'is.gd', 'cutt.ly'];
const LURE_RE = /(verify|secure|login|signin|kyc|update|refund|wallet|claim|reward)/i;
const IP_HOST_RE = /^\d{1,3}(\.\d{1,3}){3}$/;
const RISKY_TLD_RE = new RegExp(`\\.(?:${RISKY_TLDS.join('|')})$`, 'i');

const escapeDots = (s) => s.replace(/\./g, '\\.');

const URL_RE = new RegExp(
  `(?:https?:\\/\\/|www\\.)\\S+` +
    `|\\b(?:${SHORTENERS.map(escapeDots).join('|')})\\/\\S*` +
    `|\\b[a-z0-9-]+(?:\\.[a-z0-9-]+)*\\.(?:${RISKY_TLDS.join('|')})\\b(?:\\/\\S*)?`,
  'gi'
);

const WINDOW = 40;

/** Returns true if a negation word appears shortly before the index, e.g. "never share" or "do not share". */
function isNegated(text, index) {
  const before = text.slice(Math.max(0, index - WINDOW), index).toLowerCase();
  return /\b(never|do not|don'?t|will not|won'?t|not)\b[^.!?\n]*$/.test(before);
}

/** Returns the first match of a regex, optionally skipping matches that are negated. */
function findMatch(text, regex, ignoreNegated = false) {
  const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
  const re = new RegExp(regex.source, flags);
  for (const m of text.matchAll(re)) {
    if (!ignoreNegated || !isNegated(text, m.index)) return m[0];
  }
  return null;
}

function extractUrls(text) {
  return [...text.matchAll(URL_RE)].map((m) => m[0]);
}

function hostOf(url) {
  return url
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split(/[/?#:]/)[0]
    .toLowerCase();
}

function clip(s) {
  return s.length > 80 ? `${s.slice(0, 77)}…` : s;
}

const PAYMENT_VERB = /\b(pay|payment|transfer|send|deposit|registration fee|processing fee|activation fee|security deposit|refundable)\b/i;
const PAYMENT_AMOUNT = /(₹\s?\d|rs\.?\s?\d|inr\s?\d|\$\s?\d|\b\d[\d,]*\s?(?:rs|inr|rupees)\b)/i;

/**
 * Rule definitions. Each rule has a weight, a category, and an explanation.
 * detect(text) returns the matched evidence string, or null.
 */
const RULES = [
  {
    id: 'urgency',
    category: 'Pressure tactics',
    title: 'Urgency or deadline pressure',
    weight: 15,
    detect: (t) =>
      findMatch(t, /\b(urgent(?:ly)?|immediately|act now|last chance|final (?:warning|notice)|(?:within|in) \d+\s*(?:hours?|hrs?|minutes?|mins?)|expires? (?:today|soon)|today only)\b/i),
    explanation:
      'Scammers rush you so you do not stop to verify. Legitimate organisations rarely demand action within minutes.',
  },
  {
    id: 'threat',
    category: 'Pressure tactics',
    title: 'Threat of account closure or legal action',
    weight: 15,
    detect: (t) =>
      findMatch(t, /\b(account (?:will be )?(?:blocked|suspended|closed|deactivated)|legal action|arrest(?:ed)?|police case|penalty|fir (?:will|has) be)\b/i),
    explanation:
      'Fear is one of the strongest scam levers. Banks and government bodies do not threaten arrest or account closure through unsolicited messages.',
  },
  {
    id: 'secrecy',
    category: 'Pressure tactics',
    title: 'Asks you to keep it secret',
    weight: 20,
    detect: (t) =>
      findMatch(t, /\b(do not tell|don'?t tell|keep (?:this|it) (?:secret|confidential)|don'?t (?:inform|share (?:this|it) with) (?:anyone|your (?:family|bank))|between us)\b/i),
    explanation:
      'Secrecy isolates you from people who could warn you. Real organisations do not ask you to hide communications from family or your bank.',
  },
  {
    id: 'otp',
    category: 'Credential requests',
    title: 'OTP, PIN or CVV request',
    weight: 35,
    detect: (t) => findMatch(t, /\b(otp|one[- ]time password|verification code|cvv|mpin|upi pin)\b/i, true),
    explanation:
      'Banks, couriers and employers never need your OTP, PIN or CVV. These codes prove that you are the account owner, so asking for them is a direct attempt to take over your account.',
  },
  {
    id: 'credentials',
    category: 'Credential requests',
    title: 'Request for passwords or identity details',
    weight: 30,
    detect: (t) =>
      findMatch(
        t,
        /\b(password|passcode|net ?banking (?:id|password)|login (?:details|credentials)|aadhaar|pan (?:card )?(?:number|details)|(?:bank )?account (?:number|details)|card (?:number|details))\b/i,
        true
      ),
    explanation:
      'Sensitive identity and login details are rarely needed through an unsolicited message. Once shared, they can be used to access your accounts or open new ones in your name.',
  },
  {
    id: 'payment',
    category: 'Payment demands',
    title: 'Upfront payment or fee demand',
    weight: 30,
    detect: (t) => {
      const verb = findMatch(t, PAYMENT_VERB);
      const amount = findMatch(t, PAYMENT_AMOUNT);
      return verb && amount ? `"${verb}" alongside "${amount}"` : null;
    },
    explanation:
      'Asking you to pay to receive a job, prize, parcel or refund is a classic scam pattern. Genuine employers and prize programmes do not require upfront fees.',
  },
  {
    id: 'payment_method',
    category: 'Payment demands',
    title: 'Unusual payment method',
    weight: 25,
    detect: (t) =>
      findMatch(t, /\b(gift cards?|google play|itunes|bitcoin|crypto|usdt|usdc|wallet address)\b/i),
    explanation:
      'Gift cards and cryptocurrency are hard to reverse, which is why scammers prefer them. Ordinary businesses almost never ask for payment this way.',
  },
  {
    id: 'reward',
    category: 'Unrealistic promises',
    title: 'Unrealistic reward or prize',
    weight: 25,
    detect: (t) =>
      findMatch(
        t,
        /\b(lottery|jackpot|you (?:have )?won|winner|lucky draw|congratulations!?|guaranteed (?:income|salary|returns?)|earn (?:₹|rs\.?|\$)?\s?\d[\d,]*\s*(?:per|a|every) (?:day|hour|week)|no interview|no experience (?:needed|required))\b/i
      ),
    explanation:
      'Prizes you never entered for and income that is high, guaranteed and effortless are the core bait of many scams.',
  },
  {
    id: 'job',
    category: 'Unrealistic promises',
    title: 'Job or internship offer',
    weight: 15,
    detect: (t) =>
      findMatch(t, /\b(job offer|internship|hiring|selected for|part[- ]time job|work from home|data entry)\b/i),
    explanation:
      'Job offers alone are common and often legitimate. They become a warning sign when combined with fees, rewards, or pressure to act quickly.',
  },
  {
    id: 'remote',
    category: 'Device takeover',
    title: 'Asks you to install an app or file',
    weight: 25,
    detect: (t) =>
      findMatch(t, /\b(anydesk|teamviewer|quicksupport|rustdesk|\.apk|install (?:the |this )?app|download (?:the |this )?app)\b/i),
    explanation:
      'Remote-access tools and APK files can give a stranger control of your phone, including your banking apps and messages.',
  },
  {
    id: 'impersonation',
    category: 'Impersonation',
    title: 'Claims to be a bank, government body, courier or major brand',
    weight: 15,
    detect: (t) =>
      findMatch(
        t,
        /\b(sbi|hdfc|icici|axis bank|bank of|rbi|income tax|customs|police|cyber cell|fedex|dhl|bluedart|amazon|flipkart|paytm|phonepe|google pay|microsoft|apple|customer (?:support|care|service))\b/i
      ),
    explanation:
      'Scammers borrow trusted names. Claiming an affiliation is easy, so confirm the sender through the organisation\'s official channels.',
  },
  {
    id: 'kyc',
    category: 'Impersonation',
    title: 'KYC or account re-verification request',
    weight: 15,
    detect: (t) =>
      findMatch(t, /\b(kyc|re-?verify|update your (?:kyc|account|details)|link your (?:pan|aadhaar|account))\b/i),
    explanation:
      'Fake KYC updates are one of the most common banking scams. Real KYC updates are done inside your bank\'s official app or branch.',
  },
  {
    id: 'url_ip',
    category: 'Suspicious links',
    title: 'Link points to a raw IP address',
    weight: 25,
    detect: (t) => extractUrls(t).find((u) => IP_HOST_RE.test(hostOf(u))) ?? null,
    explanation:
      'Legitimate services use named domains. A bare IP address hides who owns the site and is common in phishing pages.',
  },
  {
    id: 'url_tld',
    category: 'Suspicious links',
    title: 'Link uses a domain extension often abused by scams',
    weight: 20,
    detect: (t) => extractUrls(t).find((u) => RISKY_TLD_RE.test(hostOf(u))) ?? null,
    explanation:
      'These extensions are cheap and often used for throwaway scam sites. This is not proof on its own, but it is a meaningful signal when other flags are present.',
  },
  {
    id: 'url_shortener',
    category: 'Suspicious links',
    title: 'Link hidden behind a URL shortener',
    weight: 15,
    detect: (t) => extractUrls(t).find((u) => SHORTENERS.includes(hostOf(u))) ?? null,
    explanation:
      'Shortened links hide the real destination. You cannot see where they lead before you tap.',
  },
  {
    id: 'url_lure',
    category: 'Suspicious links',
    title: 'Domain contains lure words',
    weight: 15,
    detect: (t) => extractUrls(t).find((u) => LURE_RE.test(hostOf(u))) ?? null,
    explanation:
      'Words like "secure", "verify" or "kyc" in a domain are used to make fake sites look official. The part directly before the final extension is the real owner of the site.',
  },
];

/** Public rule summary, used to show the methodology on the scanner page. */
export const SCORING_RULES = RULES.map(({ id, category, title, weight }) => ({ id, category, title, weight }));

function levelFor(score) {
  return RISK_LEVELS.findLast((level) => score >= level.min);
}

function buildSteps(flags, score) {
  const ids = new Set(flags.map((f) => f.id));
  const hasLinkFlag = flags.some((f) => f.category === 'Suspicious links');

  const steps = [
    'Do not click any link or reply to the message until you have verified the sender.',
    'Contact the organisation only through its official app, website, or the number printed on your card or on its official site. Never use the number given in the message.',
    'Never share an OTP, PIN, CVV or password, even with someone claiming to be from your bank.',
  ];

  if (ids.has('payment') || ids.has('payment_method')) {
    steps.push('Do not pay any fee, deposit or "unlock" charge. Genuine employers and prize programmes do not require upfront payment.');
  }
  if (ids.has('otp') || ids.has('credentials')) {
    steps.push('If you have already shared credentials or an OTP, change your passwords now and contact your bank immediately.');
  }
  if (ids.has('remote')) {
    steps.push('Do not install the app or open the file. If it is already installed, disconnect from the internet and run a trusted security scan.');
  }
  if (hasLinkFlag) {
    steps.push('Do not open the link. If you already did, do not enter any details on that page.');
  }
  if (score >= 25) {
    steps.push("Report the message to your national cybercrime helpline. In India, call 1930 or file a complaint at cybercrime.gov.in.");
  }
  return steps;
}

/**
 * Analyzes a message and returns an explainable report.
 * Output shape:
 * { status: 'empty' | 'too_short' | 'ok', score, rawScore, level, flags, steps, hasIndicators }
 */
export function analyzeMessage(raw = '') {
  const text = raw.trim();
  if (!text) return { status: 'empty' };
  if (text.length < MIN_ANALYSIS_LENGTH) return { status: 'too_short' };

  const flags = RULES.flatMap((rule) => {
    const evidence = rule.detect(text);
    if (!evidence) return [];
    return [
      {
        id: rule.id,
        category: rule.category,
        title: rule.title,
        weight: rule.weight,
        evidence: clip(evidence),
        explanation: rule.explanation,
      },
    ];
  });

  const rawScore = flags.reduce((sum, f) => sum + f.weight, 0);
  const score = Math.min(100, rawScore);
  const level = levelFor(score);

  return {
    status: 'ok',
    score,
    rawScore,
    level,
    flags,
    steps: buildSteps(flags, score),
    hasIndicators: flags.length > 0,
  };
}
