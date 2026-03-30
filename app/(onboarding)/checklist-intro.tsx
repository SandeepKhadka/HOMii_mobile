import { View, Pressable } from "react-native";
import { router } from "expo-router";
import { Screen, Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { PHASES } from "@/constants/categories";

const PHASE_ICONS: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
  "before-fly":   "airplane-outline",
  "upon-arrival":  "location-outline",
  "settling-in":   "home-outline",
};

export default function ChecklistIntroScreen() {
  return (
    <Screen className="bg-white" edges={["top", "bottom"]}>
      {/* Back + University pill */}
      <View className="flex-row items-center px-4 pt-2">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
        </Pressable>
        <View className="flex-1 items-center">
          <View className="bg-grey-100 px-5 py-2 rounded-full">
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
              className="flex-row items-center bg-primary-50 rounded-2xl px-5 py-5 gap-4"
              onPress={() => {
                // TODO: navigate to phase detail
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
      <View className="px-6 pb-8">
        <Button
          variant="primary"
          size="lg"
          label="Continue"
          fullWidth
          onPress={() => router.replace("/(tabs)")}
        />
      </View>
    </Screen>
  );
}
