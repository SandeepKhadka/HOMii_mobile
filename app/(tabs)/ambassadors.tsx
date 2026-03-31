import { View, Pressable } from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WHAT_YOU_DO = [
  "Share HOMii with students at your university",
  "Help new students discover essential services",
  "Promote useful tools like SIM, banking and more",
];

const WHAT_YOU_GET = [
  "Earn real money from referrals",
  "Track your performance in your dashboard",
  "Build experience for your CV",
];

export default function AmbassadorsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="flex-row items-center px-6 pb-4"
        style={{ backgroundColor: Colors.navy.DEFAULT, paddingTop: insets.top + 12 }}
      >
        <Text
          color="inverse"
          style={{
            fontFamily: "BricolageGrotesque_700Bold",
            fontSize: 20,
            lineHeight: 28,
          }}
        >
          Ambassador
        </Text>
      </View>

      <View className="flex-1 px-6 pt-6 gap-8">
        {/* Tagline */}
        <Text variant="body" color="muted" className="text-center">
          Earn 10% commission by helping{"\n"}students settle into UK life
        </Text>

        {/* What you'll do */}
        <View className="gap-3">
          <Text
            className="text-grey-900"
            style={{
              fontFamily: "BricolageGrotesque_700Bold",
              fontSize: 18,
              textAlign: "center",
            }}
          >
            What you'll do
          </Text>
          {WHAT_YOU_DO.map((item) => (
            <View key={item} className="flex-row items-start gap-3 px-2">
              <Ionicons name="checkmark-circle" size={20} color={Colors.teal.DEFAULT} style={{ marginTop: 2 }} />
              <Text variant="body" className="flex-1 text-grey-700">{item}</Text>
            </View>
          ))}
        </View>

        {/* What you'll get */}
        <View className="gap-3">
          <Text
            className="text-grey-900"
            style={{
              fontFamily: "BricolageGrotesque_700Bold",
              fontSize: 18,
              textAlign: "center",
            }}
          >
            What you'll get
          </Text>
          {WHAT_YOU_GET.map((item) => (
            <View key={item} className="flex-row items-start gap-3 px-2">
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary[500]} style={{ marginTop: 2 }} />
              <Text variant="body" className="flex-1 text-grey-700">{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA buttons */}
      <View className="px-6 gap-3" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button
          variant="primary"
          size="lg"
          label="Continue to Sign Up"
          fullWidth
          onPress={() => router.push("/ambassador/signup" as any)}
        />
        <Pressable
          onPress={() => router.push("/ambassador/dashboard" as any)}
          className="items-center py-2"
        >
          <Text variant="bodyMedium" color="primary" className="font-semibold">
            Already an ambassador? View Dashboard
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
