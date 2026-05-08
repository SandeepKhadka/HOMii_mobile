import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { Stack, usePathname } from "expo-router";
import { OnboardingProgressProvider } from "@/contexts/OnboardingProgressContext";
import { capture } from "@/lib/analytics";

function AbandonmentTracker() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        const current = pathnameRef.current;
        if (!current.includes("complete")) {
          capture("onboarding_abandonment", { last_screen: current });
        }
      }
    });
    return () => sub.remove();
  }, []);

  return null;
}

export default function OnboardingLayout() {
  return (
    <OnboardingProgressProvider>
      <AbandonmentTracker />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="terms" />
        <Stack.Screen name="language" />
        <Stack.Screen name="university" />
        <Stack.Screen name="checklist-intro" />
        <Stack.Screen name="[phaseId]" />
        <Stack.Screen name="category-checklist" />
        <Stack.Screen name="complete" />
      </Stack>
    </OnboardingProgressProvider>
  );
}
