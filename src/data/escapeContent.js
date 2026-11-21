// Fictional simulation content. Nothing here asks the player for real passwords, OTPs or financial details.

export const ESCAPE_TIME = 180;
export const MISTAKE_PENALTY = 15;
export const CLUE_COST = 20;
export const ESCAPE_BASE_XP = 60;
export const STAGE_XP = 10;

export const STORY =
  "You have received a suspicious job offer. A scammer is trying to obtain your personal information and money. Investigate the evidence and escape before time runs out.";

export const STAGES = [
  {
    id: "offer",
    number: 1,
    title: "The job offer",
    type: "flags",
    brief:
      "Flag every line of this offer that looks suspicious. Leave ordinary details unflagged. Flagging a safe line costs time just like a miss.",
    success:
      "Lock 1 open. The red flags are exposed. Scams depend on candidates never checking these details.",
    lesson:
      "Verify any employer independently before paying anything. Unsolicited offers, fees and deadlines are the core signs.",
    offer: {
      from: "Brightpath HR (WhatsApp)",
      subject: "Congratulations, you are selected",
    },
    lines: [
      { id: "l1", red: true, text: "Your profile was shortlisted from a database of 40,000 candidates. You never applied.", reason: "Unsolicited job offers for roles you never applied to are a common lure." },
      { id: "l2", red: true, text: "Pay: ₹2,000 per day for two hours of typing from home.", reason: "Pay far above the market for minimal effort is bait." },
      { id: "l3", red: false, text: "Company: Brightpath Solutions Pvt Ltd, with a registered office listed in the signature.", reason: "A company name is not suspicious by itself. Check it on the official registry and website." },
      { id: "l4", red: true, text: "Contact: hr.brightpath.careers@gmail.com", reason: "Recruiters usually write from the company's own domain, not a free email account." },
      { id: "l5", red: false, text: "Role: Data Entry Associate, reporting to a manager named on the company's careers page.", reason: "A specific, checkable role is normal. Confirm it on the official site." },
      { id: "l6", red: true, text: "This offer is valid for 24 hours. Confirm before the window closes.", reason: "Deadlines push you to act before you verify." },
      { id: "l7", red: true, text: "Next step: pay a refundable ₹800 security deposit to receive your laptop.", reason: "Employers do not ask new hires for deposits, however the refund is described." },
    ],
    clues: [
      "Look at how the offer reached you, and at what it asks you to pay.",
      "Check the sender's address. Does a company recruiter write from a free email account?",
      "Money should never move from you to the employer. Find the lines where it does.",
    ],
  },
  {
    id: "payment",
    number: 2,
    title: "The payment request",
    type: "choice",
    brief: "A payment screen has opened on your phone. Choose the element that makes this payment dangerous.",
    success:
      "Lock 2 open. The payment was a demand for money, dressed up as a refundable deposit.",
    lesson:
      "Always ask what a payment is for. A legitimate employer never takes money from a new hire for equipment.",
    screen: {
      payee: "BRIGHTPATH HR ONBOARDING",
      upi: "brightpath.hr@okpay-secure",
      amount: "₹800.00",
      note: "Laptop security deposit (refundable)",
      deadline: "Pay within 10 minutes to keep your slot",
    },
    options: [
      { id: "a", text: "The amount: ₹800 is a small sum, so it is hard to tell whether it is dangerous.", correct: false, feedback: "A small payment is still a payment to a stranger. Small amounts are often used to test whether you will pay." },
      { id: "b", text: "The UPI ID: a generic handle with a 'secure' suffix that does not match the company's name.", correct: false, feedback: "This is worth verifying, but it is not the most dangerous element. The purpose of the payment is." },
      { id: "c", text: "The purpose: 'Laptop security deposit (refundable)'. Employers do not take deposits from new hires, and 'refundable' makes the request sound safe.", correct: true, feedback: "Correct. The stated purpose is the giveaway. Real employers do not ask new hires to pay for their own equipment." },
      { id: "d", text: "The deadline: 10 minutes. Urgency is a warning sign, but it only adds pressure to the real problem.", correct: false, feedback: "Urgency is a pressure tactic layered on top of the real problem: the purpose of the payment." },
    ],
    clues: [
      "Ask what the money is for. Does a real employer take money from you?",
      "Words like 'refundable' are used to make a payment sound safe. Who would actually hold the refund?",
    ],
  },
  {
    id: "account",
    number: 3,
    title: "Protect the account",
    type: "choice",
    brief: "You have already paid. Choose the safest next action to protect your account and your money.",
    success:
      "Lock 3 open. You stopped the payment at its source and reported it. The scammer is locked out.",
    lesson:
      "Your UPI PIN authorises payments. Never enter it to receive money, and report suspicious payments to your bank at once.",
    context:
      "You paid ₹800 to the handle. The payee now says the refund can only be released after you confirm your UPI PIN in a 'verification' step.",
    options: [
      { id: "a", text: "Enter your UPI PIN to verify the refund.", correct: false, feedback: "Your UPI PIN authorises payments out of your account. Entering it for anyone else lets them take your money." },
      { id: "b", text: "Call your bank on the number printed on your card, report the payment, and ask them to block the UPI handle.", correct: true, feedback: "Correct. This is the fastest route to freezing or reversing the payment, and it goes through a number you already trust." },
      { id: "c", text: "Send a smaller payment, such as ₹10, to prove you are genuine.", correct: false, feedback: "Every payment is a fresh loss, and it tells the scammer that your account is active." },
      { id: "d", text: "Do nothing. Delete the chat and hope the payment fails.", correct: false, feedback: "Doing nothing leaves the account and the payment open to misuse. Reporting protects you and others." },
    ],
    clues: [
      "Who would ever need your UPI PIN to send you money?",
      "Recovery starts with an organisation you already trust, reached through a number you already have.",
    ],
  },
];
