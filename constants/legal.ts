// Single source of truth for Terms & Privacy content shown both during
// onboarding (app/(onboarding)/terms.tsx) and in the standalone screens
// (app/terms.tsx, app/privacy.tsx). Bump TERMS_VERSION when the text changes
// materially — users will be re-prompted via the onboarding gate.

export const TERMS_VERSION = "1.0";

export type LegalSection = { title: string; body: string };

export const TERMS_SECTIONS: LegalSection[] = [
  {
    title: "1. Acceptance of Terms",
    body: "Welcome to HOMii. By accessing or using our application, you agree to be bound by these Terms and Conditions. Our service provides a platform to help international students set up essential services in the UK. If you disagree with any part of these terms, you may not access the service.",
  },
  {
    title: "2. User Responsibilities",
    body: "As a member of the HOMii community, you are responsible for maintaining the confidentiality of your account information. You agree to provide accurate, current, and complete information during the registration process.",
  },
  {
    title: "3. Privacy Policy",
    body: "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and share your personal information. By using HOMii, you consent to our collection and use of personal data as outlined in the Privacy Policy.",
  },
  {
    title: "4. Affiliate Disclosure",
    body: "Some links within HOMii may earn HOMii a commission at no extra cost to you. When you download or sign up for a partner service through HOMii, the affiliate network may pay HOMii a commission.",
  },
  {
    title: "5. Termination",
    body: "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.",
  },
  {
    title: "6. Modifications",
    body: "We reserve the right to modify or replace these terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. Continued use of the service after modifications constitutes acceptance.",
  },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: "1. Information We Collect",
    body: "When you create a HOMii account we store your email, name, selected university and language preference. We also store your onboarding progress, accepted terms version and (if you apply) ambassador application details. Authentication is handled by Supabase Auth.",
  },
  {
    title: "2. Affiliate Click Tracking",
    body: "When you tap a partner app inside HOMii we record a click event containing your user ID, the app, platform (iOS/Android), a hashed IP address and user agent. This lets us attribute commissions and detect fraudulent activity. Click records are automatically deleted after 90 days.",
  },
  {
    title: "3. Referral Attribution",
    body: "If you join HOMii through an ambassador's referral link, we store the referral code on your profile so the ambassador receives credit for any qualifying conversions. Attribution is recorded once and cannot be changed after sign-up.",
  },
  {
    title: "4. Analytics & Error Reporting",
    body: "We use PostHog to understand how users move through the app and Sentry to capture crashes and errors. These services may receive your user ID, device information and screen-level events. They do not receive your password or payment details.",
  },
  {
    title: "5. Sharing with Partners",
    body: "We never sell your personal data. When you visit a partner via an affiliate link, only an anonymous click ID is forwarded to the partner so they can attribute the conversion back to HOMii. Your email and name are not shared.",
  },
  {
    title: "6. Your Rights",
    body: "You can edit your profile and preferences at any time from the Settings screen. You can delete your account from Settings → Account → Delete Account, which permanently removes your profile and anonymizes any historical click records.",
  },
  {
    title: "7. Contact",
    body: "For any privacy-related questions, requests, or to exercise your data rights, please contact us at support@homiiapps.com.",
  },
];
