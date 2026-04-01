import { useEffect, useRef, useState } from "react";
import { View, Animated, Easing } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";

export default function CompleteScreen() {
  const { updateProfile } = useAuth();
  const [done, setDone] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  // Spin animation for loading
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Complete onboarding and navigate
  useEffect(() => {
    const setup = async () => {
      await updateProfile({ onboarding_completed: true });
      // Brief delay so the user sees the success state
      await new Promise((r) => setTimeout(r, 800));
      setDone(true);
    };
    setup();
  }, []);

  // Success animation then navigate
  useEffect(() => {
    if (!done) return;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => router.replace("/(tabs)"), 600);
    });
  }, [done]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      {!done ? (
        <View className="items-center gap-6">
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name="sync-outline" size={56} color={Colors.primary[500]} />
          </Animated.View>
          <View className="items-center gap-2">
            <Text
              className="text-grey-900 text-center"
              style={{
                fontFamily: "BricolageGrotesque_700Bold",
                fontSize: 24,
                lineHeight: 32,
              }}
            >
              Setting up your profile
            </Text>
            <Text variant="body" color="muted" className="text-center">
              We're personalizing your experience...
            </Text>
          </View>
        </View>
      ) : (
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
          className="items-center gap-6"
        >
          <View
            className="w-28 h-28 rounded-full items-center justify-center"
            style={{ backgroundColor: Colors.success.DEFAULT }}
          >
            <Ionicons name="checkmark" size={56} color="#fff" />
          </View>
          <View className="items-center gap-2">
            <Text
              className="text-grey-900 text-center"
              style={{
                fontFamily: "BricolageGrotesque_700Bold",
                fontSize: 24,
                lineHeight: 32,
              }}
            >
              You're all set!
            </Text>
            <Text variant="body" color="muted" className="text-center">
              Welcome to HOMii
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
