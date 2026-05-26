import { View, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getLocales } from "expo-localization";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { useTranslation } from "react-i18next";
import { TERMS_SECTIONS, TERMS_VERSION } from "@/constants/legal";

export default function TermsScreen() {
  const insets = useSafeAreaInsets();
  const { updateProfile } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAccept = async () => {
    setSaving(true);
    const locale = getLocales()[0]?.languageTag ?? "en";
    await updateProfile({
      accepted_terms_at: new Date().toISOString(),
      accepted_terms_version: TERMS_VERSION,
      accepted_terms_locale: locale,
    });
    setSaving(false);
    router.push("/(onboarding)/language");
  };

  const handleDecline = () => {
    showAlert(
      t("onboarding.terms.declineTitle"),
      t("onboarding.terms.declineMessage"),
      [{ text: "OK" }],
      "warning"
    );
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 8 }}>
      {/* No back button — this is the first onboarding screen */}
      <View className="px-6 pt-4">
        <View className="items-center">
          <Ionicons name="document-text-outline" size={48} color={Colors.primary[400]} />
        </View>

        <View className="items-center gap-1 mt-4 mb-2">
          <Text
            className="text-center text-grey-900"
            style={{
              fontFamily: "BricolageGrotesque_700Bold",
              fontSize: 26,
              lineHeight: 34,
            }}
          >
            {t("onboarding.terms.title")}
          </Text>
          <Text variant="body" color="muted" className="text-center">
            {t("onboarding.terms.subtitle")}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* Links to full documents */}
        <View className="flex-row justify-center gap-6 my-4">
          <Pressable onPress={() => router.push("/terms" as any)}>
            <Text variant="bodyMedium" color="primary" className="font-semibold underline">
              {t("onboarding.terms.termsOfService")}
            </Text>
          </Pressable>
          <Pressable onPress={() => router.push("/privacy" as any)}>
            <Text variant="bodyMedium" color="primary" className="font-semibold underline">
              {t("onboarding.terms.privacyPolicy")}
            </Text>
          </Pressable>
        </View>

        {/* Terms card */}
        <View className="border border-grey-200 rounded-2xl p-5 gap-5">
          {TERMS_SECTIONS.map((s) => (
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

      {/* Agreement + Buttons */}
      <View className="px-6 pt-3 gap-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <Pressable
          onPress={() => setAgreed(!agreed)}
          className="flex-row items-start gap-3"
        >
          <Ionicons
            name={agreed ? "checkbox" : "square-outline"}
            size={22}
            color={agreed ? Colors.primary[500] : Colors.grey[400]}
            style={{ marginTop: 2 }}
          />
          <Text variant="caption" color="secondary" className="flex-1" style={{ lineHeight: 18 }}>
            {t("onboarding.terms.agree")}
          </Text>
        </Pressable>

        <Button
          variant="primary"
          size="lg"
          label={t("onboarding.terms.accept")}
          fullWidth
          disabled={!agreed || saving}
          onPress={handleAccept}
        />

        <Pressable onPress={handleDecline} className="items-center py-1">
          <Text variant="bodyMedium" color="muted">
            {t("onboarding.terms.decline")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
