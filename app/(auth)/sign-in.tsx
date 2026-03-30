import { View } from "react-native";
import { router } from "expo-router";
import { Screen, Text, Button, Input } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

export default function SignInScreen() {
  return (
    <Screen scrollable keyboardAvoiding className="bg-white" edges={["top", "bottom"]}>
      {/* Back button */}
      <View className="px-6 pt-4">
        <Button
          variant="ghost"
          size="sm"
          label="Back"
          leftIcon={<Ionicons name="arrow-back" size={18} color={Colors.grey[700]} />}
          onPress={() => router.back()}
          className="self-start"
        />
      </View>

      {/* Form */}
      <View className="flex-1 px-6 pt-8 gap-6">
        <View className="gap-1">
          <Text variant="h3" className="text-grey-900">Sign in</Text>
          <Text variant="body" color="muted">Enter your university email to continue</Text>
        </View>

        <View className="gap-4">
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
            placeholder="Enter your password"
            secureTextEntry
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color={Colors.grey[400]} />}
          />
        </View>

        <Button
          variant="primary"
          size="lg"
          label="Sign In"
          fullWidth
          onPress={() => {
            // TODO: Supabase email auth → route to onboarding or tabs
            router.replace("/(onboarding)/language");
          }}
        />

        <View className="flex-row justify-center gap-1">
          <Text variant="body" color="muted">Don't have an account?</Text>
          <Text
            variant="bodyMedium"
            color="primary"
            onPress={() => {/* TODO: sign-up screen */}}
          >
            Sign up
          </Text>
        </View>
      </View>
    </Screen>
  );
}
