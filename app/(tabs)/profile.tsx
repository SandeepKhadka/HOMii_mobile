import { View } from "react-native";
import { Screen, Text } from "@/components/ui";

export default function ProfileScreen() {
  return (
    <Screen className="bg-background" edges={["top"]}>
      <View className="flex-1 items-center justify-center">
        <Text variant="h3" color="muted">Profile — coming soon</Text>
      </View>
    </Screen>
  );
}
