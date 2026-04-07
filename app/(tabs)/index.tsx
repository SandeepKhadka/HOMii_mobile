import { useState, useCallback } from "react";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { supabase } from "@/lib/supabase";
import GradientHeader, { HEADER_GRADIENTS, lightenHex } from "@/components/GradientHeader";


export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();
  const [completedTotal, setCompletedTotal] = useState(0);

  const TOTAL_ITEMS = categories.reduce((sum, cat) => sum + cat.checklistItems.length, 0);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("onboarding_progress")
      .select("completed_items")
      .eq("user_id", user.id);
    if (data) {
      const total = data.reduce((sum: number, row: any) => {
        return sum + (row.completed_items?.length || 0);
      }, 0);
      setCompletedTotal(total);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchProgress();
    }, [fetchProgress])
  );

  const progressPercent = TOTAL_ITEMS > 0 ? Math.round((completedTotal / TOTAL_ITEMS) * 100) : 0;
  const firstName = profile?.full_name?.split(" ")[0] || "Student";

  return (
    <View className="flex-1 bg-background">
      {/* Hero header */}
      <GradientHeader colors={HEADER_GRADIENTS.home} style={{ paddingTop: insets.top + 12, paddingBottom: 32, paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View className="flex-row justify-between items-center">
          <Text variant="h3" color="inverse" className="font-heading">
            HOMii
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/profile" as any)}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Ionicons name="person-outline" size={20} color="#fff" />
          </Pressable>
        </View>
        <Text variant="subtitle" color="inverse" className="mt-1 opacity-90">
          Hello, {firstName}
        </Text>
        {profile?.university ? (
          <Text variant="caption" color="inverse" className="opacity-70 mt-0.5">
            {profile.university} · Starter Pack
          </Text>
        ) : null}
      </GradientHeader>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 -mt-4">
        {/* Setup progress / Continue Setup banner */}
        <Pressable
          onPress={() => router.push("/(tabs)/setup" as any)}
          className="mx-6 mt-6 mb-4 rounded-2xl px-5 py-5"
          style={{
            backgroundColor: progressPercent === 100 ? "#F0FDF4" : Colors.primary[500],
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
        >
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center gap-2">
              <Ionicons
                name={progressPercent === 100 ? "checkmark-circle" : "rocket-outline"}
                size={20}
                color={progressPercent === 100 ? Colors.success.DEFAULT : "#fff"}
              />
              <Text
                style={{
                  fontFamily: "BricolageGrotesque_600SemiBold",
                  fontSize: 15,
                  color: progressPercent === 100 ? Colors.success.DEFAULT : "#fff",
                }}
              >
                {progressPercent === 100 ? "All set up!" : "Continue Setup"}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text
                style={{
                  fontFamily: "BricolageGrotesque_700Bold",
                  fontSize: 15,
                  color: progressPercent === 100 ? Colors.success.DEFAULT : "#fff",
                }}
              >
                {progressPercent}%
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={progressPercent === 100 ? Colors.success.DEFAULT : "#fff"}
              />
            </View>
          </View>
          <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: progressPercent === 100 ? Colors.success.light : "rgba(255,255,255,0.3)" }}>
            <View
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: progressPercent === 100 ? Colors.success.DEFAULT : "#fff",
              }}
            />
          </View>
          <Text
            variant="caption"
            className="mt-2"
            style={{ color: progressPercent === 100 ? Colors.success.DEFAULT : "rgba(255,255,255,0.8)" }}
          >
            {completedTotal}/{TOTAL_ITEMS} tasks completed
          </Text>
        </Pressable>

        {/* Essential Apps — dynamic from API */}
        <View className="px-6 mt-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text variant="h3" className="font-heading text-grey-900">
              ESSENTIAL APPS
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/apps" as any)}>
              <Text variant="bodyMedium" color="muted">Explore All</Text>
            </Pressable>
          </View>

          {categoriesLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="small" color={Colors.primary[500]} />
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-4">
              {categories.slice(0, 6).map((cat) => {
                const gradientEnd = lightenHex(cat.color, 0.6);
                return (
                  <Pressable
                    key={cat.id}
                    className="w-[47%] bg-white rounded-2xl overflow-hidden shadow-card"
                    onPress={() => router.push(`/category/${cat.id}` as any)}
                  >
                    <LinearGradient
                      colors={[cat.color, gradientEnd]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ height: 96, alignItems: "center", justifyContent: "center" }}
                    >
                      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.85)", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name={(cat.icon || "apps-outline") as any} size={26} color={cat.color} />
                      </View>
                    </LinearGradient>
                    <View className="p-3">
                      <Text variant="bodyMedium" className="text-grey-800">{cat.title}</Text>
                      {cat.apps.length > 0 && (
                        <Text variant="caption" color="muted">{cat.apps.length} app{cat.apps.length !== 1 ? "s" : ""}</Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Refer a Friend CTA */}
        <Pressable
          className="mx-6 mt-6 mb-8 rounded-2xl p-6 flex-row items-center gap-4"
          style={{ backgroundColor: Colors.navy.DEFAULT }}
          onPress={() => router.push("/(tabs)/ambassadors" as any)}
        >
          <View className="w-12 h-12 rounded-xl bg-white/15 items-center justify-center">
            <Ionicons name="gift-outline" size={24} color="#fff" />
          </View>
          <View className="flex-1">
            <Text
              color="inverse"
              style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 16, lineHeight: 22 }}
            >
              Refer Friends Coming to the UK
            </Text>
            <Text variant="caption" color="inverse" className="opacity-70 mt-0.5">
              Earn 10% commission on every referral
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
        </Pressable>
      </ScrollView>
    </View>
  );
}
