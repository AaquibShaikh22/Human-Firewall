/* ═══════════════════════════════════════════════════════
   HUMAN FIREWALL — script.js
   Complete game logic: scoring, levels, badges, localStorage,
   question rendering, timer, leaderboard, animations.
═══════════════════════════════════════════════════════ */

"use strict";

/* ──────────────────────────────────────────────────────
   1. CONSTANTS & CONFIGURATION
────────────────────────────────────────────────────── */

const POINTS_PER_CORRECT = 100;

// Level thresholds (minimum score to reach each level)
const LEVELS = [
  { name: "Cyber Rookie",       min: 0    },
  { name: "Scam Spotter",       min: 300  },
  { name: "Phishing Detective", min: 700  },
  { name: "Security Guardian",  min: 1200 },
  { name: "Human Firewall Elite", min: 2000 },
];

// Badge definitions
const BADGES = [
  { id: "first_mission",    emoji: "🎯", name: "First Mission",         desc: "Complete your first challenge" },
  { id: "phishing_hunter",  emoji: "🎣", name: "Phishing Hunter",       desc: "Complete all Phishing challenges" },
  { id: "scam_buster",      emoji: "🚫", name: "Scam Buster",           desc: "Complete all Social Engineering challenges" },
  { id: "privacy_protector",emoji: "🔒", name: "Privacy Protector",     desc: "Complete all Fake Login challenges" },
  { id: "cyber_guardian",   emoji: "🛡️", name: "Cyber Guardian",        desc: "Complete all three categories" },
  { id: "elite",            emoji: "⭐", name: "Human Firewall Elite",   desc: "Reach level 5" },
];

// Daily cybersecurity tips
const TIPS = [
  "Never share a One-Time Password (OTP) with anyone — not even people claiming to be from your bank or tech support.",
  "Always verify suspicious requests by contacting the organization directly through their official website or phone number.",
  "Inspect the full URL before entering any information. A padlock icon alone does not guarantee a site is safe.",
  "Use a unique, strong password for every account and store them with a trusted password manager.",
  "Enable Multi-Factor Authentication (MFA) on all important accounts — it blocks most automated attacks.",
  "Avoid opening unexpected email attachments, even from known senders, unless you can verify the message is genuine.",
  "Report phishing emails to your email provider using the 'Report Spam' or 'Report Phishing' option.",
  "Legitimate companies will never ask for your password via email or phone — that is always a red flag.",
  "Be skeptical of any offer that sounds too good to be true: prize winnings, free gifts, or guaranteed investments.",
  "QR codes can redirect you to malicious websites. Only scan codes from sources you completely trust.",
  "Keep your device operating system and apps updated — patches fix security vulnerabilities attackers exploit.",
  "Log out of accounts when using shared or public computers, and never save passwords on public devices.",
  "Social engineers create urgency and fear to prevent you from thinking clearly. Slow down before acting.",
  "Check for misspellings in email addresses and URLs — scammers use lookalike domains like 'paypa1.com'.",
  "Your IT or bank will never ask you to install remote-access software to fix a problem — hang up or delete.",
];

/* ──────────────────────────────────────────────────────
   2. QUESTION DATA — 10 Phishing, 5 Fake Login, 10 Social
────────────────────────────────────────────────────── */

// Each phishing question: type:"phishing", sender, senderEmail, subject, body, links, options[], correctIndex, explanation, lesson
const PHISHING_QUESTIONS = [
  {
    type: "phishing",
    sender: "Account Security Team",
    senderEmail: "security@examp1e-support.invalid",
    subject: "URGENT: Your account will be deleted in 10 minutes!",
    body: `Dear Valued Customer,

Our system has detected unusual activity on your account. Your account will be permanently suspended in 10 MINUTES if you do not verify your identity immediately.

Click the link below to confirm your account details:`,
    links: ["https://www.examp1e-support.invalid/verify?token=a8f3k"],
    options: ["A. Legitimate email", "B. Phishing email"],
    correctIndex: 1,
    explanation: "This is a phishing email. Key red flags: (1) The sender domain 'examp1e-support.invalid' uses the number '1' instead of the letter 'l' — a classic lookalike domain trick. (2) Extreme urgency ('10 minutes') is designed to make you panic and act without thinking. (3) Legitimate companies never threaten immediate deletion via email.",
    lesson: "Tip: Always check the sender's full email address — not just the display name. Urgency and threats are the #1 social engineering tactic."
  },
  {
    type: "phishing",
    sender: "PayQuick Payments",
    senderEmail: "no-reply@payquick-alert.net.invalid",
    subject: "Your payment of $1,248.00 has been processed",
    body: `Hello,

A payment of $1,248.00 was charged to your account ending in **4321** on 12-Jan.

If you did NOT authorize this transaction, click below to dispute it within 24 hours:`,
    links: ["https://payquick-alert.net.invalid/dispute?ref=TXN8821"],
    options: ["A. Legitimate email", "B. Phishing email"],
    correctIndex: 1,
    explanation: "This is a phishing email. Red flags: (1) You likely do not use a service called 'PayQuick'. (2) The sender domain 'payquick-alert.net.invalid' is not an official payment processor domain. (3) Fear of financial loss pressures you to click without verifying. (4) Legitimate payment processors provide in-app dispute options, not email links.",
    lesson: "Tip: Never click dispute links in emails. Log in to your account directly in your browser and check transactions from there."
  },
  {
    type: "phishing",
    sender: "IT Help Desk",
    senderEmail: "helpdesk@corp-it-support.invalid",
    subject: "Action Required: Reset your password before Monday",
    body: `Hi Team Member,

Our security policy requires all staff to reset their passwords before Monday 09:00 AM.

Your account will be locked if you do not complete this step. Please reset your password using the link provided:`,
    links: ["https://corp-it-support.invalid/password-reset"],
    options: ["A. Legitimate email", "B. Phishing email"],
    correctIndex: 1,
    explanation: "This is a phishing email. Red flags: (1) Generic greeting 'Hi Team Member' — a real IT department would use your name. (2) The domain 'corp-it-support.invalid' is not your company's domain. (3) Artificial deadline creates urgency. (4) Real IT teams send password-reset requests from the company's own domain and often notify you in person or via internal tools.",
    lesson: "Tip: Your real IT department emails from your company's domain (e.g., yourcompany.com). When in doubt, call IT directly using a number from the official directory."
  },
  {
    type: "phishing",
    sender: "Netflix Billing",
    senderEmail: "billing@netf1ix-accounts.invalid",
    subject: "Your Netflix membership has been suspended",
    body: `Dear Netflix Member,

We were unable to validate your payment information for the current billing cycle. As a result, your membership has been suspended.

To continue watching without interruption, please update your payment details within 48 hours:`,
    links: ["https://netf1ix-accounts.invalid/billing/update"],
    options: ["A. Legitimate email", "B. Phishing email"],
    correctIndex: 1,
    explanation: "This is a phishing email. Red flags: (1) Domain 'netf1ix-accounts.invalid' uses '1' (digit one) instead of 'l' in 'Netflix'. (2) Netflix always communicates from '@netflix.com'. (3) Any legitimate billing update would direct you to netflix.com, not a third-party domain. (4) Suspension threats create emotional urgency.",
    lesson: "Tip: Streaming services only send billing emails from their own domain. Always type the URL manually in your browser instead of clicking email links."
  },
  {
    type: "phishing",
    sender: "Government Tax Authority",
    senderEmail: "refund@gov-taxrefund.invalid",
    subject: "You are eligible for a tax refund of $892.00",
    body: `Dear Taxpayer,

After reviewing your recent tax filing, you are entitled to receive a refund of $892.00.

To claim your refund, please submit your bank account details using the secure form within 7 days. Unclaimed refunds are returned to the general fund.`,
    links: ["https://gov-taxrefund.invalid/claim-refund"],
    options: ["A. Legitimate email", "B. Phishing email"],
    correctIndex: 1,
    explanation: "This is a phishing email. Red flags: (1) Real government tax authorities communicate through official .gov domains, never '.invalid' or unofficial domains. (2) Governments deposit refunds using the banking information already on file — they do not email requesting bank details. (3) The urgency and money offer are classic bait tactics.",
    lesson: "Tip: Government tax authorities never ask for banking information via email. Always verify refund notices by logging into the official government portal directly."
  },
  {
    type: "phishing",
    sender: "Amazon Customer Service",
    senderEmail: "service@amazon-order-check.invalid",
    subject: "Your order #AMZ-99271 could not be delivered",
    body: `Hello Amazon Shopper,

We attempted to deliver your package (Order #AMZ-99271) but were unable to complete the delivery due to an address issue.

Please confirm your delivery address within 24 hours to avoid the order being returned:`,
    links: ["https://amazon-order-check.invalid/confirm-address"],
    options: ["A. Legitimate email", "B. Phishing email"],
    correctIndex: 1,
    explanation: "This is a phishing email. Red flags: (1) Amazon always emails from '@amazon.com', never from 'amazon-order-check.invalid'. (2) The order number may match something you ordered, which scammers guess statistically. (3) Amazon handles address issues inside their official app or website, not third-party links.",
    lesson: "Tip: Track all orders through the retailer's official app or website. Never follow delivery-update links from emails — go directly to the source."
  },
  {
    type: "phishing",
    sender: "WhatsApp Security",
    senderEmail: "security@whatsapp-verify.invalid",
    subject: "Verify your WhatsApp account to prevent suspension",
    body: `Dear WhatsApp User,

Your WhatsApp account has been flagged for suspicious login activity from an unrecognized device.

To prevent suspension, you must verify your account immediately by entering your 6-digit verification code below:`,
    links: ["https://whatsapp-verify.invalid/verify"],
    options: ["A. Legitimate email", "B. Phishing email"],
    correctIndex: 1,
    explanation: "This is a phishing email. Red flags: (1) WhatsApp does not manage accounts via email — all verification happens inside the app. (2) The domain 'whatsapp-verify.invalid' is fake; WhatsApp only uses '@whatsapp.com'. (3) Entering your 6-digit OTP on this site would hand over your account to attackers. (4) Never share OTPs with anyone.",
    lesson: "Tip: OTP codes are like keys to your account. No legitimate service will ask you to enter your OTP on a website link sent via email."
  },
  {
    type: "phishing",
    sender: "Microsoft Account Team",
    senderEmail: "account-alert@microsoftonline-security.invalid",
    subject: "Unusual sign-in activity detected on your Microsoft account",
    body: `Hi,

We detected a sign-in attempt from an unrecognized location:
Location: Minsk, Belarus
Time: 03:22 AM

If this was not you, your account may be compromised. Secure your account immediately:`,
    links: ["https://microsoftonline-security.invalid/secure-account"],
    options: ["A. Legitimate email", "B. Phishing email"],
    correctIndex: 1,
    explanation: "This is a phishing email. Red flags: (1) Microsoft sends emails from '@microsoft.com' or '@accountprotection.microsoft.com', not 'microsoftonline-security.invalid'. (2) Scary location data (foreign country, late night time) is used to maximize panic. (3) The link goes to a fake site designed to steal your Microsoft credentials.",
    lesson: "Tip: Legitimate Microsoft security alerts link to account.microsoft.com. Any other domain is a fake. Always navigate to security settings manually."
  },
  {
    type: "phishing",
    sender: "Bank of SafeHarbor",
    senderEmail: "alerts@safeharbor-bank-secure.invalid",
    subject: "Your debit card has been temporarily locked",
    body: `Dear Account Holder,

For your protection, we have temporarily locked your debit card following suspicious transactions.

To unlock your card and restore full account access, please verify your identity using the secure portal:`,
    links: ["https://safeharbor-bank-secure.invalid/unlock"],
    options: ["A. Legitimate email", "B. Phishing email"],
    correctIndex: 1,
    explanation: "This is a phishing email. Red flags: (1) 'Bank of SafeHarbor' is a fictional name — if you do not bank there, this is irrelevant spam. (2) Even real bank alerts come from the bank's registered domain, not 'safeharbor-bank-secure.invalid'. (3) The portal link harvests your banking credentials. Real banks never ask you to 'verify identity' via an email link.",
    lesson: "Tip: If your card is genuinely locked, call the number on the back of your card or log in directly to your bank's official app."
  },
  {
    type: "phishing",
    sender: "LinkedIn Jobs",
    senderEmail: "jobs-noreply@linkedln-recruiter.invalid",
    subject: "You have been selected for a remote job — $5,000/month",
    body: `Congratulations!

Your profile was reviewed by our recruitment team and you have been selected for a remote position offering $5,000/month with no experience required.

To accept this offer, please complete the registration form with your personal details and bank account number for payroll setup:`,
    links: ["https://linkedln-recruiter.invalid/apply-now"],
    options: ["A. Legitimate email", "B. Phishing email"],
    correctIndex: 1,
    explanation: "This is a phishing email. Red flags: (1) 'linkedln' uses 'ln' instead of 'in' — a lookalike domain. (2) No legitimate job offer requires your bank account before employment begins. (3) 'No experience required' + high salary is a classic scam bait. (4) Legitimate LinkedIn recruiter messages come from within the LinkedIn platform itself.",
    lesson: "Tip: Legitimate employers never ask for banking information during initial recruitment. Job offers requiring bank details upfront are almost always advance-fee or identity-theft scams."
  },
];

// Fake login page questions
const FAKELOGIN_QUESTIONS = [
  {
    type: "fakelogin",
    prompt: "Two login pages are shown below. One is a legitimate login page and one is a fake (phishing) page. Which page is suspicious?",
    pages: [
      {
        brand: "SecureBank™",
        url: "https://www.securebank.example.com/login",
        brandColor: "#1e6fb5",
        extraField: null,
        securityNote: "🔒 Extended Validation Certificate",
        loginLabel: "Log in to SecureBank"
      },
      {
        brand: "5ecureBa𝐧k™",
        url: "http://securebank-login-verify.invalid/account",
        brandColor: "#1e6fb5",
        extraField: "National ID Number",
        securityNote: "✔ Trusted Secure Site [Verified]",
        loginLabel: "Log in — Verify Your Account"
      }
    ],
    suspiciousPage: 1, // index of the fake page (0-based)
    explanation: "Page B is the phishing page. Red flags: (1) The URL uses HTTP (not HTTPS) — no real bank uses unencrypted login. (2) The domain 'securebank-login-verify.invalid' is not the bank's official domain. (3) The brand name contains a Unicode lookalike character '𝐧' replacing 'n'. (4) Asking for a National ID on a login page is unusual data harvesting. (5) 'Verified' badges in page content mean nothing — only check the browser's address bar.",
    lesson: "Tip: Always check the browser's address bar. Look for HTTPS, the correct domain spelling, and no extra subdomains before the brand name."
  },
  {
    type: "fakelogin",
    prompt: "Examine both login pages. Which one shows signs of being a phishing page?",
    pages: [
      {
        brand: "MailVault",
        url: "http://mailv4ult-access.invalid/signin",
        brandColor: "#d44638",
        extraField: "Recovery Phone Number",
        securityNote: "⚠ Confirm identity to continue",
        loginLabel: "Sign in — Account Verification Required"
      },
      {
        brand: "MailVault",
        url: "https://accounts.mailvault.example.com/signin",
        brandColor: "#d44638",
        extraField: null,
        securityNote: "🔒 Secure Login",
        loginLabel: "Sign in to MailVault"
      }
    ],
    suspiciousPage: 0,
    explanation: "Page A is the phishing page. Red flags: (1) The URL 'mailv4ult-access.invalid' replaces the letter 'a' with '4' — a lookalike trick. (2) HTTP (not HTTPS) means data is not encrypted. (3) 'Account Verification Required' in the title is unnecessary — login pages should just say 'sign in'. (4) Asking for a recovery phone number on a sign-in page is an attempt to harvest more data.",
    lesson: "Tip: Phishing pages often add extra urgency words ('Verification Required', 'Confirm identity') to the login title to justify collecting extra information."
  },
  {
    type: "fakelogin",
    prompt: "One of these social-media login pages is fake. Can you spot it?",
    pages: [
      {
        brand: "ConnectSphere",
        url: "https://www.connectsphere.example.com/login",
        brandColor: "#1877f2",
        extraField: null,
        securityNote: "🔒 SSL Secured",
        loginLabel: "Log in to ConnectSphere"
      },
      {
        brand: "ConnectSphere",
        url: "https://connectsphere.login-confirm.invalid/verify",
        brandColor: "#1877f2",
        extraField: "Date of Birth",
        securityNote: "🔒 ConnectSphere Security Portal",
        loginLabel: "Verify Your ConnectSphere Account"
      }
    ],
    suspiciousPage: 1,
    explanation: "Page B is the phishing page. Red flags: (1) The domain is 'login-confirm.invalid' — ConnectSphere would be the first part of the domain, not a subdomain of a random site. (2) A social network login never needs your Date of Birth — that was already collected at registration and is a data-harvesting attempt. (3) 'Verify Your Account' framing suggests something is wrong to create urgency.",
    lesson: "Tip: The real domain is always in the main part of the URL, before '.com'. 'connectsphere.login-confirm.invalid' means the site is 'login-confirm.invalid', not ConnectSphere."
  },
  {
    type: "fakelogin",
    prompt: "Two online shopping login pages are shown. Which one has the warning signs of a phishing page?",
    pages: [
      {
        brand: "ShopNow",
        url: "https://secure-checkout.shopnow.invalid/login",
        brandColor: "#ff6900",
        extraField: "Card Number (for faster checkout)",
        securityNote: "🔒 Trusted Checkout Portal",
        loginLabel: "Sign in — Secure Checkout"
      },
      {
        brand: "ShopNow",
        url: "https://www.shopnow.example.com/account/login",
        brandColor: "#ff6900",
        extraField: null,
        securityNote: "🔒 Secured by ShopNow",
        loginLabel: "Sign in to your ShopNow account"
      }
    ],
    suspiciousPage: 0,
    explanation: "Page A is the phishing page. Red flags: (1) Although it uses HTTPS, the domain 'secure-checkout.shopnow.invalid' is a subdomain of '.invalid' — the real ShopNow domain would end in '.shopnow.example.com'. (2) Asking for a credit card number on a login page is never legitimate — login only requires email and password. (3) 'Trusted Checkout Portal' is a fake trust badge inside the page content.",
    lesson: "Tip: A login page should only ask for email/username and password. Any page asking for payment card details on a login screen is a phishing page."
  },
  {
    type: "fakelogin",
    prompt: "Both pages claim to be your company's internal HR portal. Which one is the impostor?",
    pages: [
      {
        brand: "PeopleHR Portal",
        url: "https://hr.yourcompany.example.com/login",
        brandColor: "#6366f1",
        extraField: null,
        securityNote: "🔒 Internal Network Only",
        loginLabel: "Employee Sign-In"
      },
      {
        brand: "PeopleHR Portal",
        url: "https://yourcompany-hr-portal.invalid/employee-login",
        brandColor: "#6366f1",
        extraField: "Employee Salary Grade",
        securityNote: "🔒 HR Secure Portal — Annual Review",
        securityNote2: "Enter your salary grade to unlock your review documents",
        loginLabel: "Employee Login — Annual Review Access"
      }
    ],
    suspiciousPage: 1,
    explanation: "Page B is the phishing page. Red flags: (1) Domain 'yourcompany-hr-portal.invalid' is not on the company's official domain. (2) Asking for 'Employee Salary Grade' on a login screen is completely unnecessary — login requires only credentials. (3) Tying this to 'Annual Review' creates a plausible scenario but the goal is credential theft plus sensitive salary data. (4) Internal HR portals are accessed only through the company's known internal URL.",
    lesson: "Tip: HR and internal systems are accessed through company-provided bookmarks or intranet links — never through links sent in email. When in doubt, check with your IT department."
  },
];

// Social engineering scenarios
const SOCIAL_QUESTIONS = [
  {
    type: "social",
    title: "The Fake Bank Call",
    scenario: `You receive a call from someone who says they are from your bank's fraud department. They know your full name and the last four digits of your card. They say your account has been compromised and they need your full card number and PIN to 'freeze' it immediately and issue a replacement.`,
    options: [
      "A. Provide your card number and PIN to protect the account quickly.",
      "B. Hang up and call your bank directly using the number on the back of your card.",
      "C. Ask them to email you the details first, then decide."
    ],
    correctIndex: 1,
    explanation: "Option B is correct. Knowing your name and last four digits is not proof of identity — this information is easily obtainable from data breaches or social media. Banks will NEVER ask for your full card number or PIN over the phone — they already have it. The correct action is to hang up and call the number on the back of your card yourself.",
    lesson: "Tip: Scammers use partial information to appear legitimate. Your bank's genuine fraud team will never ask for your PIN or full card number by phone."
  },
  {
    type: "social",
    title: "The OTP Sharing Scam",
    scenario: `A friend's WhatsApp account sends you a message: 'Hey! I accidentally sent a 6-digit WhatsApp verification code to your number. Can you forward it to me? It's urgent, I'm trying to log back into my account.' You receive a 6-digit SMS code shortly after.`,
    options: [
      "A. Forward the code immediately — your friend needs it urgently.",
      "B. Call your friend on their actual phone number to verify the request.",
      "C. Send the code but ask your friend to change their password afterwards."
    ],
    correctIndex: 1,
    explanation: "Option B is correct. Your friend's account was already taken over by a scammer who is now trying to hijack your account. WhatsApp uses codes sent to your number to verify YOUR phone — sharing it transfers your account to the attacker. Always call the person using a known phone number (not the WhatsApp message) to verify any such request.",
    lesson: "Tip: A WhatsApp or Google code sent to YOUR number is YOUR key. No legitimate person ever needs a code sent to someone else's phone."
  },
  {
    type: "social",
    title: "The Too-Good Job Offer",
    scenario: `You receive an email from 'Global Talent Recruiters' offering you a work-from-home data-entry job paying $4,500/month with no experience required. They say the job is yours and you just need to pay a $75 'background check processing fee' to get started. They will 'reimburse' it in your first paycheck.`,
    options: [
      "A. Pay the $75 fee — it seems reasonable for a background check and you'll get it back.",
      "B. Ask them to deduct the fee from your first paycheck instead of paying upfront.",
      "C. Decline the offer entirely — legitimate employers never charge job applicants fees."
    ],
    correctIndex: 2,
    explanation: "Option C is correct. This is an advance-fee job scam. Legitimate employers never ask applicants to pay any fee before employment — background checks are the employer's cost. There is no job, there is no paycheck, and you will never be reimbursed. The $75 goes straight to the scammer.",
    lesson: "Tip: If you must pay to get a job, it is a scam. Real companies never charge application, training, or background-check fees to candidates."
  },
  {
    type: "social",
    title: "You Won the Lottery!",
    scenario: `You receive a letter claiming you have won $500,000 in an international lottery you never entered. To claim the prize, you must pay $300 in 'customs clearance and transfer taxes' via gift card within 48 hours. They include an official-looking certificate and a case number.`,
    options: [
      "A. Pay the $300 via gift card — the certificate looks real and $500K is worth the risk.",
      "B. Ask a family member to share the cost so it feels less risky.",
      "C. Ignore and report the letter as a scam — you cannot win a lottery you never entered."
    ],
    correctIndex: 2,
    explanation: "Option C is correct. You cannot win a lottery you never entered. 'Pay a fee to collect a prize' is the classic advance-fee fraud (also called the '419 scam'). Gift card payments are untraceable and unrecoverable — a massive red flag that the 'organization' is criminal. Official-looking documents are trivially easy to fake.",
    lesson: "Tip: Legitimate prizes or windfalls never require you to pay fees upfront. Gift card payment requests are nearly always a scam tactic because they are untraceable."
  },
  {
    type: "social",
    title: "Fake Tech-Support Warning",
    scenario: `While browsing, a full-screen alert pops up with loud beeping sounds, flashing red, and text saying: 'CRITICAL VIRUS DETECTED! Your computer is sending banking information to hackers. Call Microsoft Support immediately at: 1-800-FAKE-NUM to prevent data loss and arrest.' The number appears on screen multiple times.`,
    options: [
      "A. Call the number immediately — the alert sounds official and mentions Microsoft.",
      "B. Close the browser tab (or force-close the browser) and run your actual antivirus software.",
      "C. Restart your computer and then call the number to be safe."
    ],
    correctIndex: 1,
    explanation: "Option B is correct. This is a 'tech-support scam' browser popup. Microsoft, Apple, and Google NEVER display phone numbers in browser alerts asking you to call them. These popups use fear (virus, arrest, data loss) and technical-sounding language to trick you into calling scammers who will then ask for remote access to your computer or payment for fake services.",
    lesson: "Tip: Legitimate operating systems and browsers NEVER show phone numbers in pop-up warnings. Close the tab or window. If it won't close, use Task Manager."
  },
  {
    type: "social",
    title: "The Urgent Manager Request",
    scenario: `You receive a WhatsApp message from a number you do not recognise. The contact photo is your manager's face. The message reads: 'It's [Manager Name]. I'm in a board meeting and can't use my phone. I need you to buy 5 x $100 Amazon gift cards urgently for client gifts and send me the codes. I'll reimburse you today. Don't tell anyone yet.'`,
    options: [
      "A. Buy the gift cards immediately — your manager's request sounds genuine and urgent.",
      "B. Reply asking for more time, then decide later.",
      "C. Contact your manager through their official company email or phone to verify the request before doing anything."
    ],
    correctIndex: 2,
    explanation: "Option C is correct. This is 'CEO fraud' or 'boss impersonation'. Scammers use a stolen profile photo on a new number. The 'don't tell anyone' instruction is designed to isolate you. Gift card codes are untraceable and cannot be reversed. Always verify any unusual financial request through an official, separately verified channel.",
    lesson: "Tip: Any request for gift card purchases through informal channels is almost always a scam. Call your manager on their known office number to verify before acting."
  },
  {
    type: "social",
    title: "Social Media Account Recovery Scam",
    scenario: `Your Instagram account was disabled. You find what appears to be Instagram's official support account on Twitter/X. They DM you: 'We can restore your account. We just need your login email, current password, and the 6-digit code we'll send to your phone to verify ownership.' They have a blue checkmark-style badge.`,
    options: [
      "A. Provide the information — the account has a badge and it's the only way to get your account back.",
      "B. Only provide your email address, not the password or code.",
      "C. Do not provide any credentials via DM. Use only Instagram's official Help Center at instagram.com/hc."
    ],
    correctIndex: 2,
    explanation: "Option C is correct. Instagram, Facebook, and all major platforms handle account recovery exclusively through their own in-app or in-website support systems — never through DMs on another platform. Checkmarks can be purchased or faked. Providing your password + OTP gives attackers complete control of your account permanently.",
    lesson: "Tip: Official platform support NEVER asks for your password or OTPs via direct messages. Account recovery always happens on the platform's official website."
  },
  {
    type: "social",
    title: "The QR Code Scam",
    scenario: `You find a flyer at a coffee shop offering a free drink if you 'scan the QR code and complete a quick survey'. After scanning, the site looks like a well-known coffee brand and asks for your name, email, phone number, home address, and debit card number 'to deliver your free coffee voucher'.`,
    options: [
      "A. Complete the survey — a free coffee is worth sharing your details.",
      "B. Share only your name and email but skip the card number.",
      "C. Close the site without entering any information. Report the flyer to the coffee shop."
    ],
    correctIndex: 2,
    explanation: "Option C is correct. QR codes can link to phishing sites. The over-collection of personal data (phone, address, card number) for a 'free coffee' is disproportionate — this is credential and identity harvesting. Legitimate loyalty programs never require debit card numbers to send a voucher. Report suspicious QR code flyers to the business they are pretending to represent.",
    lesson: "Tip: Before scanning a QR code, ask: does the data being requested match what the reward is worth? Debit card numbers are never needed for a free offer."
  },
  {
    type: "social",
    title: "The Fake Charity Caller",
    scenario: `You receive a call from someone claiming to be collecting donations for 'Children's Emergency Relief Fund' after a recent natural disaster. They are very emotional and describe children in danger. They ask you to donate via 'quick wire transfer' or gift card codes right now because 'the situation is critical and every minute counts'.`,
    options: [
      "A. Donate via gift card as requested — the cause sounds genuine and urgent.",
      "B. Ask for their website, look up the charity independently, and donate through the official site.",
      "C. Donate half the amount to reduce risk."
    ],
    correctIndex: 1,
    explanation: "Option B is correct. Legitimate charities never pressure you for immediate wire transfers or gift cards — these are irreversible, untraceable, and are the primary method used by scam 'charities'. Emotional urgency and disaster scenarios are designed to bypass rational decision-making. Always independently verify charity registration before donating.",
    lesson: "Tip: Verify charities through official registration databases before donating. Real charities accept donations through their official website and never demand gift cards or wire transfers in a phone call."
  },
  {
    type: "social",
    title: "The Suspicious Payment Request",
    scenario: `You are selling a second-hand laptop online. A buyer contacts you, agrees to your price, and says they have 'accidentally' sent you $800 instead of $500 via a payment app. They ask you to ship the laptop AND return $300 to them. Shortly after, you see $800 in your account.`,
    options: [
      "A. Ship the laptop and return the $300 — they clearly made a mistake and you want to be honest.",
      "B. Return only the $300 overpayment and wait to ship until the payment clears.",
      "C. Do not ship anything and do not return money yet. Contact the payment app's support to verify the funds are genuine before taking any action."
    ],
    correctIndex: 2,
    explanation: "Option C is correct. This is the 'overpayment scam'. The $800 was sent via a fraudulent or reversible transaction. After you return $300 and ship the laptop, the original $800 payment is reversed — leaving you with neither the laptop nor your $500. The funds appearing in your account does not mean they are real or will stay.",
    lesson: "Tip: Overpayment scams work because money 'appearing' feels real. Payment reversals can happen days later. Never ship goods or return money until funds are confirmed as fully cleared and non-reversible."
  },
];

// Combine all question sets
const ALL_QUESTIONS = {
  phishing:   PHISHING_QUESTIONS,
  fakelogin:  FAKELOGIN_QUESTIONS,
  social:     SOCIAL_QUESTIONS,
};

/* ──────────────────────────────────────────────────────
   3. DEFAULT PLAYER STATE
────────────────────────────────────────────────────── */

function getDefaultState() {
  return {
    nickname: "",
    score: 0,
    personalBest: 0,
    completedChallenges: {  // track which question indexes were answered correctly
      phishing:  [],
      fakelogin: [],
      social:    [],
    },
    earnedBadges: [],
    soundOn: true,
    leaderboard: [
      { nickname: "CyberAce99",    score: 2400, level: "Human Firewall Elite" },
      { nickname: "Phr34kHunt3r",  score: 1800, level: "Security Guardian"   },
      { nickname: "DetectiveDena", score: 1200, level: "Security Guardian"   },
      { nickname: "ScamSpotter_J", score: 700,  level: "Phishing Detective"  },
      { nickname: "NoviceNick",    score: 300,  level: "Scam Spotter"        },
    ],
  };
}

/* ──────────────────────────────────────────────────────
   4. LOCAL STORAGE HELPERS
────────────────────────────────────────────────────── */

const STORAGE_KEY = "humanFirewallState";

// Load state from localStorage, or return the default
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const saved = JSON.parse(raw);
    // Merge with default to handle missing keys on old saves
    const def = getDefaultState();
    return {
      nickname: saved.nickname ?? def.nickname,
      score: Number(saved.score) || 0,
      personalBest: Number(saved.personalBest) || 0,
      completedChallenges: {
        phishing:  Array.isArray(saved.completedChallenges?.phishing)  ? saved.completedChallenges.phishing  : [],
        fakelogin: Array.isArray(saved.completedChallenges?.fakelogin) ? saved.completedChallenges.fakelogin : [],
        social:    Array.isArray(saved.completedChallenges?.social)    ? saved.completedChallenges.social    : [],
      },
      earnedBadges: Array.isArray(saved.earnedBadges) ? saved.earnedBadges : [],
      soundOn: saved.soundOn !== undefined ? Boolean(saved.soundOn) : true,
      leaderboard: Array.isArray(saved.leaderboard) ? saved.leaderboard : def.leaderboard,
    };
  } catch {
    return getDefaultState();
  }
}

// Save current state to localStorage
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Could not save state:", e);
  }
}

// Reset to defaults and save
function resetState() {
  const fresh = getDefaultState();
  Object.assign(state, fresh);
  saveState();
}

/* ──────────────────────────────────────────────────────
   5. LEVEL & BADGE HELPERS
────────────────────────────────────────────────────── */

// Return the player's current level object based on score
function getCurrentLevel(score) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (score >= lvl.min) current = lvl;
  }
  return current;
}

// Return the next level object (or null if max level)
function getNextLevel(score) {
  for (let i = 0; i < LEVELS.length; i++) {
    if (score < LEVELS[i].min) return LEVELS[i];
  }
  return null; // at max level
}

// Check and award badges, returning array of newly earned badge IDs
function checkBadges() {
  const newlyEarned = [];
  const { completedChallenges, earnedBadges, score } = state;

  function earn(id) {
    if (!earnedBadges.includes(id)) {
      earnedBadges.push(id);
      newlyEarned.push(id);
    }
  }

  const anyCompleted =
    completedChallenges.phishing.length +
    completedChallenges.fakelogin.length +
    completedChallenges.social.length > 0;

  if (anyCompleted)                                             earn("first_mission");
  if (completedChallenges.phishing.length >= PHISHING_QUESTIONS.length)  earn("phishing_hunter");
  if (completedChallenges.social.length   >= SOCIAL_QUESTIONS.length)    earn("scam_buster");
  if (completedChallenges.fakelogin.length >= FAKELOGIN_QUESTIONS.length) earn("privacy_protector");

  const allDone =
    completedChallenges.phishing.length  >= PHISHING_QUESTIONS.length &&
    completedChallenges.fakelogin.length >= FAKELOGIN_QUESTIONS.length &&
    completedChallenges.social.length    >= SOCIAL_QUESTIONS.length;
  if (allDone) earn("cyber_guardian");

  if (score >= 2000) earn("elite");

  return newlyEarned;
}

/* ──────────────────────────────────────────────────────
   6. SOUND EFFECTS (Web Audio API — no external files)
────────────────────────────────────────────────────── */

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency, duration, type = "sine", gainVal = 0.2) {
  if (!state.soundOn) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch { /* AudioContext may be blocked until user interaction */ }
}

function playCorrectSound() {
  playTone(523, 0.12); // C5
  setTimeout(() => playTone(659, 0.18), 100); // E5
  setTimeout(() => playTone(784, 0.25), 200); // G5
}

function playIncorrectSound() {
  playTone(220, 0.15, "sawtooth", 0.15);
  setTimeout(() => playTone(185, 0.2, "sawtooth", 0.12), 130);
}

function playClickSound() {
  playTone(880, 0.06, "sine", 0.08);
}

/* ──────────────────────────────────────────────────────
   7. TOAST NOTIFICATIONS
────────────────────────────────────────────────────── */

let toastTimer = null;

function showToast(message, type = "info", duration = 3500) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = "toast hidden"; }, duration);
}

/* ──────────────────────────────────────────────────────
   8. DASHBOARD RENDERING
────────────────────────────────────────────────────── */

function renderDashboard() {
  const { score, completedChallenges, earnedBadges } = state;

  // Total completed count
  const totalCompleted =
    completedChallenges.phishing.length +
    completedChallenges.fakelogin.length +
    completedChallenges.social.length;
  const totalChallenges = PHISHING_QUESTIONS.length + FAKELOGIN_QUESTIONS.length + SOCIAL_QUESTIONS.length;

  // Update stat cards
  document.getElementById("dash-score").textContent = score.toLocaleString();
  document.getElementById("dash-completed").textContent = `${totalCompleted} / ${totalChallenges}`;
  document.getElementById("dash-level").textContent = getCurrentLevel(score).name;
  document.getElementById("dash-badges").textContent = `${earnedBadges.length} / ${BADGES.length}`;

  // Overall progress bar
  const pct = Math.round((totalCompleted / totalChallenges) * 100);
  const progressBar = document.getElementById("overall-progress-bar");
  progressBar.style.width = pct + "%";
  const progressWrap = document.getElementById("overall-progress-bar-wrap");
  progressWrap.setAttribute("aria-valuenow", pct);
  document.getElementById("overall-progress-label").textContent =
    pct === 100 ? "100% Complete — You are a Human Firewall Elite! 🏆" :
    `${pct}% Complete — Keep going!`;

  // Level progress label
  const nextLvl = getNextLevel(score);
  const levelNextEl = document.getElementById("level-next-label");
  if (nextLvl) {
    const needed = nextLvl.min - score;
    levelNextEl.innerHTML = `Next level: <strong>${nextLvl.name}</strong> — ${needed} more points needed`;
  } else {
    levelNextEl.innerHTML = `🏆 <strong>Maximum level reached: Human Firewall Elite!</strong>`;
  }

  // Render badges grid
  renderBadgesGrid();

  // Show a daily tip
  showRandomTip();

  // Update category progress on game screen
  updateCategoryProgress();
}

function renderBadgesGrid() {
  const grid = document.getElementById("badges-grid");
  grid.innerHTML = "";
  for (const badge of BADGES) {
    const earned = state.earnedBadges.includes(badge.id);
    const item = document.createElement("div");
    item.className = `badge-item ${earned ? "earned" : "locked"}`;
    item.setAttribute("role", "listitem");
    item.setAttribute("aria-label", `${badge.name} — ${earned ? "Earned" : "Locked"}`);
    item.innerHTML = `
      <span class="badge-emoji" aria-hidden="true">${badge.emoji}</span>
      <div class="badge-name">${escapeHtml(badge.name)}</div>
      <div class="badge-desc">${escapeHtml(badge.desc)}</div>
    `;
    grid.appendChild(item);
  }
}

function updateCategoryProgress() {
  const cats = ["phishing", "fakelogin", "social"];
  const totals = {
    phishing: PHISHING_QUESTIONS.length,
    fakelogin: FAKELOGIN_QUESTIONS.length,
    social: SOCIAL_QUESTIONS.length,
  };
  for (const cat of cats) {
    const done = state.completedChallenges[cat].length;
    const total = totals[cat];
    const pct = Math.round((done / total) * 100);
    const countEl = document.getElementById(`cat-count-${cat}`);
    const fillEl  = document.getElementById(`cat-fill-${cat}`);
    if (countEl) countEl.textContent = `${done} / ${total}`;
    if (fillEl)  fillEl.style.width = pct + "%";
  }
}

function showRandomTip() {
  const tipEl = document.getElementById("daily-tip-text");
  const idx = Math.floor(Math.random() * TIPS.length);
  tipEl.textContent = TIPS[idx];
}

/* ──────────────────────────────────────────────────────
   9. QUIZ ENGINE
────────────────────────────────────────────────────── */

// Current quiz session state (reset each time a category is started)
let quiz = {
  category: null,    // "phishing" | "fakelogin" | "social"
  questions: [],     // shuffled question list
  currentIndex: 0,
  sessionAnswers: [], // { question, selectedIndex, correct }
  sessionScore: 0,
  mode: "learn",     // "learn" | "timed"
  timerInterval: null,
  timerSeconds: 30,
  answered: false,
};

function startQuiz(category) {
  quiz.category     = category;
  quiz.questions    = [...ALL_QUESTIONS[category]]; // copy array
  quiz.currentIndex = 0;
  quiz.sessionAnswers = [];
  quiz.sessionScore = 0;
  quiz.answered     = false;

  showScreen("quiz");
  renderQuestion();
}

// Show only one sub-screen within the game section
function showScreen(name) {
  const screens = {
    category: "game-category-screen",
    quiz:     "game-quiz-screen",
    results:  "game-results-screen",
    review:   "game-review-screen",
  };
  for (const [key, id] of Object.entries(screens)) {
    const el = document.getElementById(id);
    if (el) {
      if (key === name) { el.classList.remove("hidden"); }
      else              { el.classList.add("hidden");    }
    }
  }
}

function renderQuestion() {
  clearTimer();
  quiz.answered = false;

  const q = quiz.questions[quiz.currentIndex];
  const total = quiz.questions.length;
  const num = quiz.currentIndex + 1;

  // Update header labels
  const catNames = { phishing: "Phishing Detector", fakelogin: "Fake Login Detector", social: "Social Engineering" };
  document.getElementById("quiz-category-label").textContent = catNames[quiz.category] || quiz.category;
  document.getElementById("quiz-progress-label").textContent = `Question ${num} / ${total}`;

  // Progress bar
  const pct = Math.round(((num - 1) / total) * 100);
  document.getElementById("quiz-progress-bar").style.width = pct + "%";
  document.getElementById("quiz-progress-wrap").setAttribute("aria-valuenow", pct);

  // Clear feedback
  const feedbackEl = document.getElementById("answer-feedback");
  feedbackEl.className = "feedback-card hidden";
  feedbackEl.innerHTML = "";

  // Disable next button
  const nextBtn = document.getElementById("next-question-btn");
  nextBtn.disabled = true;
  nextBtn.textContent = num < total ? "Next Question →" : "See Results →";

  // Build question card content
  const card = document.getElementById("question-card");
  card.innerHTML = "";

  if (q.type === "phishing") {
    card.appendChild(buildPhishingCard(q));
  } else if (q.type === "fakelogin") {
    card.appendChild(buildFakeLoginCard(q));
  } else if (q.type === "social") {
    card.appendChild(buildSocialCard(q));
  }

  // Start timer if timed mode
  if (quiz.mode === "timed") {
    startTimer(q);
  }
}

// Build the HTML for a phishing email question
function buildPhishingCard(q) {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <p class="question-prompt">Is this email legitimate or a phishing attempt?</p>
    <div class="email-card" role="region" aria-label="Email to analyze">
      <div class="email-field">
        <span class="email-label">From:</span>
        <span class="email-value">${escapeHtml(q.sender)}</span>
        &lt;<span class="email-value suspicious">${escapeHtml(q.senderEmail)}</span>&gt;
      </div>
      <div class="email-field">
        <span class="email-label">Subject:</span>
        <span class="email-value email-subject">${escapeHtml(q.subject)}</span>
      </div>
      <div class="email-body">${escapeHtml(q.body)}</div>
      ${q.links.map(l => `<div style="margin-top:10px"><span class="fake-link" aria-label="Non-clickable example link">${escapeHtml(l)}</span></div>`).join("")}
    </div>
    <div class="options-grid" role="group" aria-label="Answer choices">
      ${q.options.map((opt, i) => `
        <button class="option-btn" data-index="${i}" aria-label="${escapeHtml(opt)}">
          <span class="option-key" aria-hidden="true">${String.fromCharCode(65 + i)}</span>
          <span>${escapeHtml(opt.replace(/^[A-C]\. /, ""))}</span>
        </button>`).join("")}
    </div>
  `;
  attachOptionListeners(wrap, q);
  return wrap;
}

// Build the HTML for a fake login page question
function buildFakeLoginCard(q) {
  const wrap = document.createElement("div");
  const pageA = q.pages[0];
  const pageB = q.pages[1];

  wrap.innerHTML = `
    <p class="question-prompt">${escapeHtml(q.prompt)}</p>
    <div class="login-compare" role="group" aria-label="Two login pages to compare">
      <div>
        <button class="login-mockup" data-index="0" aria-label="Page A — click to select as suspicious">
          <div class="login-brand" style="color:${escapeHtml(pageA.brandColor)}">${escapeHtml(pageA.brand)}</div>
          <div class="login-url">${escapeHtml(pageA.url)}</div>
          <div class="login-field"><label>Email address</label><input type="text" value="user@example.com" readonly aria-hidden="true" tabindex="-1"/></div>
          <div class="login-field"><label>Password</label><input type="password" value="placeholder" readonly aria-hidden="true" tabindex="-1"/></div>
          ${pageA.extraField ? `<div class="login-field"><label>${escapeHtml(pageA.extraField)}</label><input type="text" value="" readonly aria-hidden="true" tabindex="-1"/></div>` : ""}
          <button class="login-btn-fake" aria-hidden="true" tabindex="-1">${escapeHtml(pageA.loginLabel)}</button>
          <div class="login-badge">${escapeHtml(pageA.securityNote)}</div>
        </button>
        <p class="option-label-login">Page A</p>
      </div>
      <div>
        <button class="login-mockup" data-index="1" aria-label="Page B — click to select as suspicious">
          <div class="login-brand" style="color:${escapeHtml(pageB.brandColor)}">${escapeHtml(pageB.brand)}</div>
          <div class="login-url">${escapeHtml(pageB.url)}</div>
          <div class="login-field"><label>Email address</label><input type="text" value="user@example.com" readonly aria-hidden="true" tabindex="-1"/></div>
          <div class="login-field"><label>Password</label><input type="password" value="placeholder" readonly aria-hidden="true" tabindex="-1"/></div>
          ${pageB.extraField ? `<div class="login-field"><label>${escapeHtml(pageB.extraField)}</label><input type="text" value="" readonly aria-hidden="true" tabindex="-1"/></div>` : ""}
          <button class="login-btn-fake" aria-hidden="true" tabindex="-1">${escapeHtml(pageB.loginLabel)}</button>
          <div class="login-badge">${escapeHtml(pageB.securityNote)}</div>
        </button>
        <p class="option-label-login">Page B</p>
      </div>
    </div>
  `;

  // Attach listeners to the login mockup buttons
  const mockups = wrap.querySelectorAll(".login-mockup");
  mockups.forEach(mockup => {
    mockup.addEventListener("click", () => {
      if (quiz.answered) return;
      const selectedIndex = parseInt(mockup.getAttribute("data-index"));
      handleAnswer(q, selectedIndex);
    });
  });
  return wrap;
}

// Build the HTML for a social engineering scenario
function buildSocialCard(q) {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <h3 style="font-size:17px;font-weight:700;margin-bottom:12px;color:var(--neon-purple)">${escapeHtml(q.title)}</h3>
    <p class="question-prompt">What is the safest action to take?</p>
    <div class="question-scenario" role="region" aria-label="Scenario description">${escapeHtml(q.scenario)}</div>
    <div class="options-grid" role="group" aria-label="Answer choices">
      ${q.options.map((opt, i) => `
        <button class="option-btn" data-index="${i}" aria-label="${escapeHtml(opt)}">
          <span class="option-key" aria-hidden="true">${String.fromCharCode(65 + i)}</span>
          <span>${escapeHtml(opt.replace(/^[A-C]\. /, ""))}</span>
        </button>`).join("")}
    </div>
  `;
  attachOptionListeners(wrap, q);
  return wrap;
}

// Attach click listeners to .option-btn elements within a card
function attachOptionListeners(container, q) {
  container.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (quiz.answered) return;
      const idx = parseInt(btn.getAttribute("data-index"));
      handleAnswer(q, idx);
    });
  });
}

/* ──────────────────────────────────────────────────────
   10. ANSWER HANDLING & FEEDBACK
────────────────────────────────────────────────────── */

function handleAnswer(q, selectedIndex) {
  if (quiz.answered) return;
  quiz.answered = true;
  clearTimer();

  playClickSound();

  // For fakelogin questions, the "correct" index is stored in suspiciousPage
  const correctIdx = q.type === "fakelogin" ? q.suspiciousPage : q.correctIndex;
  const isCorrect = selectedIndex === correctIdx;
  const correctAnswerKey = q.type === "fakelogin"
    ? (correctIdx === 0 ? "Page A" : "Page B")
    : q.options[correctIdx];

  // Track session answer
  quiz.sessionAnswers.push({
    question: q,
    selectedIndex,
    correct: isCorrect,
  });

  // Award points — only once per question across all sessions
  let pointsAwarded = 0;
  if (isCorrect) {
    const catKey = quiz.category;
    const qIndex = PHISHING_QUESTIONS.indexOf(q) !== -1
      ? PHISHING_QUESTIONS.indexOf(q)
      : FAKELOGIN_QUESTIONS.indexOf(q) !== -1
      ? FAKELOGIN_QUESTIONS.indexOf(q)
      : SOCIAL_QUESTIONS.indexOf(q);

    if (!state.completedChallenges[catKey].includes(qIndex)) {
      state.completedChallenges[catKey].push(qIndex);
      state.score += POINTS_PER_CORRECT;
      pointsAwarded = POINTS_PER_CORRECT;
      quiz.sessionScore += POINTS_PER_CORRECT;
    }
    playCorrectSound();
  } else {
    playIncorrectSound();
  }

  // Update personal best
  if (state.score > state.personalBest) {
    state.personalBest = state.score;
  }

  // Visual feedback on answer buttons
  const card = document.getElementById("question-card");
  const allOptionBtns = card.querySelectorAll(".option-btn");
  allOptionBtns.forEach(btn => {
    btn.disabled = true;
    const i = parseInt(btn.getAttribute("data-index"));
    if (i === correctIdx)   btn.classList.add(isCorrect && i === selectedIndex ? "correct" : "reveal-correct");
    if (i === selectedIndex && !isCorrect) btn.classList.add("incorrect");
  });

  // Visual feedback on login mockups
  const mockups = card.querySelectorAll(".login-mockup");
  if (mockups.length) {
    mockups.forEach(m => {
      m.disabled = true;
      const i = parseInt(m.getAttribute("data-index"));
      if (i === q.suspiciousPage)  m.style.borderColor = "var(--neon-green)";
      if (i === selectedIndex && selectedIndex !== q.suspiciousPage) m.style.borderColor = "var(--neon-red)";
    });
  }

  // Show feedback card
  showFeedback(q, isCorrect, pointsAwarded, correctAnswerKey);

  // Check for new badges
  const newBadges = checkBadges();
  if (newBadges.length) {
    newBadges.forEach(id => {
      const badge = BADGES.find(b => b.id === id);
      if (badge) showToast(`🏆 Badge Unlocked: ${badge.name}!`, "success", 4000);
    });
  }

  saveState();

  // Enable next button
  document.getElementById("next-question-btn").disabled = false;
}

function showFeedback(q, isCorrect, points, correctAnswerKey) {
  const el = document.getElementById("answer-feedback");
  el.className = `feedback-card ${isCorrect ? "correct-feedback feedback-correct" : "incorrect-feedback feedback-incorrect"}`;

  const pointsHtml = isCorrect && points > 0
    ? `<div class="points-flash" aria-live="polite">+${points} pts</div>`
    : isCorrect
    ? `<div style="color:var(--muted);font-size:13px;margin-bottom:8px">Already answered — no additional points.</div>`
    : "";

  el.innerHTML = `
    ${pointsHtml}
    <div class="feedback-title">${isCorrect ? "✅ Correct!" : "❌ Incorrect"}</div>
    <div class="feedback-explanation">${escapeHtml(q.explanation)}</div>
    <div class="feedback-lesson"><strong>🔐 Security Lesson:</strong> ${escapeHtml(q.lesson)}</div>
  `;
  el.classList.remove("hidden");
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ──────────────────────────────────────────────────────
   11. TIMER (TIMED MODE)
────────────────────────────────────────────────────── */

function startTimer(q) {
  quiz.timerSeconds = 30;
  const timerDisplay = document.getElementById("timer-display");
  const timerValue   = document.getElementById("timer-value");
  timerDisplay.classList.remove("hidden", "warning");
  timerValue.textContent = quiz.timerSeconds;

  quiz.timerInterval = setInterval(() => {
    quiz.timerSeconds--;
    timerValue.textContent = quiz.timerSeconds;

    if (quiz.timerSeconds <= 10) {
      timerDisplay.classList.add("warning");
      playTone(660, 0.05, "sine", 0.05);
    }

    if (quiz.timerSeconds <= 0) {
      clearTimer();
      if (!quiz.answered) {
        showToast("⏱ Time's up!", "error", 2000);
        handleAnswer(q, -1); // -1 = no selection = incorrect
      }
    }
  }, 1000);
}

function clearTimer() {
  if (quiz.timerInterval) {
    clearInterval(quiz.timerInterval);
    quiz.timerInterval = null;
  }
  const timerDisplay = document.getElementById("timer-display");
  if (timerDisplay) {
    timerDisplay.classList.add("hidden");
    timerDisplay.classList.remove("warning");
  }
}

/* ──────────────────────────────────────────────────────
   12. RESULTS SCREEN
────────────────────────────────────────────────────── */

function showResults() {
  clearTimer();
  showScreen("results");

  const total     = quiz.sessionAnswers.length;
  const correct   = quiz.sessionAnswers.filter(a => a.correct).length;
  const incorrect = total - correct;
  const accuracy  = total > 0 ? Math.round((correct / total) * 100) : 0;
  const pts       = quiz.sessionScore;

  document.getElementById("res-total").textContent     = total;
  document.getElementById("res-correct").textContent   = correct;
  document.getElementById("res-incorrect").textContent = incorrect;
  document.getElementById("res-accuracy").textContent  = accuracy + "%";
  document.getElementById("res-points").textContent    = "+" + pts;
  document.getElementById("res-total-score").textContent = state.score.toLocaleString();

  // Performance message
  const perfMsgs = [
    { min: 90, msg: "🏆 Outstanding! You are a true Human Firewall. Keep spreading awareness!" },
    { min: 70, msg: "💪 Great work! You spotted most threats. Review the missed ones to sharpen your skills." },
    { min: 50, msg: "👍 Good effort! Cybercriminals are crafty — study the explanations to improve." },
    { min: 0,  msg: "📚 Keep learning! Recognizing threats takes practice. Review each explanation carefully." },
  ];
  const perfMsg = perfMsgs.find(m => accuracy >= m.min);
  document.getElementById("res-performance-msg").textContent = perfMsg ? perfMsg.msg : "";

  // New badges
  const newBadgesEl = document.getElementById("res-new-badges");
  const newBadgeIds = quiz.sessionAnswers.length > 0 ? checkBadges() : [];
  const freshBadges = BADGES.filter(b => state.earnedBadges.includes(b.id));
  newBadgesEl.classList.add("hidden");
  if (freshBadges.length > 0 && pts > 0) {
    newBadgesEl.classList.remove("hidden");
    newBadgesEl.innerHTML = `<p>🎖 Badges Earned This Session:</p><div class="new-badge-list">${
      freshBadges.map(b => `<span class="new-badge-item" title="${escapeHtml(b.name)}">${b.emoji}</span>`).join("")
    }</div>`;
  }

  // Next category suggestion
  const nextCatMap = { phishing: "Fake Login Detector", fakelogin: "Social Engineering", social: "Phishing Detector" };
  const nextCatName = nextCatMap[quiz.category] || "another category";
  document.getElementById("res-next-cat").textContent =
    accuracy >= 70
      ? `💡 Ready for more? Try the ${nextCatName} next!`
      : `💡 Tip: Retry this category to improve your score on missed questions.`;

  renderDashboard();
}

/* ──────────────────────────────────────────────────────
   13. REVIEW SCREEN
────────────────────────────────────────────────────── */

function showReviewScreen() {
  showScreen("review");
  const container = document.getElementById("review-list");
  container.innerHTML = "";

  quiz.sessionAnswers.forEach((ans, idx) => {
    const q = ans.question;
    const item = document.createElement("div");
    item.className = `review-item ${ans.correct ? "rev-correct" : "rev-incorrect"}`;

    const userAnswerText = q.type === "fakelogin"
      ? ans.selectedIndex === -1 ? "No answer (timed out)" : `Page ${ans.selectedIndex === 0 ? "A" : "B"}`
      : ans.selectedIndex === -1 ? "No answer (timed out)" : q.options[ans.selectedIndex];

    const correctAnswerText = q.type === "fakelogin"
      ? `Page ${q.suspiciousPage === 0 ? "A" : "B"} (the suspicious one)`
      : q.options[q.correctIndex];

    const questionTitle = q.type === "social" ? q.title :
      q.type === "phishing" ? `Email: "${q.subject}"` : `Login Page: ${q.prompt.split(".")[0]}`;

    item.innerHTML = `
      <div class="review-q-num">Question ${idx + 1} — ${ans.correct ? "✅ Correct" : "❌ Incorrect"}</div>
      <div class="review-q-text">${escapeHtml(questionTitle)}</div>
      <div class="review-answer-row">
        <span class="rev-label">Your answer:</span>
        <span class="${ans.correct ? "rev-correct-val" : "rev-incorrect-val"}">${escapeHtml(userAnswerText)}</span>
      </div>
      ${!ans.correct ? `<div class="review-answer-row"><span class="rev-label">Correct answer:</span><span class="rev-correct-val">${escapeHtml(correctAnswerText)}</span></div>` : ""}
      <div class="review-explanation">${escapeHtml(q.explanation)}</div>
    `;
    container.appendChild(item);
  });
}

/* ──────────────────────────────────────────────────────
   14. LEADERBOARD
────────────────────────────────────────────────────── */

function renderLeaderboard() {
  const tbody = document.getElementById("lb-tbody");
  tbody.innerHTML = "";

  const sorted = [...state.leaderboard].sort((a, b) => b.score - a.score);
  sorted.forEach((entry, i) => {
    const rank = i + 1;
    const rankClass = rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "";
    const isMe = entry.nickname === state.nickname && entry.score === state.score;
    const tr = document.createElement("tr");
    if (isMe) tr.classList.add("highlight");
    tr.innerHTML = `
      <td><span class="lb-rank ${rankClass}">${rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}</span></td>
      <td>${escapeHtml(entry.nickname)}${isMe ? " (You)" : ""}</td>
      <td>${Number(entry.score).toLocaleString()}</td>
      <td>${escapeHtml(entry.level)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function submitLeaderboard() {
  const input = document.getElementById("lb-nickname-input");
  const nickname = input.value.trim();
  if (!nickname) { showToast("Please enter a display nickname.", "error"); return; }
  if (!/^[a-zA-Z0-9 _\-]{1,20}$/.test(nickname)) {
    showToast("Nickname must be 1–20 characters: letters, numbers, spaces, _ or -", "error");
    return;
  }

  state.nickname = nickname;

  // Add or update this player's entry
  const existing = state.leaderboard.findIndex(e => e.nickname === nickname);
  const levelName = getCurrentLevel(state.score).name;
  if (existing >= 0) {
    if (state.score > state.leaderboard[existing].score) {
      state.leaderboard[existing].score = state.score;
      state.leaderboard[existing].level = levelName;
      showToast("🏆 Score updated on the leaderboard!", "success");
    } else {
      showToast("Your current score is not higher than your previous entry.", "info");
    }
  } else {
    state.leaderboard.push({ nickname, score: state.score, level: levelName });
    showToast(`✅ "${escapeHtml(nickname)}" added to leaderboard!`, "success");
  }

  saveState();
  renderLeaderboard();
  input.value = "";
}

/* ──────────────────────────────────────────────────────
   15. SECTION NAVIGATION
────────────────────────────────────────────────────── */

function navigateTo(sectionId) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-section") === sectionId);
    b.setAttribute("aria-current", b.getAttribute("data-section") === sectionId ? "page" : "false");
  });
  const target = document.getElementById(`section-${sectionId}`);
  if (target) target.classList.add("active");

  if (sectionId === "dashboard") renderDashboard();
  if (sectionId === "leaderboard") renderLeaderboard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ──────────────────────────────────────────────────────
   16. ANIMATED BACKGROUND (Canvas — matrix rain effect)
────────────────────────────────────────────────────── */

function initBackground() {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let width, height, columns, drops;
  const chars = "01アイウエオカキクケコサシスセソ#$%&ABCDEF";

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / 20);
    drops = Array(columns).fill(1);
  }

  resize();
  window.addEventListener("resize", resize);

  function draw() {
    ctx.fillStyle = "rgba(10,13,20,0.06)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = "14px Courier New";
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * 20;
      // Alternate colors for a richer look
      const palette = ["rgba(0,255,136,", "rgba(59,130,212,", "rgba(124,92,216,"];
      const color = palette[Math.floor(Math.random() * palette.length)];
      ctx.fillStyle = color + (Math.random() * 0.6 + 0.2) + ")";
      ctx.fillText(char, x, y * 20);
      if (y * 20 > height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  // Slow down animation for accessibility and performance
  let lastTime = 0;
  function animate(ts) {
    if (ts - lastTime > 80) { draw(); lastTime = ts; }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/* ──────────────────────────────────────────────────────
   17. SECURITY HELPER — Escape user content
────────────────────────────────────────────────────── */

// Escapes HTML special characters before inserting user-generated content
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ──────────────────────────────────────────────────────
   18. EVENT LISTENERS & INITIALIZATION
────────────────────────────────────────────────────── */

// Global player state — loaded from localStorage
let state = loadState();

document.addEventListener("DOMContentLoaded", () => {

  // ── Init background canvas ──
  initBackground();

  // ── Initial render ──
  renderDashboard();

  // ── Navigation ──
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      playClickSound();
      navigateTo(btn.getAttribute("data-section"));
    });
  });

  // ── Start Training button on hero ──
  document.getElementById("start-training-btn").addEventListener("click", () => {
    playClickSound();
    navigateTo("game");
    showScreen("category");
  });

  // ── Category card selection ──
  document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      playClickSound();
      const category = card.getAttribute("data-category");
      startQuiz(category);
    });
  });

  // ── Mode selection ──
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      playClickSound();
      document.querySelectorAll(".mode-btn").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");
      quiz.mode = btn.getAttribute("data-mode");
      const descEl = document.getElementById("mode-desc");
      descEl.textContent = quiz.mode === "timed"
        ? "Timed Challenge: 30 seconds per question. Answer before time runs out!"
        : "Learn Mode: No timer. Take your time and read explanations carefully.";
    });
  });

  // ── Next question button ──
  document.getElementById("next-question-btn").addEventListener("click", () => {
    playClickSound();
    quiz.currentIndex++;
    if (quiz.currentIndex < quiz.questions.length) {
      renderQuestion();
    } else {
      showResults();
    }
  });

  // ── Quit quiz (back to category selection) ──
  document.getElementById("quit-quiz-btn").addEventListener("click", () => {
    playClickSound();
    clearTimer();
    showScreen("category");
    updateCategoryProgress();
    renderDashboard();
  });

  // ── Results screen buttons ──
  document.getElementById("retry-quiz-btn").addEventListener("click", () => {
    playClickSound();
    startQuiz(quiz.category);
  });

  document.getElementById("back-to-cats-btn").addEventListener("click", () => {
    playClickSound();
    showScreen("category");
    updateCategoryProgress();
    renderDashboard();
  });

  document.getElementById("review-answers-btn").addEventListener("click", () => {
    playClickSound();
    showReviewScreen();
  });

  document.getElementById("back-from-review-btn").addEventListener("click", () => {
    playClickSound();
    showScreen("results");
  });

  // ── Daily tip refresh button ──
  document.getElementById("new-tip-btn").addEventListener("click", () => {
    playClickSound();
    showRandomTip();
  });

  // ── Sound toggle button ──
  const soundBtn = document.getElementById("sound-btn");
  const soundIcon = document.getElementById("sound-icon");
  function updateSoundIcon() {
    if (state.soundOn) {
      soundIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
      soundBtn.setAttribute("aria-label", "Mute sound effects");
      soundBtn.title = "Mute sound effects";
    } else {
      soundIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <line x1="23" y1="9" x2="17" y2="15"/>
        <line x1="17" y1="9" x2="23" y2="15"/>`;
      soundBtn.setAttribute("aria-label", "Unmute sound effects");
      soundBtn.title = "Unmute sound effects";
    }
  }

  soundBtn.addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    saveState();
    updateSoundIcon();
    showToast(state.soundOn ? "🔊 Sound enabled" : "🔇 Sound muted", "info", 2000);
  });
  updateSoundIcon();

  // ── Reset progress button ──
  document.getElementById("reset-btn").addEventListener("click", () => {
    document.getElementById("reset-modal").classList.remove("hidden");
  });

  document.getElementById("confirm-reset-btn").addEventListener("click", () => {
    resetState();
    document.getElementById("reset-modal").classList.add("hidden");
    renderDashboard();
    navigateTo("dashboard");
    showToast("✅ Progress has been reset.", "info", 3000);
  });

  document.getElementById("cancel-reset-btn").addEventListener("click", () => {
    document.getElementById("reset-modal").classList.add("hidden");
  });

  // Close modal on backdrop click
  document.getElementById("reset-modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("reset-modal")) {
      document.getElementById("reset-modal").classList.add("hidden");
    }
  });

  // Keyboard: close modal with Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.getElementById("reset-modal").classList.add("hidden");
    }
  });

  // ── Leaderboard submit ──
  document.getElementById("lb-submit-btn").addEventListener("click", () => {
    playClickSound();
    submitLeaderboard();
  });

  // Allow pressing Enter in the nickname field
  document.getElementById("lb-nickname-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitLeaderboard();
  });

  // ── Keyboard navigation for quiz options ──
  document.addEventListener("keydown", (e) => {
    if (quiz.answered) return;
    const quizScreen = document.getElementById("game-quiz-screen");
    if (quizScreen.classList.contains("hidden")) return;
    const keys = { "1": 0, "2": 1, "3": 2, "a": 0, "b": 1, "c": 2 };
    const idx = keys[e.key.toLowerCase()];
    if (idx !== undefined) {
      const q = quiz.questions[quiz.currentIndex];
      if (q && idx < q.options?.length) {
        const card = document.getElementById("question-card");
        const btn = card.querySelectorAll(".option-btn")[idx];
        if (btn && !btn.disabled) btn.click();
      }
    }
  });

  // ── Sound: unlock audio context on first interaction (mobile requirement) ──
  document.body.addEventListener("click", () => {
    try { getAudioCtx().resume(); } catch {}
  }, { once: true });

});
