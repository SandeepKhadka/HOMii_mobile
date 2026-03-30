import { View, Pressable, ImageBackground } from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      {/* Top hero — London skyline background image */}
      <ImageBackground
        source={require("@/assets/images/onboarding.png")}
        className="h-[58%]"
        resizeMode="cover"
      >
        {/* Logo — positioned to match Figma (top: 98px from screen top) */}
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

      {/* Bottom card — slides up over the image */}
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
            Set up your UK{"\n"}life in minutes
          </Text>
          <Text variant="body" color="muted" className="text-center">
            The ultimate landing guide for international{"\n"}students.
          </Text>
        </View>

        <View className="gap-4">
          <Button
            variant="primary"
            size="lg"
            label="Create account"
            fullWidth
            onPress={() => router.push("/(auth)/sign-up")}
          />
          <View className="flex-row justify-center gap-1">
            <Text variant="body" color="muted">
              Already have an account?
            </Text>
            <Pressable onPress={() => router.push("/(auth)/sign-in")}>
              <Text variant="bodyMedium" color="primary" className="uppercase font-semibold">
                LOGIN
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
