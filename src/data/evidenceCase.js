// A fictional message examined category by category. Its patterns are real; the sender is invented.
export const CASE = {
  title: 'Case file: PAN-link alert',
  sender: 'IT-DEPT-GOV',
  channel: 'SMS',
  received: 'Today, 7:52 AM',
  message:
    "Dear taxpayer, your PAN is not linked to your bank account. Your account will be suspended within 2 hours. Verify now at http://pan-kyc-verify.xyz/login and pay the ₹10 verification fee via UPI to activate. Send your date of birth and PAN number to confirm.",
};

export const CATEGORIES = [
  {
    id: 'sender',
    label: 'Sender identity',
    question: 'Who claims to be sending this?',
    summary: 'A sender that cannot be verified',
    items: [
      {
        id: 'sender-1',
        label: 'Sender name is IT-DEPT-GOV.',
        finding:
          'A sender name that sounds official is easy to fake. Check any government notice only through the official portal or office, never through the number or link in the message.',
      },
      {
        id: 'sender-2',
        label: 'No officer name, reference number or office address is given.',
        finding:
          'Genuine notices carry details you can check independently. A message that gives you nothing to check is asking for trust it has not earned.',
      },
    ],
  },
  {
    id: 'content',
    label: 'Message content',
    question: 'What is the message trying to make you believe?',
    summary: 'A problem plus a threat, wrapped in an official-sounding step',
    items: [
      {
        id: 'content-1',
        label: 'It says your PAN is not linked and your account will be suspended.',
        finding:
          'Claiming a problem and threatening a consequence in one message is a pressure pattern. It is designed to stop you thinking clearly.',
      },
      {
        id: 'content-2',
        label: 'A "verification step" is described without naming any official portal.',
        finding:
          'The word "verification" borrows authority. The useful question is which official channel is named, and this message names none.',
      },
    ],
  },
  {
    id: 'url',
    label: 'URL structure',
    question: 'Where does the link actually lead?',
    summary: 'A lookalike link on a risky domain',
    items: [
      {
        id: 'url-1',
        label: 'The link is pan-kyc-verify.xyz/login.',
        finding:
          'Lure words such as verify, kyc and login, combined with a risky extension, are a common pattern for fake sites. The part just before the extension is the real owner of the site.',
      },
      {
        id: 'url-2',
        label: 'The link uses plain http, not https.',
        finding:
          'Plain http does not protect what you type into the page. Secure pages use https, but https alone does not prove that a site is genuine.',
      },
    ],
  },
  {
    id: 'payment',
    label: 'Payment demand',
    question: 'What does the message want you to pay, and why?',
    summary: 'A fee to activate the account',
    items: [
      {
        id: 'payment-1',
        label: 'A ₹10 verification fee payable via UPI.',
        finding:
          'Paying to verify something is a payment demand. Small amounts are used to test whether people will pay, and they lower the sense of risk.',
      },
      {
        id: 'payment-2',
        label: 'The fee is needed to activate the account.',
        finding:
          'Legitimate services do not charge you through a text message to activate or verify your own account.',
      },
    ],
  },
  {
    id: 'urgency',
    label: 'Urgency tactics',
    question: 'How much time does the message give you?',
    summary: 'A two-hour deadline and certain suspension',
    items: [
      {
        id: 'urgency-1',
        label: 'Your account will be suspended within 2 hours.',
        finding:
          'A short deadline stops careful thinking. Pause, and verify through a route you already trust instead of racing the clock.',
      },
      {
        id: 'urgency-2',
        label: 'The suspension is presented as certain and imminent.',
        finding:
          'Certainty about a threat is a pressure lever. Real processes give notice and room to respond.',
      },
    ],
  },
  {
    id: 'personal',
    label: 'Requested personal information',
    question: 'What personal details does the message ask for?',
    summary: 'Identity details requested by reply',
    items: [
      {
        id: 'personal-1',
        label: 'Your date of birth and PAN number are requested.',
        finding:
          'Identity details can be combined with other leaked data to impersonate you or open accounts in your name.',
      },
      {
        id: 'personal-2',
        label: 'You are asked to send the details back by replying.',
        finding:
          'Replying confirms that your number is active and marks you as a target for further messages.',
      },
    ],
  },
];
