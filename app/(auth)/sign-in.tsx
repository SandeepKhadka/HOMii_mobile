import { useState } from "react";
import { View, Pressable, ImageBackground, ScrollView, Alert, Keyboard } from "react-native";
import { router } from "expo-router";
import { Text, Button, Input } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInScreen() {
  const { signIn, signInWithGoogle } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      Alert.alert("Sign In Failed", error);
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
        className="flex-1 bg-white rounded-t-3xl -mt-8 px-8 pt-8 justify-between"
        style={{ paddingBottom: insets.bottom + 24, minHeight: 400 }}
      >
        <View>
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
              Welcome back
            </Text>
            <Text variant="body" color="muted">
              Sign in to continue your journey
            </Text>
          </View>

          <View className="gap-4 mb-6">
            <Input
              label="Email"
              placeholder="your@university.ac.uk"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Ionicons name="mail-outline" size={18} color={Colors.grey[400]} />}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
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
            label={loading ? "Signing in..." : "Sign In"}
            fullWidth
            onPress={handleSignIn}
          />

          <Pressable
            onPress={async () => {
              const { error } = await signInWithGoogle();
              if (error) Alert.alert("Google Sign-In Failed", error);
            }}
            className="flex-row items-center justify-center gap-3 border border-grey-200 rounded-2xl py-3.5 mt-2"
          >
            <Ionicons name="logo-google" size={20} color={Colors.grey[700]} />
            <Text variant="bodyMedium" className="text-grey-700 font-semibold">
              Continue with Google
            </Text>
          </Pressable>
        </View>

        <View className="flex-row justify-center gap-1 mt-6">
          <Text variant="body" color="muted">Don&apos;t have an account?</Text>
          <Pressable onPress={() => router.replace("/(auth)/sign-up")}>
            <Text variant="bodyMedium" color="primary" className="font-semibold">
              Sign up
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
