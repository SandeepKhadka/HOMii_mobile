import { View, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { PRIVACY_SECTIONS } from "@/constants/legal";

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-grey-100">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center mr-2"
        >
          <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
        </Pressable>
        <Text
          style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 18 }}
          className="text-grey-900 flex-1"
        >
          {t("legal.privacyTitle")}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-2xl p-5 gap-5">
          {PRIVACY_SECTIONS.map((s) => (
            <View key={s.title} className="gap-2">
              <Text variant="bodyMedium" className="font-semibold text-grey-900">
                {s.title}
              </Text>
              <Text variant="body" color="muted" className="leading-relaxed">
                {s.body}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
