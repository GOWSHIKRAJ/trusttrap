// All messages below are fictional. Domains use the reserved ".example" TLD and never point to real sites.

export const MAIN_SCENARIO = {
  sender: 'Unknown sender',
  time: '9:41 AM',
  text: 'URGENT: Your bank account will be suspended today! Verify your account immediately using the link below to avoid service interruption.',
  url: 'https://zenith-trust-secure-check.example/verify',
};

export const SAMPLE_MESSAGES = [
  {
    id: 'kyc',
    label: 'Fake bank KYC alert',
    text: 'URGENT! Your bank account will be blocked. Verify immediately using this link: https://zenith-kyc-update.example/login. Enter your account number and OTP to complete KYC today.',
  },
  {
    id: 'job',
    label: 'Fake job offer',
    text: 'Congratulations! You have been selected for a work from home job offer. Earn Rs 3000 per day by liking videos. Pay a small registration fee of Rs 499 to activate your profile.',
  },
  {
    id: 'lottery',
    label: 'Lottery prize message',
    text: 'You have won a lucky draw prize of Rs 25,00,000! To claim your prize, send a processing fee via UPI and share your bank details. Reply within 24 hours.',
  },
  {
    id: 'parcel',
    label: 'Fake parcel delivery',
    text: 'Your parcel could not be delivered due to incomplete address. Update your details here within 2 hours or it will be returned: https://qk-track-parcel.xyz/update',
  },
  {
    id: 'upi',
    label: 'UPI payment scam',
    text: 'Your UPI payment of Rs 8,500 is pending. Please approve the collect request or enter your UPI PIN to receive the money. Customer care will not call you.',
  },
  {
    id: 'social',
    label: 'Social media account warning',
    text: 'Your account will be deleted due to a copyright strike. Verify your identity now to keep your profile: https://account-review-help.example/appeal',
  },
];
