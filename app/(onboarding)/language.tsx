import { View, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getLocales } from "expo-localization";

const LANGUAGES = [
  { code: "en",      label: "English",              native: "English" },
  { code: "zh_Hans", label: "Chinese Simplified",   native: "\u7B80\u4F53\u4E2D\u6587" },
  { code: "zh_Hant", label: "Chinese Traditional",  native: "\u7E41\u9AD4\u4E2D\u6587" },
] as const;

function detectClosestLanguage(): string {
  try {
    const locales = getLocales();
    const deviceLang = locales[0]?.languageCode ?? "en";
    if (deviceLang.startsWith("zh")) {
      const script = locales[0]?.languageTag ?? "";
      if (script.includes("Hant") || script.includes("TW") || script.includes("HK")) {
        return "zh_Hant";
      }
      return "zh_Hans";
    }
    return "en";
  } catch {
    return "en";
  }
}

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string>("en");

  useEffect(() => {
    setSelected(detectClosestLanguage());
  }, []);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 8 }}>
      {/* Back */}
      <View className="px-4">
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
          <Text
            className="text-center text-grey-900"
            style={{
              fontFamily: "BricolageGrotesque_700Bold",
              fontSize: 26,
              lineHeight: 34,
            }}
          >
            Select your language
          </Text>
          <Text variant="body" color="muted" className="text-center">
            You can change this anytime in settings.
          </Text>
        </View>

        {/* Language list */}
        <View className="gap-3">
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
              <View className="flex-1">
                <Text
                  variant="bodyMedium"
                  className={cn(
                    selected === lang.code ? "text-grey-900" : "text-grey-700",
                  )}
                >
                  {lang.label}
                </Text>
                <Text variant="caption" color="muted">
                  {lang.native}
                </Text>
              </View>
              {selected === lang.code && (
                <Ionicons name="checkmark-circle" size={24} color={Colors.success.DEFAULT} />
              )}
            </Pressable>
          ))}
        </View>
      </View>

      {/* Continue */}
      <View className="px-6" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button
          variant="primary"
          size="lg"
          label="Continue"
          fullWidth
          onPress={() => router.push("/(onboarding)/university")}
        />
      </View>
    </View>
  );
}
