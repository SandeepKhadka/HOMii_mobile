import { View, Pressable, ImageBackground } from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { useTranslation } from "react-i18next";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithGoogle } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation();

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) showAlert(t("common.googleSignInFailed"), error, undefined, "error");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top hero — London skyline background image */}
      <ImageBackground
        source={require("@/assets/images/onboarding.png")}
        className="h-[58%]"
        resizeMode="cover"
      >
        {/* Logo */}
        <View className="items-center" style={{ marginTop: insets.top + 60 }}>
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
      <View className="flex-1 bg-white rounded-t-3xl -mt-8 px-8 pt-10 justify-between" style={{ paddingBottom: insets.bottom + 16 }}>
        <View className="items-center gap-3">
          <Text
            className="text-center text-grey-900"
            style={{
              fontFamily: "BricolageGrotesque_700Bold",
              fontSize: 37,
              lineHeight: 45,
              letterSpacing: -0.8,
            }}
          >
            {t("auth.welcome.hero")}
          </Text>
          <Text variant="body" color="muted" className="text-center">
            {t("auth.welcome.subtitle")}
          </Text>
        </View>

        <View className="gap-3">
          <Button
            variant="primary"
            size="lg"
            label={t("auth.welcome.createAccount")}
            fullWidth
            onPress={() => router.push("/(auth)/sign-up")}
          />
          <Pressable
            onPress={handleGoogle}
            className="flex-row items-center justify-center gap-3 border border-grey-200 rounded-2xl py-3.5"
          >
            <Ionicons name="logo-google" size={20} color={Colors.grey[700]} />
            <Text variant="bodyMedium" className="text-grey-700 font-semibold">
              {t("common.continueWithGoogle")}
            </Text>
          </Pressable>
          <View className="flex-row justify-center gap-1 mt-1">
            <Text variant="body" color="muted">
              {t("auth.welcome.hasAccount")}
            </Text>
            <Pressable onPress={() => router.push("/(auth)/sign-in")}>
              <Text variant="bodyMedium" color="primary" className="uppercase font-semibold">
                {t("auth.welcome.login")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
