import { View, ScrollView, Pressable, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "Welcome to HOMii. By accessing or using our application, you agree to be bound by these Terms and Conditions. Our service provides a platform to help international students set up essential services in the UK. If you disagree with any part of these terms, you may not access the service.",
  },
  {
    title: "2. User Responsibilities",
    body: "As a member of the HOMii community, you are responsible for maintaining the confidentiality of your account information. You agree to provide accurate, current, and complete information during the registration process.",
  },
  {
    title: "3. Privacy Policy",
    body: "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and share your personal information. By using HOMii, you consent to our collection and use of personal data as outlined in the Privacy Policy.",
  },
  {
    title: "4. Affiliate Disclosure",
    body: "Some links within HOMii may earn HOMii a commission at no extra cost to you. When you download or sign up for a partner service through HOMii, the affiliate network may pay HOMii a commission.",
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
  const insets = useSafeAreaInsets();
  const [agreed, setAgreed] = useState(false);

  const handleDecline = () => {
    Alert.alert(
      "Terms Required",
      "You must accept the terms to use HOMii.",
      [{ text: "OK" }]
    );
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 8 }}>
      {/* No back button — this is the first onboarding screen */}
      <View className="px-6 pt-4">
        <View className="items-center">
          <Ionicons name="document-text-outline" size={48} color={Colors.primary[400]} />
        </View>

        <View className="items-center gap-1 mt-4 mb-2">
          <Text
            className="text-center text-grey-900"
            style={{
              fontFamily: "BricolageGrotesque_700Bold",
              fontSize: 26,
              lineHeight: 34,
            }}
          >
            Terms & Conditions
          </Text>
          <Text variant="body" color="muted" className="text-center">
            Please review our terms carefully
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* Links to full documents */}
        <View className="flex-row justify-center gap-6 my-4">
          <Pressable onPress={() => {/* TODO: Link to Terms URL */}}>
            <Text variant="bodyMedium" color="primary" className="font-semibold underline">
              Terms of Service
            </Text>
          </Pressable>
          <Pressable onPress={() => {/* TODO: Link to Privacy URL */}}>
            <Text variant="bodyMedium" color="primary" className="font-semibold underline">
              Privacy Policy
            </Text>
          </Pressable>
        </View>

        {/* Terms card */}
        <View className="border border-grey-200 rounded-2xl p-5 gap-5">
          {SECTIONS.map((s) => (
            <View key={s.title} className="gap-2">
              <Text variant="bodyMedium" className="font-semibold text-grey-900">
                {s.title}
              </Text>
              <Text variant="body" color="muted" className="leading-relaxed">
                {s.body}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Agreement + Buttons */}
      <View className="px-6 pt-3 gap-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <Pressable
          onPress={() => setAgreed(!agreed)}
          className="flex-row items-start gap-3"
        >
          <Ionicons
            name={agreed ? "checkbox" : "square-outline"}
            size={22}
            color={agreed ? Colors.primary[500] : Colors.grey[400]}
            style={{ marginTop: 2 }}
          />
          <Text variant="caption" color="secondary" className="flex-1" style={{ lineHeight: 18 }}>
            I agree to the Terms of Service and Privacy Policy
          </Text>
        </Pressable>

        <Button
          variant="primary"
          size="lg"
          label="Accept and Continue"
          fullWidth
          disabled={!agreed}
          onPress={() => router.push("/(onboarding)/language")}
        />

        <Pressable onPress={handleDecline} className="items-center py-1">
          <Text variant="bodyMedium" color="muted">
            Decline
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
