import { useState } from "react";
import { View, Pressable, ImageBackground, Keyboard } from "react-native";
import { router } from "expo-router";
import { Text, Button, Input } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { resetPasswordForEmail } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    Keyboard.dismiss();
    if (!email) {
      showAlert(t("common.error"), t("auth.forgotPassword.enterEmail"), undefined, "error");
      return;
    }
    setLoading(true);
    const { error } = await resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      showAlert(t("common.error"), error, undefined, "error");
    } else {
      router.push({ pathname: "/(auth)/reset-password" as any, params: { email } });
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ImageBackground
        source={require("@/assets/images/onboarding.png")}
        style={{ height: 220 }}
        resizeMode="cover"
      >
        <View className="px-4" style={{ paddingTop: insets.top + 8 }}>
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center">
          <View
            className="w-20 h-20 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <Ionicons name="key-outline" size={40} color="#fff" />
          </View>
        </View>
      </ImageBackground>

      <View
        className="flex-1 bg-white rounded-t-3xl -mt-8 px-8 pt-8"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="items-center gap-2 mb-8">
          <Text
            className="text-grey-900 text-center"
            style={{
              fontFamily: "BricolageGrotesque_700Bold",
              fontSize: 28,
              lineHeight: 36,
              letterSpacing: -0.5,
            }}
          >
            {t("auth.forgotPassword.title")}
          </Text>
          <Text variant="body" color="muted" className="text-center">
            {t("auth.forgotPassword.subtitle")}
          </Text>
        </View>

        <View className="mb-6">
          <Input
            label={t("common.email")}
            placeholder={t("auth.forgotPassword.emailPlaceholder")}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Ionicons name="mail-outline" size={18} color={Colors.grey[400]} />}
          />
        </View>

        {/* Hint for Google users */}
        <View className="flex-row items-center gap-2 bg-primary-50 px-4 py-3 rounded-xl mb-4">
          <Ionicons name="information-circle-outline" size={20} color={Colors.primary[500]} />
          <Text variant="caption" className="text-grey-600 flex-1">
            {t("auth.forgotPassword.googleHint")}
          </Text>
        </View>

        <Button
          variant="primary"
          size="lg"
          label={loading ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit")}
          fullWidth
          onPress={handleSendCode}
        />

        <View className="flex-row justify-center mt-6">
          <Pressable onPress={() => router.back()}>
            <Text variant="body" color="primary" className="font-semibold">
              {t("auth.forgotPassword.backToSignIn")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
