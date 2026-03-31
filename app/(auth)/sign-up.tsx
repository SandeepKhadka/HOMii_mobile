import { useState } from "react";
import { View, Pressable, ImageBackground, ScrollView, Alert, Keyboard } from "react-native";
import { router } from "expo-router";
import { Text, Button, Input } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      Alert.alert("Error", "Password must contain at least one uppercase letter");
      return;
    }
    if (!/[a-z]/.test(password)) {
      Alert.alert("Error", "Password must contain at least one lowercase letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      Alert.alert("Error", "Password must contain at least one number");
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      Alert.alert("Error", "Password must contain at least one special character");
      return;
    }
    setLoading(true);
    const { error, needsConfirmation } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      Alert.alert("Sign Up Failed", error);
    } else if (needsConfirmation) {
      router.push({ pathname: "/(auth)/verify-otp" as any, params: { email } });
    }
    // If no confirmation needed, auth state change handles navigation automatically
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
            value={fullName}
            onChangeText={setFullName}
            leftIcon={<Ionicons name="person-outline" size={18} color={Colors.grey[400]} />}
          />
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
            placeholder="Create a password"
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
          label={loading ? "Creating account..." : "Create Account"}
          fullWidth
          onPress={handleSignUp}
        />

        <View className="flex-row justify-center gap-1 mt-4">
          <Text variant="body" color="muted">Already have an account?</Text>
          <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
            <Text variant="bodyMedium" color="primary" className="font-semibold">
              Sign in
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
