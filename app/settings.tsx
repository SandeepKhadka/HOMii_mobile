import { View, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
import { useState, useMemo, useEffect } from "react";
import { router } from "expo-router";
import { Text, Button, Input } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { cn } from "@/lib/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { getLocales } from "expo-localization";

const LANGUAGES = [
  { code: "en",      label: "English",             native: "English" },
  { code: "zh_Hans", label: "Chinese Simplified",  native: "\u7B80\u4F53\u4E2D\u6587" },
  { code: "zh_Hant", label: "Chinese Traditional", native: "\u7E41\u9AD4\u4E2D\u6587" },
] as const;

const FALLBACK_UNIVERSITIES = [
  { name: "University College London", city: "London" },
  { name: "University of Manchester", city: "Manchester" },
  { name: "University of Edinburgh", city: "Edinburgh" },
  { name: "King's College London", city: "London" },
  { name: "University of Glasgow", city: "Glasgow" },
  { name: "University of Leeds", city: "Leeds" },
  { name: "University of Birmingham", city: "Birmingham" },
  { name: "Imperial College London", city: "London" },
  { name: "University of Nottingham", city: "Nottingham" },
  { name: "University of Bristol", city: "Bristol" },
  { name: "University of the West of England (UWE Bristol)", city: "Bristol" },
  { name: "University of Sheffield", city: "Sheffield" },
  { name: "University of Liverpool", city: "Liverpool" },
  { name: "Cardiff University", city: "Cardiff" },
  { name: "University of Exeter", city: "Exeter" },
  { name: "University of Southampton", city: "Southampton" },
  { name: "University of Bath", city: "Bath" },
  { name: "Swansea University", city: "Swansea" },
  { name: "University of Essex", city: "Colchester" },
  { name: "University of Huddersfield", city: "Huddersfield" },
];

type Section = "language" | "university" | null;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>(null);
  const [saving, setSaving] = useState(false);

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    profile?.language_code ?? profile?.language ?? "en",
  );

  // University state
  const [universities, setUniversities] = useState(FALLBACK_UNIVERSITIES);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(
    profile?.university ?? null,
  );

  useEffect(() => {
    if (activeSection === "university" && universities === FALLBACK_UNIVERSITIES) {
      setLoadingUnis(true);
      api.getUniversities()
        .then((data) => {
          if (data && data.length > 0) {
            setUniversities(data.map((u) => ({ name: u.name, city: u.city })));
          }
        })
        .catch(() => {})
        .finally(() => setLoadingUnis(false));
    }
  }, [activeSection]);

  const filteredUniversities = useMemo(
    () =>
      universities.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.city.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, universities],
  );

  const saveLanguage = async () => {
    setSaving(true);
    const deviceLocale = getLocales()[0]?.languageTag ?? "en";
    // Update language_code and language_selected_at; never touch ref_id
    await updateProfile({
      language_code: selectedLanguage,
      language: selectedLanguage,
      device_locale: deviceLocale,
      language_selected_at: new Date().toISOString(),
    });
    setSaving(false);
    setActiveSection(null);
    Alert.alert("Saved", "Language updated successfully.");
  };

  const saveUniversity = async () => {
    if (!selectedUniversity) return;
    setSaving(true);
    // Update university name; never touch ref_id
    await updateProfile({ university: selectedUniversity });
    setSaving(false);
    setActiveSection(null);
    Alert.alert("Saved", "University updated successfully.");
  };

  // ─── Language picker ───────────────────────────────────────────────────────────
  if (activeSection === "language") {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 8 }}>
        <View className="px-4">
          <Pressable
            onPress={() => setActiveSection(null)}
            className="w-10 h-10 items-center justify-center"
          >
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
              Select Language
            </Text>
            <Text variant="body" color="muted" className="text-center">
              Choose your preferred language
            </Text>
          </View>

          <View className="gap-3">
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => setSelectedLanguage(lang.code)}
                className={cn(
                  "flex-row items-center px-5 py-4 rounded-2xl border",
                  selectedLanguage === lang.code
                    ? "border-primary-200 bg-primary-50"
                    : "border-grey-200 bg-white",
                )}
              >
                <View className="flex-1">
                  <Text variant="bodyMedium" className="text-grey-700">
                    {lang.label}
                  </Text>
                  <Text variant="caption" color="muted">
                    {lang.native}
                  </Text>
                </View>
                {selectedLanguage === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.success.DEFAULT} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <View className="px-6" style={{ paddingBottom: insets.bottom + 16 }}>
          <Button
            variant="primary"
            size="lg"
            label="Save Language"
            fullWidth
            disabled={saving}
            onPress={saveLanguage}
          />
        </View>
      </View>
    );
  }

  // ─── University picker ─────────────────────────────────────────────────────────
  if (activeSection === "university") {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 8 }}>
        <View className="px-4">
          <Pressable
            onPress={() => setActiveSection(null)}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
          </Pressable>
        </View>

        <View className="flex-1 px-6 pt-2 gap-5">
          <View className="items-center">
            <Ionicons name="school-outline" size={48} color={Colors.primary[500]} />
          </View>
          <View className="items-center gap-1">
            <Text
              className="text-center text-grey-900"
              style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 26, lineHeight: 34 }}
            >
              Change University
            </Text>
            <Text variant="body" color="muted" className="text-center">
              Select your university
            </Text>
          </View>

          <Input
            placeholder="Search for your university"
            value={search}
            onChangeText={setSearch}
            leftIcon={<Ionicons name="search-outline" size={18} color={Colors.grey[400]} />}
            autoCorrect={false}
          />

          {loadingUnis ? (
            <View className="items-center py-8">
              <ActivityIndicator size="small" color={Colors.primary[500]} />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="gap-3 pb-4">
                {filteredUniversities.map((uni) => (
                  <Pressable
                    key={uni.name}
                    onPress={() => setSelectedUniversity(uni.name)}
                    className={cn(
                      "px-5 py-4 rounded-2xl border",
                      selectedUniversity === uni.name
                        ? "border-primary-200 bg-primary-50"
                        : "border-grey-200 bg-white",
                    )}
                  >
                    <View className="flex-row items-center">
                      <View className="flex-1">
                        <Text variant="bodyMedium" className="text-grey-900">
                          {uni.name}
                        </Text>
                        <Text variant="caption" color="muted">
                          {uni.city}
                        </Text>
                      </View>
                      {selectedUniversity === uni.name && (
                        <Ionicons name="checkmark-circle" size={24} color={Colors.success.DEFAULT} />
                      )}
                    </View>
                  </Pressable>
                ))}
                {filteredUniversities.length === 0 && (
                  <Text variant="body" color="muted" className="text-center py-8">
                    No universities found
                  </Text>
                )}
              </View>
            </ScrollView>
          )}
        </View>

        <View className="px-6" style={{ paddingBottom: insets.bottom + 16 }}>
          <Button
            variant="primary"
            size="lg"
            label="Save University"
            fullWidth
            disabled={!selectedUniversity || saving}
            onPress={saveUniversity}
          />
        </View>
      </View>
    );
  }

  // ─── Main settings menu ────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-grey-100">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center mr-2"
        >
          <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
        </Pressable>
        <Text
          style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 18 }}
          className="text-grey-900"
        >
          Settings
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text variant="caption" color="muted" className="tracking-widest mb-3">
          PREFERENCES
        </Text>

        <View className="bg-white rounded-2xl overflow-hidden mb-6">
          {/* Language */}
          <Pressable
            onPress={() => setActiveSection("language")}
            className="flex-row items-center px-4 py-4 border-b border-grey-100"
          >
            <View className="w-9 h-9 rounded-xl bg-primary-50 items-center justify-center mr-3">
              <Ionicons name="globe-outline" size={18} color={Colors.primary[500]} />
            </View>
            <View className="flex-1">
              <Text variant="body" className="text-grey-800">Language</Text>
              <Text variant="caption" color="muted">
                {LANGUAGES.find((l) => l.code === (profile?.language_code ?? profile?.language))?.label ?? "English"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.grey[400]} />
          </Pressable>

          {/* University */}
          <Pressable
            onPress={() => setActiveSection("university")}
            className="flex-row items-center px-4 py-4"
          >
            <View className="w-9 h-9 rounded-xl bg-primary-50 items-center justify-center mr-3">
              <Ionicons name="school-outline" size={18} color={Colors.primary[500]} />
            </View>
            <View className="flex-1">
              <Text variant="body" className="text-grey-800">University</Text>
              <Text variant="caption" color="muted">
                {profile?.university ?? "Not set"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.grey[400]} />
          </Pressable>
        </View>

        <Text variant="caption" color="muted" className="tracking-widest mb-3">
          ABOUT
        </Text>

        <View className="bg-white rounded-2xl overflow-hidden">
          <View className="flex-row items-center px-4 py-4 border-b border-grey-100">
            <View className="w-9 h-9 rounded-xl bg-grey-100 items-center justify-center mr-3">
              <Ionicons name="document-text-outline" size={18} color={Colors.grey[500]} />
            </View>
            <Text variant="body" className="text-grey-800 flex-1">Terms & Conditions</Text>
            {profile?.accepted_terms_version ? (
              <Text variant="caption" color="muted">v{profile.accepted_terms_version}</Text>
            ) : null}
          </View>
          <View className="flex-row items-center px-4 py-4">
            <View className="w-9 h-9 rounded-xl bg-grey-100 items-center justify-center mr-3">
              <Ionicons name="information-circle-outline" size={18} color={Colors.grey[500]} />
            </View>
            <Text variant="body" className="text-grey-800 flex-1">App Version</Text>
            <Text variant="caption" color="muted">1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
