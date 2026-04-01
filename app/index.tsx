import { View, ActivityIndicator } from "react-native";

export default function Index() {
  // All routing is handled by RouteGuard in _layout.tsx
  // This screen just shows a loading spinner while auth state resolves
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <ActivityIndicator size="large" color="#6366F1" />
    </View>
  );
}
