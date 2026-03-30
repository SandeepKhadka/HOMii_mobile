import { View, Pressable, ImageBackground } from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CompleteScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require("@/assets/images/complete-bg.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1" style={{ backgroundColor: "rgba(255,255,255,0.3)", paddingTop: insets.top + 8 }}>
        {/* Header */}
        <View className="flex-row items-center px-4">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
          </Pressable>
          <View className="flex-1 items-center">
            <View
              className="bg-white px-8 py-3 rounded-full"
              style={{
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}
            >
              <Text variant="h4" className="font-heading text-grey-900 text-center">
                You are all set!
              </Text>
            </View>
          </View>
          <View className="w-10" />
        </View>

        {/* Center content */}
        <View className="flex-1 items-center justify-center">
          {/* Big circle icon */}
          <View
            className="w-36 h-36 rounded-full items-center justify-center"
            style={{
              backgroundColor: Colors.primary[400],
              elevation: 8,
              shadowColor: Colors.primary[500],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            }}
          >
            <Ionicons name="send" size={52} color="#fff" />
          </View>
        </View>

        {/* Bottom section */}
        <View className="px-6 gap-4" style={{ paddingBottom: insets.bottom + 24 }}>
          <View className="border-t border-grey-200 pt-4 items-center">
            <Text variant="body" color="muted">
              Share this app with your friends
            </Text>
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
    </ImageBackground>
  );
}
