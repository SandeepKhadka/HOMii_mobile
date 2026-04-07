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
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { Colors } from "@/constants/colors";
import { identify, reset } from "@/lib/analytics";

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
      currentSegment === "category" || currentSegment === "ambassador" || currentSegment === "r";

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
          <CategoriesProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="category/[id]" options={{ animation: "slide_from_right" }} />
            <Stack.Screen name="ambassador" options={{ animation: "slide_from_right" }} />
          </Stack>
          <RouteGuard />
          </CategoriesProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
