// Badges unlock automatically when their metric reaches the target. They do not award XP.
export const ACHIEVEMENTS = [
  { id: 'first-light', title: 'First Light', detail: 'Complete your first investigation.', metric: 'scans', target: 1 },
  { id: 'trap-spotter', title: 'Trap Spotter', detail: 'Rate a message CRITICAL RISK.', metric: 'criticalScans', target: 1 },
  { id: 'link-skeptic', title: 'Link Skeptic', detail: 'Flag suspicious links in 3 messages.', metric: 'linkScans', target: 3 },
  { id: 'pressure-proof', title: 'Pressure Proof', detail: 'Spot pressure tactics in 3 messages.', metric: 'pressureScans', target: 3 },
  { id: 'otp-guardian', title: 'OTP Guardian', detail: 'Flag 3 requests for codes or passwords.', metric: 'credentialScans', target: 3 },
  { id: 'quick-study', title: 'Quick Study', detail: 'Answer 5 challenges correctly.', metric: 'correctAnswers', target: 5 },
  { id: 'escape-artist', title: 'Escape Artist', detail: 'Escape a scam simulation.', metric: 'escapes', target: 1 },
  { id: 'lesson-learner', title: 'Lesson Learner', detail: 'Complete all seven lessons.', metric: 'lessons', target: 7 },
];
