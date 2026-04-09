import { useState } from "react";
import { View, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Text, Button, Input } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { useTranslation } from "react-i18next";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      showAlert(t("common.error"), t("editProfile.nameRequired"), undefined, "error");
      return;
    }
    setSaving(true);
    await updateProfile({ full_name: fullName.trim() });
    setSaving(false);
    showAlert(t("editProfile.savedTitle"), t("editProfile.savedMessage"), [
      { text: "OK", onPress: () => router.back() },
    ], "success");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View
        className="flex-row items-center px-4 pb-4 bg-white border-b border-grey-100"
        style={{ paddingTop: insets.top + 12 }}
      >
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
          {t("editProfile.title")}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="gap-5">
          {/* Avatar placeholder */}
          <View className="items-center mb-2">
            <View className="w-20 h-20 rounded-full bg-grey-100 items-center justify-center">
              <Ionicons name="person" size={36} color={Colors.grey[400]} />
            </View>
          </View>

          {/* Full name */}
          <Input
            label={t("editProfile.fullNameLabel")}
            placeholder={t("editProfile.fullNamePlaceholder")}
            autoCapitalize="words"
            autoComplete="name"
            value={fullName}
            onChangeText={setFullName}
            leftIcon={<Ionicons name="person-outline" size={18} color={Colors.grey[400]} />}
          />

          {/* Email — read-only */}
          <View className="gap-1.5">
            <Text variant="captionMedium" color="secondary">
              {t("editProfile.emailLabel")}
            </Text>
            <View className="flex-row items-center border border-grey-200 rounded-xl px-4 py-3 bg-grey-50">
              <Ionicons name="mail-outline" size={18} color={Colors.grey[400]} className="mr-3" />
              <Text variant="body" className="text-grey-500 flex-1 ml-3">
                {profile?.email ?? ""}
              </Text>
            </View>
            <Text variant="caption" color="muted" className="mt-0.5">
              {t("editProfile.emailNote")}
            </Text>
          </View>

          <Button
            variant="primary"
            size="lg"
            label={saving ? t("editProfile.saving") : t("editProfile.save")}
            fullWidth
            disabled={saving}
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
