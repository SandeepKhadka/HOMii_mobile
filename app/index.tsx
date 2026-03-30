import { Redirect } from "expo-router";

/**
 * Entry point — redirects to welcome screen.
 * Once auth is wired up, this will check session state
 * and redirect to (tabs) if already signed in.
 */
export default function Index() {
  return <Redirect href="/(auth)/welcome" />;
}
