import { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Switch,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { useTranslation } from "react-i18next";
import type { ConnectSocials } from "@/types/database";

// Opt-in editor for the Connect feature: toggle discoverability + manage
// social handles. Saves to the profiles table (connect_enabled + socials).
// Other students discover this user via list_connect_profiles RPC only
// when connect_enabled is true.
export default function ConnectProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { profile, updateProfile } = useAuth();
  const { showAlert } = useAlert();

  const initial: ConnectSocials = profile?.socials ?? {};
  const [enabled,     setEnabled]     = useState<boolean>(profile?.connect_enabled ?? false);
  const [instagram,   setInstagram]   = useState(initial.instagram   ?? "");
  const [facebook,    setFacebook]    = useState(initial.facebook    ?? "");
  const [twitter,     setTwitter]     = useState(initial.twitter     ?? "");
  const [linkedin,    setLinkedin]    = useState(initial.linkedin    ?? "");
  const [customLabel, setCustomLabel] = useState(initial.custom_label ?? "");
  const [customUrl,   setCustomUrl]   = useState(initial.custom_url   ?? "");
  const [saving, setSaving] = useState(false);

  // Strip leading @ and surrounding whitespace from handle inputs.
  const cleanHandle = (v: string) => v.trim().replace(/^@/, "");

  const handleSave = async () => {
    setSaving(true);
    const socials: ConnectSocials = {};
    const ig = cleanHandle(instagram);
    const fb = cleanHandle(facebook);
    const tw = cleanHandle(twitter);
    const li = cleanHandle(linkedin);
    const cl = customLabel.trim();
    const cu = customUrl.trim();
    if (ig) socials.instagram = ig;
    if (fb) socials.facebook  = fb;
    if (tw) socials.twitter   = tw;
    if (li) socials.linkedin  = li;
    if (cl && cu) {
      socials.custom_label = cl;
      socials.custom_url   = cu;
    }

    await updateProfile({ connect_enabled: enabled, socials });
    setSaving(false);
    showAlert(
      t("connectProfile.savedTitle"),
      enabled ? t("connectProfile.savedEnabled") : t("connectProfile.savedDisabled"),
      [{ text: t("common.ok"), onPress: () => router.back() }],
      "success",
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
        <Text style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 18 }} className="text-grey-900 flex-1">
          {t("connectProfile.title")}
        </Text>
        {saving && <ActivityIndicator size="small" color={Colors.primary[500]} />}
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Opt-in toggle card */}
        <View className="bg-white rounded-2xl p-5 mt-6 flex-row items-center gap-4">
          <View className="w-12 h-12 rounded-xl bg-primary-50 items-center justify-center">
            <Ionicons name="people-outline" size={24} color={Colors.primary[500]} />
          </View>
          <View className="flex-1">
            <Text variant="bodyMedium" className="text-grey-900">{t("connectProfile.toggleLabel")}</Text>
            <Text variant="caption" color="muted" style={{ lineHeight: 18 }}>{t("connectProfile.toggleSubtitle")}</Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ true: Colors.primary[500], false: Colors.grey[200] }}
            thumbColor="#fff"
          />
        </View>

        <Text variant="caption" color="muted" className="mt-6 mb-1" style={{ lineHeight: 18 }}>
          {t("connectProfile.privacyNote")}
        </Text>

        {/* Social handles */}
        <Text variant="caption" color="muted" className="tracking-widest mt-6 mb-3">
          {t("connectProfile.socialsSection").toUpperCase()}
        </Text>

        <View className="bg-white rounded-2xl overflow-hidden">
          <SocialField
            icon="logo-instagram"
            iconColor="#E4405F"
            label="Instagram"
            placeholder={t("connectProfile.instagramPlaceholder")}
            value={instagram}
            onChangeText={setInstagram}
            isFirst
          />
          <SocialField
            icon="logo-facebook"
            iconColor="#1877F2"
            label="Facebook"
            placeholder={t("connectProfile.facebookPlaceholder")}
            value={facebook}
            onChangeText={setFacebook}
          />
          <SocialField
            icon="logo-twitter"
            iconColor="#000000"
            label="X (Twitter)"
            placeholder={t("connectProfile.twitterPlaceholder")}
            value={twitter}
            onChangeText={setTwitter}
          />
          <SocialField
            icon="logo-linkedin"
            iconColor="#0A66C2"
            label="LinkedIn"
            placeholder={t("connectProfile.linkedinPlaceholder")}
            value={linkedin}
            onChangeText={setLinkedin}
            isLast
          />
        </View>

        {/* Custom link */}
        <Text variant="caption" color="muted" className="tracking-widest mt-6 mb-3">
          {t("connectProfile.customSection").toUpperCase()}
        </Text>

        <View className="bg-white rounded-2xl p-4 gap-3">
          <View>
            <Text variant="captionMedium" color="secondary" className="mb-1.5">{t("connectProfile.customLabelField")}</Text>
            <TextInput
              value={customLabel}
              onChangeText={setCustomLabel}
              placeholder={t("connectProfile.customLabelPlaceholder")}
              placeholderTextColor={Colors.grey[400]}
              maxLength={30}
              style={{ borderWidth: 1, borderColor: Colors.grey[200], borderRadius: 12, paddingHorizontal: 14, height: 44, color: Colors.grey[900], fontSize: 15 }}
            />
          </View>
          <View>
            <Text variant="captionMedium" color="secondary" className="mb-1.5">{t("connectProfile.customUrlField")}</Text>
            <TextInput
              value={customUrl}
              onChangeText={setCustomUrl}
              placeholder="https://..."
              placeholderTextColor={Colors.grey[400]}
              autoCapitalize="none"
              keyboardType="url"
              style={{ borderWidth: 1, borderColor: Colors.grey[200], borderRadius: 12, paddingHorizontal: 14, height: 44, color: Colors.grey[900], fontSize: 15 }}
            />
          </View>
        </View>

        <View className="mt-8" />
      </ScrollView>

      {/* Sticky save button — sits above the system gesture/nav bar via
          safe-area insets so it never gets clipped on edge-to-edge phones. */}
      <View
        className="px-6 pt-3 bg-white border-t border-grey-100"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <Button
          variant="primary"
          size="lg"
          label={saving ? t("connectProfile.saving") : t("connectProfile.save")}
          fullWidth
          disabled={saving}
          onPress={handleSave}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

interface SocialFieldProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (s: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

function SocialField({ icon, iconColor, label, placeholder, value, onChangeText, isLast }: SocialFieldProps) {
  return (
    <View
      className="flex-row items-center px-4 py-3 gap-3"
      style={isLast ? {} : { borderBottomWidth: 1, borderBottomColor: Colors.grey[100] }}
    >
      <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: iconColor + "15" }}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text variant="caption" color="muted">{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.grey[400]}
          autoCapitalize="none"
          autoCorrect={false}
          style={{ color: Colors.grey[900], fontSize: 15, paddingVertical: 2 }}
        />
      </View>
    </View>
  );
}
