import { RULES, LEVEL_TEXT } from '../data/detectionRules.js';

/** Normalise text: strip zero-width characters, unify line endings, collapse spaces. */
export function normalize(input = '') {
  return input
    .replace(/\r\n?/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function buildSegments(text, ranges) {
  const sorted = [...ranges].sort((a, b) => a.start - b.start || b.end - a.end);
  const segments = [];
  let pos = 0;
  for (const r of sorted) {
    if (r.start < pos) continue; // skip overlapping ranges; first match wins
    if (r.start > pos) segments.push({ text: text.slice(pos, r.start) });
    segments.push({ text: text.slice(r.start, r.end), ruleId: r.id });
    pos = r.end;
  }
  if (pos < text.length) segments.push({ text: text.slice(pos) });
  return segments;
}

export const LEVEL_LABELS = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
  critical: 'Critical risk',
};

/**
 * Analyse a message with transparent, rule-based scoring.
 * Returns null for empty input. Nothing is stored or transmitted.
 */
export function analyzeMessage(raw) {
  const text = normalize(raw);
  if (!text) return null;

  const findings = [];
  const ranges = [];

  for (const rule of RULES) {
    const re = new RegExp(rule.pattern.source, 'gi');
    const hits = [...text.matchAll(re)];
    if (hits.length === 0) continue;

    findings.push({
      id: rule.id,
      name: rule.name,
      category: rule.category,
      weight: rule.weight,
      explanation: rule.explanation,
      action: rule.action,
      phrases: [...new Set(hits.map((h) => h[0]))],
    });
    hits.forEach((h) => ranges.push({ start: h.index, end: h.index + h[0].length, id: rule.id }));
  }

  const rawScore = findings.reduce((sum, f) => sum + f.weight, 0);
  const score = Math.min(100, rawScore);
  const level = score >= 75 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';

  const hasUrl = findings.some((f) => f.category === 'url' && f.id !== 'url');
  const hasMalwareSignal = findings.some((f) => f.category === 'malware');

  const hasCredentials = findings.some((f) => f.category === 'credentials');
  const hasPressureOnly = findings.some((f) => f.category === 'pressure' && f.id !== 'urgency');

  let verdict;
  if (score < 25) verdict = 'No strong warning signs found';
  else if (hasCredentials || (hasUrl && hasPressureOnly)) verdict = 'Potential phishing attempt';
  else if (hasUrl) verdict = 'Suspicious link';
  else if (hasMalwareSignal) verdict = 'Suspicious download request';
  else verdict = 'Suspicious message';

  const primary = [...findings].sort((a, b) => b.weight - a.weight)[0];

  return {
    text,
    score,
    rawScore,
    level,
    label: LEVEL_LABELS[level],
    levelText: LEVEL_TEXT[level],
    verdict,
    findings: [...findings].sort((a, b) => b.weight - a.weight),
    segments: buildSegments(text, ranges),
    recommendedAction: primary
      ? primary.action
      : 'No action is needed for this message, but never share codes or passwords with anyone.',
  };
}

/** Plain-text report that the user can copy. */
export function buildSummary(result) {
  if (!result) return '';
  const lines = [
    'TrustTrap Message Analysis (educational, local only)',
    `Verdict: ${result.verdict}`,
    `Risk score: ${result.score}/100 (${result.label})`,
    'Warning signs:',
    ...(result.findings.length
      ? result.findings.map((f) => `- ${f.name} (+${f.weight}): ${f.explanation}`)
      : ['- None detected by the rules']),
    `Recommended action: ${result.recommendedAction}`,
    'Limitation: this scanner cannot confirm whether a link or file contains malware.',
  ];
  return lines.join('\n');
}
