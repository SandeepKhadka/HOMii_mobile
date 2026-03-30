import { View, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Screen, Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import { Colors } from "@/constants/colors";

const LANGUAGES = [
  { code: "en", label: "English",  flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "zh", label: "Mandarin", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "ar", label: "Arabic",   flag: "\u{1F1F8}\u{1F1E6}" },
  { code: "es", label: "Spanish",  flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "hi", label: "Hindi",    flag: "\u{1F1EE}\u{1F1F3}" },
] as const;

export default function LanguageScreen() {
  const [selected, setSelected] = useState<string>("en");

  return (
    <Screen className="bg-white" edges={["top", "bottom"]}>
      {/* Back */}
      <View className="px-4 pt-2">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
        </Pressable>
      </View>

      <View className="flex-1 px-6 pt-4 gap-6">
        {/* Globe icon */}
        <View className="items-center">
          <Ionicons name="globe-outline" size={48} color={Colors.primary[500]} />
        </View>

        {/* Title */}
        <View className="items-center gap-1">
          <Text variant="h2" className="text-center font-heading text-grey-900">
            Select you language
          </Text>
          <Text variant="body" color="muted" className="text-center">
            You can change this anytime.
          </Text>
        </View>

        {/* Language list */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="gap-3 pb-4">
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => setSelected(lang.code)}
                className={cn(
                  "flex-row items-center px-5 py-4 rounded-2xl border",
                  selected === lang.code
                    ? "border-primary-200 bg-primary-50"
                    : "border-grey-200 bg-white",
                )}
              >
                <Text className="text-2xl mr-4">{lang.flag}</Text>
                <Text
                  variant="bodyMedium"
                  className={cn(
                    "flex-1",
                    selected === lang.code ? "text-grey-900" : "text-grey-700",
                  )}
                >
                  {lang.label}
                </Text>
                {selected === lang.code ? (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.success.DEFAULT} />
                ) : (
                  <Ionicons name="ellipse-outline" size={24} color={Colors.success.DEFAULT} />
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Continue */}
      <View className="px-6 pb-8">
        <Button
          variant="primary"
          size="lg"
          label="Continue"
          fullWidth
          onPress={() => router.push("/(onboarding)/university")}
        />
      </View>
    </Screen>
  );
}
