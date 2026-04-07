import PostHog from 'posthog-react-native';

const key = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com';

// No-op when key not configured — safe to call everywhere
const client = key ? new PostHog(key, { host }) : null;

export function capture(event: string, properties?: Record<string, unknown>) {
  client?.capture(event, properties);
}

export function identify(userId: string, traits?: Record<string, unknown>) {
  client?.identify(userId, traits);
}

export function reset() {
  client?.reset();
}
