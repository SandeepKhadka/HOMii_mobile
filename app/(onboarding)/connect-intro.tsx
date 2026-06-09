import { View, Pressable, ImageBackground } from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

// Intro screen surfaced after onboarding completes. Tells the user about
// Connect (find other students at your uni) and lets them either jump
// straight in or skip to home. Without this, Luke's review flagged that
// users never discover Connect.
export default function ConnectIntroScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const goHome = () => router.replace("/(tabs)" as any);
  const goConnect = () => router.replace("/(tabs)/connect" as any);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
      <ImageBackground
        source={require("@/assets/images/top-banner.jpeg")}
        style={{ height: 220 }}
        resizeMode="cover"
        imageStyle={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <View className="flex-1 items-center justify-end pb-6">
          <View
            className="w-20 h-20 rounded-full bg-white items-center justify-center"
            style={{ elevation: 4, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
          >
            <Ionicons name="people" size={40} color={Colors.primary[500]} />
          </View>
        </View>
      </ImageBackground>

      <View className="flex-1 px-8 pt-8 justify-between" style={{ paddingBottom: insets.bottom + 16 }}>
        <View className="gap-3">
          <Text
            className="text-center text-grey-900"
            style={{
              fontFamily: "BricolageGrotesque_700Bold",
              fontSize: 26,
              lineHeight: 34,
              letterSpacing: -0.4,
            }}
          >
            {t("onboarding.connectIntro.title")}
          </Text>
          <Text variant="body" color="muted" className="text-center" style={{ lineHeight: 22 }}>
            {t("onboarding.connectIntro.subtitle")}
          </Text>

          <View className="gap-3 mt-6">
            <BulletRow icon="school-outline" text={t("onboarding.connectIntro.bullet1")} />
            <BulletRow icon="globe-outline" text={t("onboarding.connectIntro.bullet2")} />
            <BulletRow icon="logo-instagram" text={t("onboarding.connectIntro.bullet3")} />
          </View>
        </View>

        <View className="gap-3">
          <Button
            variant="primary"
            size="lg"
            label={t("onboarding.connectIntro.setUp")}
            fullWidth
            onPress={goConnect}
          />
          <Pressable onPress={goHome} className="py-3">
            <Text variant="bodyMedium" color="muted" className="text-center font-semibold">
              {t("onboarding.connectIntro.skip")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function BulletRow({ icon, text }: { icon: any; text: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="w-9 h-9 rounded-full bg-primary-100 items-center justify-center">
        <Ionicons name={icon} size={18} color={Colors.primary[600]} />
      </View>
      <Text variant="body" className="text-grey-800 flex-1">{text}</Text>
    </View>
  );
}
