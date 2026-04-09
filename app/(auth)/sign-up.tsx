import { useState } from "react";
import { View, Pressable, ImageBackground, ScrollView, Keyboard } from "react-native";
import { router } from "expo-router";
import { Text, Button, Input } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { useTranslation } from "react-i18next";

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const { signUp, signInWithGoogle } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (!fullName || !email || !password) {
      showAlert(t("common.error"), t("common.fillAllFields"), undefined, "error");
      return;
    }
    if (password.length < 8) {
      showAlert(t("common.error"), t("auth.signUp.passwordMin"), undefined, "error");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      showAlert(t("common.error"), t("auth.signUp.passwordUppercase"), undefined, "error");
      return;
    }
    if (!/[a-z]/.test(password)) {
      showAlert(t("common.error"), t("auth.signUp.passwordLowercase"), undefined, "error");
      return;
    }
    if (!/[0-9]/.test(password)) {
      showAlert(t("common.error"), t("auth.signUp.passwordNumber"), undefined, "error");
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]\{\};':"\\|,.<>\/?]/.test(password)) {
      showAlert(t("common.error"), t("auth.signUp.passwordSpecial"), undefined, "error");
      return;
    }
    setLoading(true);
    const { error, needsConfirmation } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      showAlert(t("auth.signUp.failed"), error, undefined, "error");
    } else if (needsConfirmation) {
      router.push({ pathname: "/(auth)/verify-otp" as any, params: { email } });
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      bounces={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Top hero */}
      <ImageBackground
        source={require("@/assets/images/onboarding.png")}
        style={{ height: 200 }}
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
          <Text
            color="inverse"
            style={{
              fontFamily: "BricolageGrotesque_800ExtraBold",
              fontSize: 40,
              lineHeight: 56,
              letterSpacing: -0.4,
              textAlign: "center",
            }}
          >
            HOMii
          </Text>
        </View>
      </ImageBackground>

      {/* Bottom card */}
      <View
        className="flex-1 bg-white rounded-t-3xl -mt-8 px-8 pt-8"
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="gap-1 mb-6">
          <Text
            className="text-grey-900"
            style={{
              fontFamily: "BricolageGrotesque_700Bold",
              fontSize: 28,
              lineHeight: 36,
              letterSpacing: -0.5,
            }}
          >
            {t("auth.signUp.title")}
          </Text>
          <Text variant="body" color="muted">
            {t("auth.signUp.subtitle")}
          </Text>
        </View>

        <View className="gap-4 mb-6">
          <Input
            label={t("common.fullName")}
            placeholder={t("auth.signUp.fullNamePlaceholder")}
            autoCapitalize="words"
            autoComplete="name"
            value={fullName}
            onChangeText={setFullName}
            leftIcon={<Ionicons name="person-outline" size={18} color={Colors.grey[400]} />}
          />
          <Input
            label={t("common.email")}
            placeholder={t("auth.signUp.emailPlaceholder")}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Ionicons name="mail-outline" size={18} color={Colors.grey[400]} />}
          />
          <Input
            label={t("common.password")}
            placeholder={t("auth.signUp.passwordPlaceholder")}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={Colors.grey[400]} />}
            rightIcon={
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={Colors.grey[400]}
              />
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
        </View>

        <Button
          variant="primary"
          size="lg"
          label={loading ? t("auth.signUp.submitting") : t("auth.signUp.submit")}
          fullWidth
          onPress={handleSignUp}
        />

        <Pressable
          onPress={async () => {
            const { error } = await signInWithGoogle();
            if (error) showAlert(t("common.googleSignInFailed"), error, undefined, "error");
          }}
          className="flex-row items-center justify-center gap-3 border border-grey-200 rounded-2xl py-3.5 mt-2"
        >
          <Ionicons name="logo-google" size={20} color={Colors.grey[700]} />
          <Text variant="bodyMedium" className="text-grey-700 font-semibold">
            {t("common.continueWithGoogle")}
          </Text>
        </Pressable>

        <View className="flex-row justify-center gap-1 mt-4">
          <Text variant="body" color="muted">{t("auth.signUp.hasAccount")}</Text>
          <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
            <Text variant="bodyMedium" color="primary" className="font-semibold">
              {t("auth.signUp.signIn")}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
