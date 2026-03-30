import { View } from "react-native";
import { router } from "expo-router";
import { Screen, Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";

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
  return (
    <Screen scrollable className="bg-white" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="bg-navy px-6 py-5">
        <Text variant="h3" color="inverse" className="font-heading">
          Ambassador
        </Text>
      </View>

      <View className="flex-1 px-6 pt-6 gap-8">
        {/* Tagline */}
        <Text variant="body" color="muted" className="text-center">
          Earn 10% commission by helping{"\n"}students settle into UK life
        </Text>

        {/* What you'll do */}
        <View className="gap-4">
          <Text variant="h3" className="text-center font-heading">
            What you'll do
          </Text>
          {WHAT_YOU_DO.map((item) => (
            <Text key={item} variant="body" className="text-grey-800">
              {item}
            </Text>
          ))}
        </View>

        {/* What you'll get */}
        <View className="gap-4">
          <Text variant="h3" className="text-center font-heading">
            What you'll get
          </Text>
          {WHAT_YOU_GET.map((item) => (
            <Text key={item} variant="body" className="text-grey-800">
              {item}
            </Text>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View className="px-6 pb-8 pt-4">
        <Button
          variant="primary"
          size="lg"
          label="Continue to Sign Up"
          fullWidth
          onPress={() => {
            // TODO: navigate to ambassador signup
          }}
        />
      </View>
    </Screen>
  );
}
