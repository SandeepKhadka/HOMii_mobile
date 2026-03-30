import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
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
      <Stack.Screen name="complete" />
    </Stack>
  );
}
