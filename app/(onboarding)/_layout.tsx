import { Stack } from "expo-router";
import { OnboardingProgressProvider } from "@/contexts/OnboardingProgressContext";

export default function OnboardingLayout() {
  return (
    <OnboardingProgressProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="language" />
        <Stack.Screen name="university" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="checklist-intro" />
        <Stack.Screen name="before-fly" />
        <Stack.Screen name="upon-arrival" />
        <Stack.Screen name="settling-in" />
        <Stack.Screen name="category-checklist" />
        <Stack.Screen name="complete" />
      </Stack>
    </OnboardingProgressProvider>
  );
}
