import { useState, useRef, useEffect, useCallback } from "react";
import { View, Pressable, ImageBackground, TextInput } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 90;

export default function VerifyOtpScreen() {
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyOtp } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      showAlert(t("common.error"), t("auth.verifyOtp.fullCode"), undefined, "error");
      return;
    }
    setLoading(true);
    const { error } = await verifyOtp(email!, code);
    setLoading(false);
    if (error) {
      showAlert(t("auth.verifyOtp.verificationFailed"), error, undefined, "error");
    }
  };

  const handleResend = useCallback(async () => {
    if (countdown > 0) return;
    const { error } = await supabase.auth.resend({ type: "signup", email: email! });
    if (error) {
      showAlert(t("common.error"), error.message, undefined, "error");
    } else {
      setCountdown(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(""));
      showAlert(t("auth.verifyOtp.codeResent"), t("auth.verifyOtp.checkEmail"), undefined, "success");
    }
  }, [countdown, email, t]);

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
            <Ionicons name="mail-open-outline" size={40} color="#fff" />
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
            style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 28, lineHeight: 36, letterSpacing: -0.5 }}
          >
            {t("auth.verifyOtp.title")}
          </Text>
          <Text variant="body" color="muted" className="text-center">
            {t("auth.verifyOtp.subtitle")}{"\n"}
            <Text variant="bodyMedium" className="text-grey-900">{email}</Text>
          </Text>
        </View>

        <View className="flex-row justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              value={digit}
              onChangeText={(text) => handleChange(text.slice(-1), index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={{
                width: 48, height: 56, borderWidth: 2,
                borderColor: digit ? Colors.primary[500] : Colors.grey[200],
                borderRadius: 12, textAlign: "center", fontSize: 22,
                fontFamily: "BricolageGrotesque_700Bold", color: Colors.grey[900],
                backgroundColor: digit ? Colors.primary[50] : Colors.white,
              }}
            />
          ))}
        </View>

        <Button
          variant="primary"
          size="lg"
          label={loading ? t("common.verifying") : t("auth.verifyOtp.submit")}
          fullWidth
          onPress={handleVerify}
        />

        <View className="items-center mt-6">
          {countdown > 0 ? (
            <Text variant="body" color="muted">
              {t("common.resendCodeIn")}{" "}
              <Text variant="bodyMedium" className="text-grey-900 font-semibold">
                {formatTime(countdown)}
              </Text>
            </Text>
          ) : (
            <Pressable onPress={handleResend}>
              <Text variant="body" color="muted">
                {t("common.didntReceiveCode")}{" "}
                <Text variant="bodyMedium" color="primary" className="font-semibold">
                  {t("common.resend")}
                </Text>
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
