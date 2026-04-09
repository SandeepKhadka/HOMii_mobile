import { useState } from "react";
import { View, Pressable, ScrollView, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { router } from "expo-router";
import { Text, Button, Input } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";

export default function AmbassadorSignupScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [studentEmail, setStudentEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [course, setCourse] = useState("");
  const [motivation, setMotivation] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!studentEmail || !confirmEmail || !course) {
      showAlert(t("common.error"), t("ambassadorSignup.fillRequired"), undefined, "error");
      return;
    }
    if (studentEmail !== confirmEmail) {
      showAlert(t("common.error"), t("ambassadorSignup.emailMismatch"), undefined, "error");
      return;
    }
    if (!agreed) {
      showAlert(t("common.error"), t("ambassadorSignup.acceptTerms"), undefined, "error");
      return;
    }
    if (!user) {
      showAlert(t("common.error"), t("ambassadorSignup.mustSignIn"), undefined, "error");
      return;
    }

    setLoading(true);
    try {
      await api.applyAmbassador({ studentEmail, course, motivation: motivation || undefined });
      showAlert(t("ambassadorSignup.success"), t("ambassadorSignup.successMessage"), [
        { text: "OK", onPress: () => router.replace("/ambassador/dashboard" as any) },
      ], "success");
    } catch (err) {
      showAlert(t("common.error"), (err as Error).message, undefined, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="flex-row items-center px-4 pb-4"
        style={{ backgroundColor: Colors.teal.DEFAULT, paddingTop: insets.top + 12 }}
      >
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text
          color="inverse"
          style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 20, lineHeight: 28, marginLeft: 8 }}
        >
          Ambassador signup
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "android" ? 80 : 0}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center px-8 pt-8 pb-6">
            <Text
              className="text-grey-900 text-center"
              style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 26, lineHeight: 34, letterSpacing: -0.5 }}
            >
              {t("ambassadorSignup.title")}
            </Text>
            <Text variant="body" color="muted" className="text-center mt-2">
              {t("ambassadorSignup.subtitle")}
            </Text>
          </View>

          <View className="px-6 gap-1">
            <Text className="text-grey-900 mb-4" style={{ fontFamily: "BricolageGrotesque_600SemiBold", fontSize: 16 }}>
              {t("ambassadorSignup.formTitle")}
            </Text>

            <View className="gap-4">
              <Input
                label={t("ambassadorSignup.studentMail")}
                placeholder={t("ambassadorSignup.studentMailPlaceholder")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={studentEmail}
                onChangeText={setStudentEmail}
              />
              <Input
                label={t("ambassadorSignup.confirmEmail")}
                placeholder={t("ambassadorSignup.confirmEmailPlaceholder")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={confirmEmail}
                onChangeText={setConfirmEmail}
              />
              <Input
                label={t("ambassadorSignup.course")}
                placeholder={t("ambassadorSignup.coursePlaceholder")}
                autoCapitalize="words"
                value={course}
                onChangeText={setCourse}
              />
              <View className="gap-1.5">
                <Text variant="captionMedium" color="secondary">
                  {t("ambassadorSignup.motivation")}
                </Text>
                <TextInput
                  placeholder={t("ambassadorSignup.motivationPlaceholder")}
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  scrollEnabled={false}
                  value={motivation}
                  onChangeText={setMotivation}
                  style={{
                    borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12,
                    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12,
                    minHeight: 110, fontFamily: "BricolageGrotesque_400Regular",
                    fontSize: 15, color: "#111827", lineHeight: 22,
                  }}
                />
              </View>
            </View>

            <Pressable
              onPress={() => setAgreed(!agreed)}
              className="flex-row items-start gap-3 mt-6 bg-grey-50 rounded-xl px-4 py-4"
            >
              <View
                className="w-6 h-6 rounded items-center justify-center mt-0.5"
                style={{
                  backgroundColor: agreed ? Colors.navy.DEFAULT : "transparent",
                  borderWidth: agreed ? 0 : 2,
                  borderColor: Colors.grey[300],
                }}
              >
                {agreed && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text variant="caption" className="flex-1 text-grey-600" style={{ lineHeight: 18 }}>
                {t("ambassadorSignup.agreement")}
              </Text>
            </Pressable>

            <View className="mt-6">
              <Button
                variant="primary"
                size="lg"
                label={loading ? t("ambassadorSignup.submitting") : t("ambassadorSignup.submit")}
                fullWidth
                onPress={handleSubmit}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
