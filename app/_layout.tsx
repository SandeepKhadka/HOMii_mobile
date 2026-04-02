import "../global.css";

import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

function RouteGuard() {
  const { session, loading, profile } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Hide splash screen now that we know where to navigate
    SplashScreen.hideAsync();

    const currentSegment = segments[0];
    const inAuthGroup = currentSegment === "(auth)";
    const inOnboarding = currentSegment === "(onboarding)";
    const inTabs = currentSegment === "(tabs)";
    console.log("[RouteGuard] session:", !!session, "profile:", !!profile, "onboarded:", profile?.onboarding_completed, "segment:", currentSegment);

    // Don't redirect away from reset-password (recovery OTP creates a session)
    const isResettingPassword = inAuthGroup && segments[1] === "reset-password";

    if (!session) {
      if (!inAuthGroup) router.replace("/(auth)/welcome");
    } else if (isResettingPassword) {
      // Let the user finish resetting their password
      SplashScreen.hideAsync();
      return;
    } else if (!profile) {
      // Session exists but profile not loaded yet — keep splash visible, wait
      console.log("[RouteGuard] Waiting for profile to load...");
      return;
    } else if (profile.onboarding_completed) {
      if (!inTabs) router.replace("/(tabs)");
    } else {
      if (!inOnboarding) router.replace("/(onboarding)/terms");
    }
  }, [session, loading, segments, profile]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <RouteGuard />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="category/[id]" options={{ animation: "slide_from_right" }} />
            <Stack.Screen name="ambassador" options={{ animation: "slide_from_right" }} />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
