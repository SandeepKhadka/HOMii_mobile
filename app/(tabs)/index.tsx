import { useState, useCallback } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/constants/categories";

const ESSENTIAL_APPS = [
  { id: "food",         title: "Food",           icon: "restaurant-outline" as const, color: "#FEF3C7", iconColor: "#F97316" },
  { id: "transport",    title: "Transport",       icon: "bus-outline"        as const, color: "#DBEAFE", iconColor: "#1E293B" },
  { id: "university",   title: "University",      icon: "school-outline"     as const, color: "#E5E7EB", iconColor: "#6B7280" },
  { id: "discounts",    title: "Discounts",       icon: "pricetag-outline"   as const, color: "#FFE4E6", iconColor: "#F43F5E" },
  { id: "flights",      title: "Flights",         icon: "airplane-outline"   as const, color: "#E0E7FF", iconColor: "#6366F1" },
  { id: "socialEvents", title: "Social Events",   icon: "calendar-outline"   as const, color: "#FFE4E6", iconColor: "#F472B6" },
];

// Total checklist items across all categories
const TOTAL_ITEMS = CATEGORIES.reduce((sum, cat) => sum + cat.checklistItems.length, 0);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const [completedTotal, setCompletedTotal] = useState(0);

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

  // Refetch every time tab is focused (in case user completed items)
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
      <View className="bg-primary-400 pb-8 px-6 rounded-b-3xl" style={{ paddingTop: insets.top + 12 }}>
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
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 -mt-4">
        {/* Setup progress — clickable card */}
        <Pressable
          onPress={() => router.push("/(tabs)/setup" as any)}
          className="mx-6 mt-6 mb-4 bg-white rounded-2xl px-5 py-5"
          style={{
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }}
        >
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="rocket-outline" size={20} color={Colors.primary[500]} />
              <Text
                className="text-grey-900"
                style={{
                  fontFamily: "BricolageGrotesque_600SemiBold",
                  fontSize: 15,
                }}
              >
                Setup Progress
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text
                style={{
                  fontFamily: "BricolageGrotesque_700Bold",
                  fontSize: 15,
                  color: Colors.primary[500],
                }}
              >
                {progressPercent}%
              </Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary[500]} />
            </View>
          </View>
          <View className="h-3 bg-grey-100 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: progressPercent === 100 ? Colors.success.DEFAULT : Colors.primary[500],
              }}
            />
          </View>
          <Text variant="caption" color="muted" className="mt-2">
            {completedTotal}/{TOTAL_ITEMS} tasks completed
          </Text>
        </Pressable>

        {/* Essential Apps */}
        <View className="px-6 mt-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text variant="h3" className="font-heading text-grey-900">
              ESSENTIAL APPS
            </Text>
            <Pressable>
              <Text variant="bodyMedium" color="muted">Explore All</Text>
            </Pressable>
          </View>

          <View className="flex-row flex-wrap gap-4">
            {ESSENTIAL_APPS.map((app) => (
              <Pressable
                key={app.id}
                className="w-[47%] bg-white rounded-2xl overflow-hidden shadow-card"
                onPress={() => router.push(`/category/${app.id}` as any)}
              >
                <View
                  className="h-24 items-center justify-center"
                  style={{ backgroundColor: app.color }}
                >
                  <Ionicons name={app.icon} size={28} color={app.iconColor} />
                </View>
                <View className="p-3">
                  <Text variant="bodyMedium" className="text-grey-800">{app.title}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Explore UK banner */}
        <View className="mx-6 mt-6 mb-8 bg-primary-400 rounded-2xl p-6">
          <Text variant="h3" color="inverse" className="font-heading">
            Explore UK
          </Text>
          <Text variant="body" color="inverse" className="opacity-80 mt-1">
            Discover top local locations
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
