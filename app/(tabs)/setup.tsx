import { useState, useCallback } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { supabase } from "@/lib/supabase";
import GradientHeader, { HEADER_GRADIENTS } from "@/components/GradientHeader";

export default function SetupScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { categories, phases } = useCategories();
  const [progress, setProgress] = useState<Record<string, string[]>>({});

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      const fetchProgress = async () => {
        const { data } = await supabase
          .from("onboarding_progress")
          .select("category_id, completed_items")
          .eq("user_id", user.id);
        if (data) {
          const map: Record<string, string[]> = {};
          data.forEach((row: any) => {
            map[row.category_id] = row.completed_items || [];
          });
          setProgress(map);
        }
      };
      fetchProgress();
    }, [user])
  );

  const getCompletedItems = (catId: string): string[] => {
    const items = progress[catId];
    return Array.isArray(items) ? items : [];
  };

  const getPhaseProgress = (phaseCategories: string[]) => {
    let done = 0;
    let total = 0;
    phaseCategories.forEach((catId) => {
      const cat = categories.find((c) => c.id === catId);
      if (cat) {
        const completedItems = getCompletedItems(catId);
        total += cat.checklistItems.length;
        done += cat.checklistItems.filter((item) => completedItems.includes(item)).length;
      }
    });
    return { done, total };
  };

  const totalDone = categories.reduce((s, cat) => {
    const completedItems = getCompletedItems(cat.id);
    return s + cat.checklistItems.filter((item) => completedItems.includes(item)).length;
  }, 0);
  const totalItems = categories.reduce((s, c) => s + c.checklistItems.length, 0);
  const allComplete = totalDone >= totalItems && totalItems > 0;

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <GradientHeader colors={HEADER_GRADIENTS.setup} style={{ paddingTop: insets.top + 12, paddingBottom: 24, paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text
            color="inverse"
            className="flex-1 ml-2"
            style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 20, lineHeight: 28 }}
          >
            Setup Progress
          </Text>
        </View>
        <View className="mt-4">
          <View className="flex-row justify-between mb-2">
            <Text variant="caption" color="inverse" className="opacity-80">
              {totalDone}/{totalItems} tasks
            </Text>
            <Text variant="caption" color="inverse" className="opacity-80">
              {totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0}%
            </Text>
          </View>
          <View className="h-3 bg-white/20 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full bg-white"
              style={{ width: `${totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0}%` }}
            />
          </View>
        </View>
      </GradientHeader>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {allComplete ? (
          <View className="items-center justify-center py-16 px-8">
            <View
              className="w-28 h-28 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: Colors.success.light }}
            >
              <Ionicons name="checkmark-circle" size={56} color={Colors.success.DEFAULT} />
            </View>
            <Text
              className="text-grey-900 text-center"
              style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 24, lineHeight: 32 }}
            >
              You're all set!
            </Text>
            <Text variant="body" color="muted" className="text-center mt-2">
              You've completed all setup tasks.{"\n"}Welcome to the UK!
            </Text>
          </View>
        ) : (
          <View className="px-6 pt-6 gap-4">
            <Text
              className="text-grey-900"
              style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 20 }}
            >
              Your setup journey
            </Text>

            {phases.map((phase) => {
              const { done, total } = getPhaseProgress(phase.categories as string[]);
              const phaseDone = done >= total && total > 0;
              const percent = total > 0 ? Math.round((done / total) * 100) : 0;

              return (
                <Pressable
                  key={phase.id}
                  className="bg-white rounded-2xl px-5 py-5"
                  style={{ elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 }}
                  onPress={() => router.push(`/(onboarding)/${phase.id}` as any)}
                >
                  <View className="flex-row items-center gap-4">
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center"
                      style={{ backgroundColor: phaseDone ? Colors.success.light : Colors.primary[50] }}
                    >
                      <Ionicons
                        name={phaseDone ? "checkmark-circle" : ((phase.icon || "ellipse-outline") as any)}
                        size={24}
                        color={phaseDone ? Colors.success.DEFAULT : Colors.primary[500]}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-grey-900"
                        style={{ fontFamily: "BricolageGrotesque_600SemiBold", fontSize: 16 }}
                      >
                        {phase.title}
                      </Text>
                      <Text variant="caption" color="muted">
                        {done}/{total} completed
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.grey[400]} />
                  </View>
                  <View className="h-1.5 bg-grey-100 rounded-full overflow-hidden mt-3">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: phaseDone ? Colors.success.DEFAULT : Colors.primary[500],
                      }}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
