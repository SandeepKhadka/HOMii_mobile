import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { session, loading, profile } = useAuth();

  // Still loading auth or profile
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // Session exists but profile not fetched yet — wait
  if (profile === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!profile.onboarding_completed) {
    return <Redirect href="/(onboarding)/language" />;
  }

  return <Redirect href="/(tabs)" />;
}
