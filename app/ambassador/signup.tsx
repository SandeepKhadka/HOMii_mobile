import { useState } from "react";
import { View, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { router } from "expo-router";
import { Text, Button, Input } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export default function AmbassadorSignupScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const [studentEmail, setStudentEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [course, setCourse] = useState("");
  const [motivation, setMotivation] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!studentEmail || !confirmEmail || !course) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (studentEmail !== confirmEmail) {
      Alert.alert("Error", "Email addresses do not match");
      return;
    }
    if (!agreed) {
      Alert.alert("Error", "Please accept the terms to continue");
      return;
    }
    if (!user) {
      Alert.alert("Error", "You must be signed in");
      return;
    }

    setLoading(true);
    try {
      await api.applyAmbassador({ studentEmail, course, motivation: motivation || undefined });
      Alert.alert("Success", "Your application has been submitted!", [
        { text: "OK", onPress: () => router.replace("/ambassador/dashboard" as any) },
      ]);
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="flex-row items-center px-4 pb-4"
        style={{ backgroundColor: Colors.teal.DEFAULT, paddingTop: insets.top + 12 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text
          color="inverse"
          style={{
            fontFamily: "BricolageGrotesque_700Bold",
            fontSize: 20,
            lineHeight: 28,
            marginLeft: 8,
          }}
        >
          Ambassador signup
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title section */}
          <View className="items-center px-8 pt-8 pb-6">
            <Text
              className="text-grey-900 text-center"
              style={{
                fontFamily: "BricolageGrotesque_700Bold",
                fontSize: 26,
                lineHeight: 34,
                letterSpacing: -0.5,
              }}
            >
              Become a HOMii{"\n"}Ambassador
            </Text>
            <Text variant="body" color="muted" className="text-center mt-2">
              Share HOMii with your friends and earn{"\n"}commissions.
            </Text>
          </View>

          {/* Form */}
          <View className="px-6 gap-1">
            <Text
              className="text-grey-900 mb-4"
              style={{
                fontFamily: "BricolageGrotesque_600SemiBold",
                fontSize: 16,
              }}
            >
              Tell us a bit more
            </Text>

            <View className="gap-4">
              <Input
                label="Student Mail"
                placeholder="your@university.ac.uk"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={studentEmail}
                onChangeText={setStudentEmail}
              />
              <Input
                label="Confirm Email"
                placeholder="Confirm your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={confirmEmail}
                onChangeText={setConfirmEmail}
              />
              <Input
                label="Course"
                placeholder="e.g. BIT, Computer Science"
                autoCapitalize="words"
                value={course}
                onChangeText={setCourse}
              />
              <View className="gap-1.5">
                <Text variant="captionMedium" color="secondary">
                  Why do you want to be the ambassador?
                </Text>
                <View className="border border-grey-200 rounded-xl px-4 py-3 min-h-[100]">
                  <Input
                    placeholder="Tell us why you'd be great..."
                    multiline
                    numberOfLines={4}
                    className="border-0 p-0"
                    inputClassName="min-h-[80]"
                    style={{ borderWidth: 0, padding: 0 }}
                    value={motivation}
                    onChangeText={setMotivation}
                  />
                </View>
              </View>
            </View>

            {/* Agreement checkbox */}
            <Pressable
              onPress={() => setAgreed(!agreed)}
              className="flex-row items-start gap-3 mt-6 bg-grey-50 rounded-xl px-4 py-4"
            >
              <View
                className="w-6 h-6 rounded items-center justify-center mt-0.5"
                style={{
                  backgroundColor: agreed ? Colors.navy.DEFAULT : "transparent",
                  borderWidth: agreed ? 0 : 2,
                  borderColor: Colors.grey[300],
                }}
              >
                {agreed && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text variant="caption" className="flex-1 text-grey-600" style={{ lineHeight: 18 }}>
                I understand my application is being reviewed and I'll be notified once approved.
              </Text>
            </Pressable>

            {/* Submit button */}
            <View className="mt-6">
              <Button
                variant="primary"
                size="lg"
                label={loading ? "Submitting..." : "SIGN UP"}
                fullWidth
                onPress={handleSubmit}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
