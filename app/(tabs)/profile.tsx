import { View, Alert } from "react-native";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import GradientHeader, { HEADER_GRADIENTS } from "@/components/GradientHeader";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <GradientHeader
        colors={HEADER_GRADIENTS.profile}
        style={{ paddingTop: insets.top + 16, paddingBottom: 32, paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, alignItems: "center" }}
      >
        <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-3">
          <Ionicons name="person" size={36} color="#fff" />
        </View>
        <Text
          color="inverse"
          style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 22, lineHeight: 28 }}
        >
          {profile?.full_name || "Student"}
        </Text>
        <Text variant="body" color="inverse" className="opacity-80 mt-1">
          {profile?.email || ""}
        </Text>
      </GradientHeader>

      <View className="flex-1 px-6 pt-6 justify-between" style={{ paddingBottom: insets.bottom + 16 }}>
        <View className="gap-4">
          <Text variant="caption" color="muted" className="tracking-widest">
            ACCOUNT
          </Text>
          <View className="bg-white rounded-2xl overflow-hidden">
            <View className="flex-row items-center px-4 py-4 border-b border-grey-100">
              <Ionicons name="person-outline" size={20} color={Colors.grey[500]} />
              <Text variant="body" className="text-grey-800 ml-3 flex-1">Edit Profile</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.grey[400]} />
            </View>
            <View className="flex-row items-center px-4 py-4 border-b border-grey-100">
              <Ionicons name="school-outline" size={20} color={Colors.grey[500]} />
              <Text variant="body" className="text-grey-800 ml-3 flex-1">University</Text>
              <Text variant="caption" color="muted">{profile?.university || "Not set"}</Text>
            </View>
            <View className="flex-row items-center px-4 py-4">
              <Ionicons name="language-outline" size={20} color={Colors.grey[500]} />
              <Text variant="body" className="text-grey-800 ml-3 flex-1">Language</Text>
              <Text variant="caption" color="muted">{profile?.language || "en"}</Text>
            </View>
          </View>
        </View>

        <Button
          variant="ghost"
          size="lg"
          label="Log Out"
          fullWidth
          leftIcon={<Ionicons name="log-out-outline" size={20} color={Colors.error.DEFAULT} />}
          onPress={handleLogout}
          className="border border-error rounded-2xl"
        />
      </View>
    </View>
  );
}
