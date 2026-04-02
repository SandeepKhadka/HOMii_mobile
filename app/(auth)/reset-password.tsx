import { useState, useRef, useEffect, useCallback } from "react";
import { View, Pressable, ImageBackground, TextInput, Alert, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text, Button, Input } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 90;

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyResetOtp, updatePassword, resetPasswordForEmail, signOut } = useAuth();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [otpVerified, setOtpVerified] = useState(false);
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

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      Alert.alert("Error", "Please enter the full 6-digit code");
      return;
    }
    setLoading(true);
    const { error } = await verifyResetOtp(email!, code);
    setLoading(false);
    if (error) {
      Alert.alert("Verification Failed", error);
    } else {
      setOtpVerified(true);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      Alert.alert("Error", "Password must contain at least one uppercase letter");
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      Alert.alert("Error", "Password must contain at least one lowercase letter");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      Alert.alert("Error", "Password must contain at least one number");
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      Alert.alert("Error", "Password must contain at least one special character");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(newPassword);
    setLoading(false);
    if (error) {
      Alert.alert("Error", error);
    } else {
      // Sign out the recovery session so user can sign in fresh
      await signOut();
      Alert.alert("Success", "Your password has been reset successfully. Please sign in with your new password.", [
        { text: "OK", onPress: () => router.replace("/(auth)/sign-in") },
      ]);
    }
  };

  const handleResend = useCallback(async () => {
    if (countdown > 0) return;
    const { error } = await resetPasswordForEmail(email!);
    if (error) {
      Alert.alert("Error", error);
    } else {
      setCountdown(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(""));
      Alert.alert("Code Resent", "Check your email for a new code");
    }
  }, [countdown, email]);

  return (
    <ScrollView
      className="flex-1 bg-white"
      bounces={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
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
            <Ionicons
              name={otpVerified ? "lock-open-outline" : "shield-checkmark-outline"}
              size={40}
              color="#fff"
            />
          </View>
        </View>
      </ImageBackground>

      <View
        className="flex-1 bg-white rounded-t-3xl -mt-8 px-8 pt-8"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        {!otpVerified ? (
          <>
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
                Enter reset code
              </Text>
              <Text variant="body" color="muted" className="text-center">
                We sent a verification code to{"\n"}
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
                    width: 48,
                    height: 56,
                    borderWidth: 2,
                    borderColor: digit ? Colors.primary[500] : Colors.grey[200],
                    borderRadius: 12,
                    textAlign: "center",
                    fontSize: 22,
                    fontFamily: "BricolageGrotesque_700Bold",
                    color: Colors.grey[900],
                    backgroundColor: digit ? Colors.primary[50] : Colors.white,
                  }}
                />
              ))}
            </View>

            <Button
              variant="primary"
              size="lg"
              label={loading ? "Verifying..." : "Verify Code"}
              fullWidth
              onPress={handleVerifyOtp}
            />

            <View className="items-center mt-6">
              {countdown > 0 ? (
                <Text variant="body" color="muted">
                  Resend code in{" "}
                  <Text variant="bodyMedium" className="text-grey-900 font-semibold">
                    {formatTime(countdown)}
                  </Text>
                </Text>
              ) : (
                <Pressable onPress={handleResend}>
                  <Text variant="body" color="muted">
                    Didn't receive the code?{" "}
                    <Text variant="bodyMedium" color="primary" className="font-semibold">
                      Resend
                    </Text>
                  </Text>
                </Pressable>
              )}
            </View>
          </>
        ) : (
          <>
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
                Create new password
              </Text>
              <Text variant="body" color="muted" className="text-center">
                Your new password must be different{"\n"}from your previous password
              </Text>
            </View>

            <View className="gap-4 mb-6">
              <Input
                label="New Password"
                placeholder="Enter new password"
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
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
              <Input
                label="Confirm Password"
                placeholder="Confirm new password"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                leftIcon={<Ionicons name="lock-closed-outline" size={18} color={Colors.grey[400]} />}
              />
            </View>

            <Button
              variant="primary"
              size="lg"
              label={loading ? "Resetting..." : "Reset Password"}
              fullWidth
              onPress={handleResetPassword}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}
