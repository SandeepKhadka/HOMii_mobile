import { View, Pressable, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getLocales } from "expo-localization";
import { useTranslation } from "react-i18next";
import { setAppLanguage, profileCodeToI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { api, type ApiLanguage } from "@/lib/api";

/** Fallback list used when API is unavailable */
const FALLBACK_LANGUAGES: ApiLanguage[] = [
  { id: "en",      code: "en",      name: "English",             nativeName: "English",  flag: "🇬🇧", sortOrder: 0 },
  { id: "zh_Hans", code: "zh_Hans", name: "Chinese Simplified",  nativeName: "简体中文",  flag: "🇨🇳", sortOrder: 1 },
  { id: "zh_Hant", code: "zh_Hant", name: "Chinese Traditional", nativeName: "繁體中文",  flag: "🇹🇼", sortOrder: 2 },
];

function detectClosestCode(langs: ApiLanguage[]): string {
  try {
    const locales = getLocales();
    const tag = locales[0]?.languageTag ?? "en";
    if (tag.startsWith("zh")) {
      const isTraditional = tag.includes("Hant") || tag.includes("TW") || tag.includes("HK");
      const match = langs.find(l => l.code === (isTraditional ? "zh_Hant" : "zh_Hans"));
      if (match) return match.code;
    }
    return "en";
  } catch {
    return "en";
  }
}

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { updateProfile } = useAuth();
  const [languages, setLanguages] = useState<ApiLanguage[]>(FALLBACK_LANGUAGES);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("en");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getLanguages()
      .then(data => {
        if (data && data.length > 0) {
          setLanguages(data);
          setSelected(detectClosestCode(data));
        } else {
          setSelected(detectClosestCode(FALLBACK_LANGUAGES));
        }
      })
      .catch(() => setSelected(detectClosestCode(FALLBACK_LANGUAGES)))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (code: string) => {
    setSelected(code);
    setAppLanguage(code);
  };

  const handleContinue = async () => {
    setSaving(true);
    const deviceLocale = getLocales()[0]?.languageTag ?? "en";
    await updateProfile({
      language_code: selected,
      language: selected,
      device_locale: deviceLocale,
      language_selected_at: new Date().toISOString(),
    });
    setSaving(false);
    router.push("/(onboarding)/university");
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 8 }}>
      <View className="px-4">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
        </Pressable>
      </View>

      <View className="flex-1 px-6 pt-4 gap-6">
        <View className="items-center">
          <Ionicons name="globe-outline" size={48} color={Colors.primary[500]} />
        </View>

        <View className="items-center gap-1">
          <Text
            className="text-center text-grey-900"
            style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 26, lineHeight: 34 }}
          >
            {t("onboarding.language.title")}
          </Text>
          <Text variant="body" color="muted" className="text-center">
            {t("onboarding.language.subtitle")}
          </Text>
        </View>

        {loading ? (
          <View className="items-center py-8">
            <ActivityIndicator size="small" color={Colors.primary[500]} />
          </View>
        ) : (
          <View className="gap-3">
            {languages.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => handleSelect(lang.code)}
                className={cn(
                  "flex-row items-center px-5 py-4 rounded-2xl border",
                  selected === lang.code ? "border-primary-200 bg-primary-50" : "border-grey-200 bg-white",
                )}
              >
                {lang.flag ? (
                  <Text style={{ fontSize: 22, marginRight: 12 }}>{lang.flag}</Text>
                ) : null}
                <View className="flex-1">
                  <Text variant="bodyMedium" className={cn(selected === lang.code ? "text-grey-900" : "text-grey-700")}>
                    {lang.name}
                  </Text>
                  <Text variant="caption" color="muted">{lang.nativeName}</Text>
                </View>
                {selected === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.success.DEFAULT} />
                )}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View className="px-6" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button
          variant="primary"
          size="lg"
          label={saving ? "..." : t("onboarding.language.continue")}
          fullWidth
          disabled={saving}
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}
