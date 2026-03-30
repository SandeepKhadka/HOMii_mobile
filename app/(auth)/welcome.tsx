import { View, Pressable } from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* Top hero — London skyline with floating icons */}
      <View className="h-[55%] bg-primary-400 relative overflow-hidden">
        {/* Gradient overlay */}
        <View className="absolute inset-0 bg-primary-300 opacity-60" />

        {/* Floating category icons */}
        <View className="absolute top-16 left-6 w-12 h-12 rounded-full bg-white/20 items-center justify-center">
          <Ionicons name="card-outline" size={22} color="#fff" />
        </View>
        <View className="absolute top-14 right-8 w-12 h-12 rounded-full bg-white/20 items-center justify-center">
          <Ionicons name="car-outline" size={22} color="#fff" />
        </View>
        <View className="absolute top-28 left-14 w-10 h-10 rounded-full bg-white/15 items-center justify-center">
          <Ionicons name="chatbox-outline" size={18} color="#fff" />
        </View>
        <View className="absolute top-24 right-24 w-10 h-10 rounded-full bg-white/15 items-center justify-center">
          <Ionicons name="restaurant-outline" size={18} color="#fff" />
        </View>
        <View className="absolute top-36 left-28 w-11 h-11 rounded-full bg-white/20 items-center justify-center">
          <Ionicons name="phone-portrait-outline" size={20} color="#fff" />
        </View>

        {/* Logo */}
        <View className="flex-1 items-center justify-center pt-8">
          <Text variant="h2" color="inverse" className="font-heading text-4xl tracking-tight">
            HOMii
          </Text>
        </View>
      </View>

      {/* Bottom card — slides up */}
      <View className="flex-1 bg-white rounded-t-3xl -mt-8 px-8 pt-10 pb-8 justify-between">
        <View className="items-center gap-3">
          <Text variant="h1" className="text-center font-heading text-[37px] leading-[45px] tracking-tight text-grey-900">
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
            onPress={() => router.push("/(auth)/sign-in")}
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
