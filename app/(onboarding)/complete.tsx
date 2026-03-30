import { View, Pressable } from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

export default function CompleteScreen() {
  return (
    <View className="flex-1 bg-primary-50">
      {/* Back + Title pill */}
      <View className="flex-row items-center px-4 pt-14">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
        </Pressable>
        <View className="flex-1 items-center">
          <View className="bg-white px-8 py-3 rounded-full shadow-card">
            <Text variant="h4" className="font-heading text-grey-900">
              You are all set!
            </Text>
          </View>
        </View>
        <View className="w-10" />
      </View>

      {/* Center icon */}
      <View className="flex-1 items-center justify-center gap-6">
        {/* Decorative icons */}
        <View className="absolute top-20 left-12">
          <Ionicons name="airplane" size={24} color={Colors.grey[700]} />
        </View>
        <View className="absolute top-32 left-10">
          <Ionicons name="location" size={24} color={Colors.grey[700]} />
        </View>

        {/* Big circle icon */}
        <View className="w-32 h-32 rounded-full bg-primary-400 items-center justify-center shadow-card-md">
          <Ionicons name="send" size={48} color="#fff" />
        </View>
      </View>

      {/* Bottom */}
      <View className="px-6 pb-10 gap-4">
        <View className="border-t border-grey-200 pt-4 items-center">
          <Text variant="body" color="muted">Share this app with your friends</Text>
        </View>

        <Button
          variant="primary"
          size="lg"
          label="Continue to Home"
          fullWidth
          onPress={() => router.replace("/(tabs)")}
        />
      </View>
    </View>
  );
}
