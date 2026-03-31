import { Stack } from "expo-router";

export default function AmbassadorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="signup" />
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}
