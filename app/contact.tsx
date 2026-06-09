import { useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";

const SUBJECT_MAX = 200;
const MESSAGE_MAX = 5000;

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { showAlert } = useAlert();
  // Optional prefill from deep links (e.g. /contact?subject=...&message=...)
  // used by the "Recommend an app to HOMii" CTAs on empty search results.
  const { subject: subjectParam, message: messageParam } =
    useLocalSearchParams<{ subject?: string; message?: string }>();

  const [subject, setSubject] = useState(subjectParam ?? "");
  const [message, setMessage] = useState(messageParam ?? "");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = subject.trim().length > 0 && message.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await api.createSupportTicket(subject.trim(), message.trim());
      setSubmitting(false);
      showAlert(
        t("contact.sentTitle"),
        t("contact.sentMessage"),
        [{ text: t("common.ok"), onPress: () => router.back() }],
        "success",
      );
    } catch (e) {
      setSubmitting(false);
      console.log("[Contact] Ticket submit failed:", (e as Error).message);
      showAlert(t("contact.failedTitle"), t("contact.failedMessage"), undefined, "error");
    }
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
          {t("contact.title")}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View className="items-center pt-8 pb-2">
          <View className="w-16 h-16 rounded-full bg-primary-50 items-center justify-center mb-3">
            <Ionicons name="chatbubbles-outline" size={28} color={Colors.primary[500]} />
          </View>
          <Text
            className="text-center text-grey-900"
            style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 22, lineHeight: 28 }}
          >
            {t("contact.heading")}
          </Text>
          <Text variant="body" color="muted" className="text-center mt-1" style={{ lineHeight: 20 }}>
            {t("contact.subheading")}
          </Text>
        </View>

        {profile?.email ? (
          <View className="bg-white rounded-xl px-4 py-3 mt-6 flex-row items-center gap-3">
            <Ionicons name="mail-outline" size={18} color={Colors.grey[500]} />
            <View className="flex-1">
              <Text variant="caption" color="muted">{t("contact.fromLabel")}</Text>
              <Text variant="body" className="text-grey-900">{profile.email}</Text>
            </View>
          </View>
        ) : null}

        <View className="mt-5 gap-2">
          <Text variant="captionMedium" color="secondary">
            {t("contact.subjectLabel")} *
          </Text>
          <View className="bg-white border border-grey-200 rounded-xl px-4 h-12 justify-center">
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder={t("contact.subjectPlaceholder")}
              placeholderTextColor={Colors.grey[400]}
              maxLength={SUBJECT_MAX}
              style={{ color: Colors.grey[900], fontSize: 15 }}
            />
          </View>
        </View>

        <View className="mt-4 gap-2">
          <Text variant="captionMedium" color="secondary">
            {t("contact.messageLabel")} *
          </Text>
          <View className="bg-white border border-grey-200 rounded-xl px-4 pt-3 pb-3">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={t("contact.messagePlaceholder")}
              placeholderTextColor={Colors.grey[400]}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={MESSAGE_MAX}
              style={{ color: Colors.grey[900], fontSize: 15, minHeight: 140 }}
            />
          </View>
          <Text variant="caption" color="muted" className="text-right">
            {message.length}/{MESSAGE_MAX}
          </Text>
        </View>

        <View className="mt-6">
          <Button
            variant="primary"
            size="lg"
            label={submitting ? t("contact.sending") : t("contact.send")}
            fullWidth
            disabled={!canSubmit}
            leftIcon={submitting ? <ActivityIndicator size="small" color="#fff" /> : undefined}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
