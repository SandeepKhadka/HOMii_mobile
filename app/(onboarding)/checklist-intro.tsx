import { View, Pressable, ImageBackground } from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { PHASES } from "@/constants/categories";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PHASE_ICONS: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
  "before-fly":   "airplane-outline",
  "upon-arrival":  "location-outline",
  "settling-in":   "home-outline",
};

export default function ChecklistIntroScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require("@/assets/images/phases.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1" style={{ backgroundColor: "rgba(255,255,255,0.3)" }}>
        {/* Back + University pill */}
        <View className="flex-row items-center px-4" style={{ paddingTop: insets.top + 8 }}>
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
          </Pressable>
          <View className="flex-1 items-center">
            <View className="bg-white/80 px-5 py-2 rounded-full">
              <Text variant="captionMedium" className="text-grey-700">UWE, Bristol</Text>
            </View>
          </View>
          <View className="w-10" />
        </View>

        <View className="flex-1 px-6 pt-6 gap-6">
          <Text variant="h2" className="font-heading text-grey-900">
            Lets get you set up
          </Text>

          {/* Phase cards */}
          <View className="gap-4">
            {PHASES.map((phase) => (
              <Pressable
                key={phase.id}
                className="flex-row items-center bg-white/90 rounded-2xl px-5 py-5 gap-4"
                style={{
                  elevation: 2,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                }}
                onPress={() => {
                  router.push(`/(onboarding)/${phase.id}` as any);
                }}
              >
                <Ionicons
                  name={PHASE_ICONS[phase.id] || "ellipse-outline"}
                  size={24}
                  color={Colors.grey[900]}
                />
                <View className="flex-1">
                  <Text variant="subtitle" className="font-heading text-grey-900">
                    {phase.title}
                  </Text>
                  <Text variant="caption" color="muted">
                    {phase.subtitle}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color={Colors.grey[900]} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Continue */}
        <View className="px-6" style={{ paddingBottom: insets.bottom + 24 }}>
          <Button
            variant="primary"
            size="lg"
            label="Continue"
            fullWidth
            onPress={() => router.push("/(onboarding)/before-fly")}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
