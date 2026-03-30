import { View, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Screen, Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "Welcome to HOMii. By accessing or using our application, you agree to be bound by these Terms and Conditions. Our service provides a platform for community management and shared living experiences. If you disagree with any part of these terms, you may not access the service.",
  },
  {
    title: "2. User Responsibilities",
    body: "As a member of the HOMii community, you are responsible for maintaining the confidentiality of your account information. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate.",
  },
  {
    title: "3. Privacy Policy",
    body: "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and share your personal information. By using HOMii, you consent to our collection and use of personal data as outlined in the Privacy Policy.",
  },
  {
    title: "4. Prohibited Conduct",
    body: "You agree not to engage in any of the following prohibited activities: copying, distributing, or disclosing any part of the service in any medium; using any automated system to access the service; or attempting to interfere with the servers or networks connected to the service.",
  },
  {
    title: "5. Termination",
    body: "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.",
  },
  {
    title: "6. Modifications",
    body: "We reserve the right to modify or replace these terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. Continued use of the service after modifications constitutes acceptance.",
  },
];

export default function TermsScreen() {
  const [agreed, setAgreed] = useState(false);

  return (
    <Screen className="bg-white" edges={["top", "bottom"]}>
      {/* Back */}
      <View className="px-4 pt-2">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
        {/* Icon */}
        <View className="items-center pt-2">
          <Ionicons name="document-text-outline" size={48} color={Colors.primary[400]} />
        </View>

        {/* Title */}
        <View className="items-center gap-1 mt-4 mb-2">
          <Text variant="h2" className="text-center font-heading text-grey-900">
            Terms & Conditions
          </Text>
          <Text variant="body" color="muted" className="text-center">
            By using this app, you agree to our{"\n"}terms and conditions.
          </Text>
        </View>

        {/* Legal heading */}
        <View className="mt-4 mb-1">
          <Text variant="h4" className="font-heading text-grey-900">Legal Agreement</Text>
          <Text variant="body" color="muted" className="mt-1">
            Please review our terms carefully before continuing.
          </Text>
        </View>

        {/* Terms card */}
        <View className="border border-primary-200 rounded-2xl p-5 mt-4 mb-6 gap-6">
          {SECTIONS.map((s) => (
            <View key={s.title} className="gap-2">
              <Text variant="bodyMedium" color="primary" className="font-semibold">
                {s.title}
              </Text>
              <Text variant="body" color="secondary" className="leading-relaxed">
                {s.body}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Agreement + Continue */}
      <View className="px-6 pb-6 pt-3 gap-4">
        <Pressable
          onPress={() => setAgreed(!agreed)}
          className="flex-row items-center gap-3"
        >
          <Ionicons
            name={agreed ? "checkbox" : "square-outline"}
            size={22}
            color={agreed ? Colors.primary[500] : Colors.grey[400]}
          />
          <Text variant="caption" color="secondary" className="flex-1">
            I have read and agree to the Terms & Conditions and Privacy Policy
          </Text>
        </Pressable>

        <Button
          variant="primary"
          size="lg"
          label="Continue"
          fullWidth
          disabled={!agreed}
          onPress={() => router.push("/(onboarding)/checklist-intro")}
        />

        <Text variant="caption" color="muted" className="text-center">
          Last updated: October 2023
        </Text>
      </View>
    </Screen>
  );
}
