// Interactive lessons: three short cards, a practical tip on each card, and a two-question knowledge check.

export const LESSONS = [
  {
    id: 'phishing',
    title: 'How phishing works',
    summary: 'Fake messages that copy a trusted sender to capture your details.',
    cards: [
      { heading: 'The hook', body: 'Phishing messages imitate a trusted sender and create a reason to act now: a delivery, a refund or a locked account.', tip: 'Ask yourself whether you were expecting this message.' },
      { heading: 'The trap', body: 'The link leads to a copy of a real page, or to a page that asks for your details. The goal is to capture what you type.', tip: 'Read the address bar before you type anything.' },
      { heading: 'The escape', body: 'Go to the service yourself, through a saved bookmark or its official app, and check there. Then report the message.', tip: 'Official apps show the same alerts without needing a link.' },
    ],
    checks: [
      {
        question: 'A message says your account is locked and asks you to log in through a link. What is the safest first step?',
        options: ['Log in through the link quickly', 'Open the official app or type the website address yourself', 'Reply and ask whether it is real', 'Forward it to a friend'],
        answer: 1,
        explanation: 'Going to the service yourself avoids the copy of the page that the link leads to.',
      },
      {
        question: 'Which detail is the strongest sign of a phishing link?',
        options: ['The message is written in English', 'The domain is a lookalike with extra words added', 'The message is short', 'It arrived late at night'],
        answer: 1,
        explanation: 'Lookalike domains are built to be read as the real brand at a glance.',
      },
    ],
  },
  {
    id: 'fake-jobs',
    title: 'How fake job scams operate',
    summary: 'High pay, no interview, and a fee that never leads to a job.',
    cards: [
      { heading: 'The bait', body: 'Fake job offers promise high pay, little work and no interview. They arrive unsolicited or through chat apps.', tip: 'Easy money is the first warning sign.' },
      { heading: 'The fee', body: 'Once you engage, you are asked to pay for training, a kit, a background check or a deposit. The job never starts.', tip: 'Employers pay you. You never pay them to start.' },
      { heading: 'The data grab', body: 'Some scams collect Aadhaar, PAN or bank details during onboarding, then use them for fraud.', tip: 'Share identity documents only after a verified hiring process.' },
    ],
    checks: [
      {
        question: 'A recruiter asks for a refundable ₹1,000 deposit before your first day. What do you do?',
        options: ['Pay, since it is refundable', 'Decline and verify the company independently', 'Pay half now', 'Ask for a higher salary first'],
        answer: 1,
        explanation: '"Refundable" is a common word in these scams. Verify the company through its official website.',
      },
      {
        question: 'Which feature is a reliable sign of a legitimate job offer?',
        options: ['Payment to a personal account', 'A formal process with a named role, a verifiable company and no upfront fee', 'Urgent confirmation by text within an hour', 'A high-paying job with no interview'],
        answer: 1,
        explanation: 'Real hiring is verifiable and never requires you to pay to start.',
      },
    ],
  },
  {
    id: 'upi-safety',
    title: 'UPI payment safety',
    summary: 'Why money you approve can leave your account instantly.',
    cards: [
      { heading: 'Money out', body: 'UPI payments leave your account as soon as you approve them. Once approved, they are usually hard to reverse.', tip: 'Read the payee name and the amount on every approval screen.' },
      { heading: 'Collect requests', body: 'A collect request asks you to approve money going out, even when it is presented as a refund or a reward.', tip: 'Receiving money never requires you to enter your UPI PIN.' },
      { heading: 'The PIN rule', body: 'Your UPI PIN authorises payments from your account. Nobody needs it to send you money, verify you or fix a problem.', tip: 'If someone asks for your PIN, end the conversation.' },
    ],
    checks: [
      {
        question: 'Someone says you must enter your UPI PIN to receive a refund. What is true?',
        options: ['It is standard for refunds', 'No one needs your PIN to send you money', 'Only for amounts over ₹1,000', 'Only if the caller is from a bank'],
        answer: 1,
        explanation: 'Your PIN approves payments going out. Receiving money never needs it.',
      },
      {
        question: 'What is a UPI collect request?',
        options: ['A request for you to receive money with no approval', 'A request that asks you to approve money going out', 'A monthly bank statement', 'A kind of loan offer'],
        answer: 1,
        explanation: 'A collect request is a prompt to approve a payment. Declining it is always safe.',
      },
    ],
  },
  {
    id: 'otp-protection',
    title: 'OTP protection',
    summary: 'Why a one-time code is proof of your identity, and how it gets stolen.',
    cards: [
      { heading: 'What an OTP proves', body: 'A one-time password proves that the person entering it has access to your phone or account at this moment.', tip: 'Treat a code like cash: it is proof, and it should not be handed over.' },
      { heading: 'The disguise', body: 'Scammers call while pretending to be support staff and ask you to read out a code, claiming it cancels a charge or confirms a refund.', tip: 'No genuine support process needs you to read an OTP aloud.' },
      { heading: 'The safe habit', body: 'Never share an OTP, even with someone you trust. If you shared one by mistake, change your passwords and contact your bank immediately.', tip: 'Banks do not ask for your OTP.' },
    ],
    checks: [
      {
        question: 'A caller says they need the OTP to cancel a refund. What do you do?',
        options: ['Read it out', 'Hang up and never share it', 'Read only part of it', 'Ask them to text it to you'],
        answer: 1,
        explanation: 'Partial or full, an OTP is the key. End the call and use the official app instead.',
      },
      {
        question: 'You shared an OTP by mistake. What is the best next step?',
        options: ['Wait and see what happens', 'Change your passwords and contact your bank immediately', 'Delete the message', 'Do nothing if you have not lost money yet'],
        answer: 1,
        explanation: 'Acting quickly limits what the caller can do with the code.',
      },
    ],
  },
  {
    id: 'fake-websites',
    title: 'Spotting fake websites',
    summary: 'Look-alike domains, misleading padlocks, and how to verify a site.',
    cards: [
      { heading: 'Look-alike domains', body: 'Fake sites copy the look of real ones and use similar names with extra words such as secure, login or verify.', tip: 'The real owner is the part just before the extension, such as .com or .in.' },
      { heading: 'Padlocks mislead', body: 'A padlock or https only means the connection is encrypted. It does not mean the site is genuine.', tip: 'Check the domain, not just the padlock.' },
      { heading: 'Verify before you trust', body: 'Type the address yourself or use a saved bookmark. Search for the brand and compare the result with the official address.', tip: 'When in doubt, leave and come back through the official app.' },
    ],
    checks: [
      {
        question: 'Which address is most likely a fake?',
        options: ['https://brand.com', 'https://brand-secure-login.xyz', 'https://www.brand.com/help', 'https://app.brand.com'],
        answer: 1,
        explanation: 'Extra words such as secure and login on an unusual extension are a classic lookalike pattern.',
      },
      {
        question: 'A site shows a padlock icon. What does that prove?',
        options: ['The site is genuine', 'The connection is encrypted, but the site may still be fake', 'The site is government approved', 'Any payment on it is safe'],
        answer: 1,
        explanation: 'Encryption protects data in transit. It says nothing about who runs the site.',
      },
    ],
  },
  {
    id: 'social-engineering',
    title: 'Social engineering',
    summary: 'How scams exploit trust, authority and urgency instead of software flaws.',
    cards: [
      { heading: 'Trust is the target', body: 'Social engineering exploits helpfulness, fear and authority rather than technical weaknesses.', tip: 'Scammers want you to feel that you must act now.' },
      { heading: 'Pretexts', body: 'A pretext is a believable story: a bank officer, a delivery agent, a friend in trouble, or a boss who needs a payment today.', tip: 'Ask whether the story would survive a call to a number you already know.' },
      { heading: 'Slow down', body: 'A short pause, a call back on a trusted number, or a check with another person breaks most social engineering.', tip: 'Scams fail when they cannot rush you.' },
    ],
    checks: [
      {
        question: 'A message from your "boss" asks you to buy gift cards urgently. What should you do?',
        options: ['Buy them right away', 'Verify with the person on a channel you already know', 'Ask for a discount', 'Send the codes to be safe'],
        answer: 1,
        explanation: 'Gift-card requests from a boss are a well-known impersonation pattern. Verify first.',
      },
      {
        question: 'What is the best defence against social engineering?',
        options: ['Trust anyone with a professional voice', 'Slowing down and verifying through a channel you already know', 'Responding faster', 'Ignoring all calls'],
        answer: 1,
        explanation: 'Verification through a known channel removes the pressure the scammer depends on.',
      },
    ],
  },
  {
    id: 'password-safety',
    title: 'Password safety',
    summary: 'Long passphrases, unique passwords, and a second factor.',
    cards: [
      { heading: 'Length beats cleverness', body: 'A long passphrase of unrelated words is stronger and easier to remember than a short, complicated password.', tip: 'Four or more random words make a strong start.' },
      { heading: 'Unique per account', body: 'Reusing a password means that one leak can open many accounts.', tip: 'A password manager keeps each password unique without memorising them.' },
      { heading: 'Add a second factor', body: 'Use an authenticator app or a security key where available. For your most sensitive accounts, prefer these over SMS codes.', tip: 'A second factor stops most attacks that use a stolen password.' },
    ],
    checks: [
      {
        question: 'Which password is strongest?',
        options: ['Password@123', 'Tiger!2024', 'correct-horse-battery-staple-river', 'Your name plus your birth year'],
        answer: 2,
        explanation: 'Length and randomness matter most. A long passphrase of unrelated words resists guessing.',
      },
      {
        question: 'Why should you avoid reusing passwords?',
        options: ['It makes logging in slower', 'One leaked password can unlock your other accounts', 'Websites require new passwords every year', 'It is always illegal'],
        answer: 1,
        explanation: 'Attackers try leaked passwords across many sites. Unique passwords limit the damage.',
      },
    ],
  },
];
