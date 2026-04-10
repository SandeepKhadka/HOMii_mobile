import "../global.css";
import "@/lib/i18n";

import * as Sentry from "@sentry/react-native";
import { Stack, useRouter, useSegments } from "expo-router";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  enabled: !!process.env.EXPO_PUBLIC_SENTRY_DSN,
});
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
import { View, ActivityIndicator, StyleSheet, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { Colors } from "@/constants/colors";
import { identify, reset } from "@/lib/analytics";
import { setAppLanguage } from "@/lib/i18n";

SplashScreen.preventAutoHideAsync();

function RouteGuard() {
  const { session, loading, profile } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Show overlay while: auth state unknown (loading) OR session exists but profile not yet fetched
  const showLoadingOverlay = loading || (!!session && !profile);

  useEffect(() => {
    if (loading) return;
    if (session && !profile) return; // profile fetch still in progress

    const currentSegment = segments[0];
    const inAuthGroup = currentSegment === "(auth)";
    const inOnboarding = currentSegment === "(onboarding)";
    const inTabs = currentSegment === "(tabs)";
    const inAllowedDeepRoute =
      currentSegment === "category" ||
      currentSegment === "ambassador" ||
      currentSegment === "r" ||
      currentSegment === "settings" ||
      currentSegment === "edit-profile";

    console.log("[RouteGuard] session:", !!session, "profile:", !!profile, "onboarded:", profile?.onboarding_completed, "segment:", currentSegment);

    const isResettingPassword = inAuthGroup && segments[1] === "reset-password";

    if (!session) {
      SplashScreen.hideAsync();
      if (!inAuthGroup) router.replace("/(auth)/welcome");
    } else if (isResettingPassword) {
      SplashScreen.hideAsync();
    } else if (profile?.onboarding_completed) {
      SplashScreen.hideAsync();
      if (!inTabs && !inAllowedDeepRoute && !inOnboarding) {
        router.replace("/(tabs)");
      }
    } else {
      SplashScreen.hideAsync();
      if (!inOnboarding && !inAllowedDeepRoute) router.replace("/(onboarding)/terms");
    }
  }, [session, loading, segments, profile]);

  // Sync i18n language from profile
  useEffect(() => {
    if (profile?.language_code) {
      setAppLanguage(profile.language_code);
    }
  }, [profile?.language_code]);

  // Request notification permissions after login
  useEffect(() => {
    if (!session) return;
    (async () => {
      const { status: existing } = await Notifications.getPermissionsAsync();
      if (existing !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    })();
  }, [session?.user?.id]);

  // Identify / reset analytics user on auth state change
  useEffect(() => {
    if (session?.user) {
      identify(session.user.id, { email: session.user.email });
    } else {
      reset();
    }
  }, [session?.user?.id]);

  if (!showLoadingOverlay) return null;

  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color={Colors.primary[500]} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
});

function RootLayout() {
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
          <AlertProvider>
          <CategoriesProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="category/[id]" options={{ animation: "slide_from_right" }} />
            <Stack.Screen name="ambassador" options={{ animation: "slide_from_right" }} />
            <Stack.Screen name="settings" options={{ animation: "slide_from_right" }} />
            <Stack.Screen name="edit-profile" options={{ animation: "slide_from_right" }} />
          </Stack>
          <RouteGuard />
          </CategoriesProvider>
          </AlertProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(RootLayout);
