import { View, Pressable, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { Text, Button, Input } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Top hero — same background as welcome */}
      <ImageBackground
        source={require("@/assets/images/onboarding.png")}
        className="h-[35%]"
        resizeMode="cover"
      >
        {/* Back button */}
        <View className="px-4" style={{ paddingTop: insets.top + 8 }}>
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
        </View>

        {/* Logo */}
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

      {/* Bottom card — slides up over the image */}
      <View
        className="flex-1 bg-white rounded-t-3xl -mt-8 px-8 pt-8"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
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
              Create account
            </Text>
            <Text variant="body" color="muted">
              Join thousands of international students
            </Text>
          </View>

          <View className="gap-4 mb-6">
            <Input
              label="Full Name"
              placeholder="Your full name"
              autoCapitalize="words"
              autoComplete="name"
              leftIcon={<Ionicons name="person-outline" size={18} color={Colors.grey[400]} />}
            />
            <Input
              label="Email"
              placeholder="your@university.ac.uk"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              leftIcon={<Ionicons name="mail-outline" size={18} color={Colors.grey[400]} />}
            />
            <Input
              label="Password"
              placeholder="Create a password"
              secureTextEntry
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={Colors.grey[400]} />}
            />
          </View>

          <Button
            variant="primary"
            size="lg"
            label="Create Account"
            fullWidth
            onPress={() => {
              // TODO: Supabase sign-up
              router.replace("/(onboarding)/language");
            }}
          />

          <View className="flex-row justify-center gap-1 mt-4 mb-4">
            <Text variant="body" color="muted">Already have an account?</Text>
            <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
              <Text variant="bodyMedium" color="primary" className="font-semibold">
                Sign in
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
