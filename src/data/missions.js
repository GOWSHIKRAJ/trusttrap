// Missions complete through real actions. Each metric must be resolvable by metricValue() in utils/progress.js.
export const MISSIONS = [
  { id: 'first-scan', title: 'First investigation', detail: 'Analyze any message in the Scam Scanner.', metric: 'scans', target: 1, xp: 20 },
  { id: 'five-scans', title: 'Case file builder', detail: 'Investigate 5 different messages.', metric: 'scans', target: 5, xp: 50 },
  { id: 'link-hunter', title: 'Link hunter', detail: 'Catch a message containing a suspicious link.', metric: 'linkScans', target: 1, xp: 30 },
  { id: 'pressure-read', title: 'Read the pressure', detail: 'Find urgency, threats or secrecy in a message.', metric: 'pressureScans', target: 1, xp: 30 },
  { id: 'critical-catch', title: 'Critical catch', detail: 'Identify a message rated CRITICAL RISK.', metric: 'criticalScans', target: 1, xp: 40 },
  { id: 'credential-shield', title: 'Credential shield', detail: 'Flag 3 messages that ask for OTPs or passwords.', metric: 'credentialScans', target: 3, xp: 60 },
  { id: 'escape-plan', title: 'Break out', detail: 'Escape a scam simulation in Escape the Scam.', metric: 'escapes', target: 1, xp: 40 },
  { id: 'scholar', title: 'Scholar of scams', detail: 'Complete 3 lessons in the Learning Hub.', metric: 'lessons', target: 3, xp: 50 },
  { id: 'evidence-expert', title: 'Evidence expert', detail: 'Examine all six categories in the Evidence Room.', metric: 'evidenceCategories', target: 6, xp: 40 },
];
