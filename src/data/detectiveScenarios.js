// All scenarios are fictional training material. None of them asks for real credentials,
// and every message is written to show a pattern, not to imitate a specific real organisation.

export const SCENARIOS = [
  {
    id: "fake-internship",
    title: "The internship offer",
    channel: "WhatsApp",
    sender: "Unknown number · 'HR Recruitment'",
    received: "Today, 9:12 AM",
    message:
      "Hi! Congratulations, you are shortlisted for the Remote Data Entry Internship at Brightpath Solutions. Earn ₹3,000 a day with no interview needed. To confirm your seat, pay the ₹1,200 onboarding kit fee within 2 hours. Reply OK to continue.",
    hint: "Ask who is paying whom. A real job pays you.",
    choices: [
      { id: "a", text: "Pay the ₹1,200 onboarding fee to secure your seat.", correct: false, weak: false, feedback: "Paying to secure a job is the core of this scam. Genuine employers do not charge onboarding fees." },
      { id: "b", text: "Reply OK to learn the next step, but pay nothing yet.", correct: false, weak: true, feedback: "A reply confirms your number is active and invites more pressure. Do not engage with the offer." },
      { id: "c", text: "Check Brightpath Solutions and the role on the company's official website before doing anything else.", correct: true, weak: false, feedback: "Verifying the company and the role through official channels is the right move. Scammers depend on people skipping this step." },
      { id: "d", text: "Send your PAN and Aadhaar so they can prepare the offer letter.", correct: false, weak: false, feedback: "Identity documents are valuable to fraudsters. Share them only with a verified employer after a genuine hiring process." },
    ],
    redFlags: [
      "A fee is required to start the job",
      "A two-hour deadline to pay",
      "High pay promised with no interview",
      "Identity documents requested before any real hiring",
    ],
    explanation:
      "Legitimate employers pay you, not the other way around. Upfront fees, urgent deadlines and easy money are the classic signatures of fake job scams.",
  },
  {
    id: "bank-kyc",
    title: "The KYC freeze warning",
    channel: "SMS",
    sender: "VM-KYCUPD",
    received: "Today, 11:40 AM",
    message:
      "URGENT: Your account will be frozen today due to incomplete KYC. Update now at https://kyc-update-hdfc-secure.online/verify to avoid suspension. Ref 88421.",
    hint: "Look closely at the link, then at what the message asks you to do.",
    choices: [
      { id: "a", text: "Tap the link and complete the KYC form to stop the freeze.", correct: false, weak: false, feedback: "The domain is a lookalike built from bank and security words. Links like this are a classic phishing pattern." },
      { id: "b", text: "Call the number mentioned in the SMS to verify the request.", correct: false, weak: false, feedback: "Scammers answer those numbers. Contact your bank only through a number printed on your card or listed on its official website." },
      { id: "c", text: "Open your bank's official app or visit a branch to check your KYC status yourself.", correct: true, weak: false, feedback: "Checking through the official app or branch avoids the link entirely and confirms the real status." },
      { id: "d", text: "Forward the SMS to a friend who works in banking to check it.", correct: false, weak: true, feedback: "Passing it on verifies nothing and may spread the scam. Verify through official channels instead." },
    ],
    redFlags: [
      "A deadline of the same day",
      "A link to a lookalike domain",
      "A threat of freezing or suspension",
      "Asks you to act through a link instead of the app",
    ],
    explanation:
      "Banks do not ask you to update KYC through a link in an SMS. Check your status only through the official app, website or branch.",
  },
  {
    id: "courier-fee",
    title: "The parcel on hold",
    channel: "SMS",
    sender: "DELIVERY-ALERT",
    received: "Yesterday, 6:05 PM",
    message:
      "FedEx: Your parcel #FX48210 is on hold. A customs duty of ₹35 is payable within 6 hours. Pay here to release delivery: http://fedex-release-parcel.top/pay",
    hint: "Think about where a courier actually collects payment.",
    choices: [
      { id: "a", text: "Pay the ₹35 duty through the link so the parcel is released.", correct: false, weak: false, feedback: "Even a small amount is a payment to a stranger. The domain also uses a risky extension and a brand name." },
      { id: "b", text: "Check the tracking number on the courier's official website or app.", correct: true, weak: false, feedback: "Official tracking shows the real status. If a duty is genuinely owed, the courier shows it there." },
      { id: "c", text: "Reply with your address to confirm the delivery.", correct: false, weak: true, feedback: "A reply confirms your number and invites further contact from the sender." },
      { id: "d", text: "Delete the message and ignore it, even if you are expecting a parcel.", correct: false, weak: false, feedback: "Ignoring it can make you miss a real delivery. Verify the status instead of guessing." },
    ],
    redFlags: [
      "A small fee to release a parcel",
      "A six-hour deadline",
      "A link with a risky extension",
      "A courier brand in an unexpected SMS",
    ],
    explanation:
      "Couriers do not collect duties through random links. Track your parcel on the courier's own site or app, and pay only there.",
  },
  {
    id: "lottery-email",
    title: "The lucky draw win",
    channel: "Email",
    sender: "claims@national-lucky-draw-award.com",
    received: "Today, 8:30 AM",
    message:
      "CONGRATULATIONS! Your mobile number was selected in the National Mega Lucky Draw and you have won ₹50,00,000. To claim, email your full name, bank account number and a claim fee of ₹5,000 to our claims officer within 72 hours.",
    hint: "Did you ever enter this draw?",
    choices: [
      { id: "a", text: "Email your bank details and pay the claim fee to receive the prize.", correct: false, weak: false, feedback: "You never entered this draw. Bank details and fees are how this scam collects money." },
      { id: "b", text: "Call the claims officer's number to confirm the win.", correct: false, weak: false, feedback: "The call connects you to the scammer, who will apply pressure to get the fee." },
      { id: "c", text: "Treat the unsolicited prize as a scam, do not reply, and report the email as spam.", correct: true, weak: false, feedback: "A prize you never entered, followed by a request for fees and bank details, is a scam. Reporting it helps protect others." },
      { id: "d", text: "Forward the email to friends so they can enter the draw as well.", correct: false, weak: true, feedback: "Spreading the message puts other people at risk." },
    ],
    redFlags: [
      "You never entered the draw",
      "Asks for your bank account number",
      "An upfront claim fee",
      "A 72-hour deadline",
    ],
    explanation:
      "Genuine prize programmes do not pick winners from phone numbers and never ask for fees or bank details to release a prize.",
  },
  {
    id: "otp-refund",
    title: "The refund that needs a code",
    channel: "WhatsApp",
    sender: "Unknown number · 'ShopEasy Support'",
    received: "Today, 2:18 PM",
    message:
      "Hi, this is Riya from ShopEasy Support. We accidentally charged you ₹4,200 twice. To reverse it, I am sending a verification OTP to your phone now. Please read the 6-digit code to me so I can cancel the duplicate payment.",
    hint: "",
    choices: [
      { id: "a", text: "Read the 6-digit code out so the duplicate charge can be cancelled.", correct: false, weak: false, feedback: "An OTP proves you are the account holder. Read it aloud and the caller can take over the account or approve a payment." },
      { id: "b", text: "Say you will check your orders in the official app, and never share the code with anyone.", correct: true, weak: false, feedback: "Refunds appear in the official app. A real agent never needs your OTP, so ending the conversation is the right call." },
      { id: "c", text: "Read only the first three digits, since that is not the full code.", correct: false, weak: true, feedback: "Partial codes can still be useful to an attacker who already has other details. Do not share any part of it." },
      { id: "d", text: "Ask for a callback from their number, then read the OTP once you are sure.", correct: false, weak: false, feedback: "Callers can be spoofed, and the OTP is the risk whoever asks for it. Never share it." },
    ],
    redFlags: [
      "An unsolicited refund message",
      "Asks you to read out a verification code",
      "Urgency about a duplicate charge",
      "Claims an OTP is needed to cancel a payment",
    ],
    explanation:
      "An OTP is the key to your account. No legitimate refund, support or bank process requires you to read one out.",
  },
  {
    id: "remote-support",
    title: "The security alert",
    channel: "SMS",
    sender: "Amazon Customer Care (unverified)",
    received: "Today, 2:14 AM",
    message:
      "Amazon Care: We detected a login to your account from Mumbai at 2:14 AM. To secure it, install the QuickSupport app from this link so our agent can lock your account remotely: http://bit.ly/amzn-secure-help",
    hint: "",
    choices: [
      { id: "a", text: "Install QuickSupport and let the agent secure your account remotely.", correct: false, weak: false, feedback: "Remote-access apps give a stranger control of your phone, including your banking apps and messages." },
      { id: "b", text: "Open the official Amazon app yourself, check the account security settings, and ignore the link.", correct: true, weak: false, feedback: "Security alerts and account changes can be checked directly. Remote access is never needed to protect an account." },
      { id: "c", text: "Reply with your password so the agent can check the login history.", correct: false, weak: true, feedback: "Passwords should never be shared, even with support staff." },
      { id: "d", text: "Tap the bit.ly link to read the full alert before deciding.", correct: false, weak: false, feedback: "Shortened links hide the destination. Opening one can start the same trap." },
    ],
    redFlags: [
      "An unsolicited security alert",
      "A request to install a remote-access app",
      "A shortened link",
      "Urgency about a login at an unusual hour",
    ],
    explanation:
      "Support teams never need remote control of your phone or your password. Check account security only inside the official app.",
  },
];
