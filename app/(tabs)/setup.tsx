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
import { useTranslation } from "react-i18next";

export default function SetupScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
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

  // Progress is counted by CATEGORY, not by individual checklist item.
  // The only completion mechanism is the green circle which marks a whole
  // category complete in one tap — individual items can't be toggled anymore.
  const isCategoryDone = (catId: string): boolean => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat || cat.checklistItems.length === 0) return false;
    const completedItems = getCompletedItems(catId);
    return cat.checklistItems.every((item) => completedItems.includes(item));
  };

  const getPhaseProgress = (phaseCategories: string[]) => {
    let done = 0;
    let total = 0;
    phaseCategories.forEach((catId) => {
      const cat = categories.find((c) => c.id === catId);
      if (cat) {
        total += 1;
        if (isCategoryDone(catId)) done += 1;
      }
    });
    return { done, total };
  };

  const totalDone = categories.filter((c) => isCategoryDone(c.id)).length;
  const totalItems = categories.length;
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
            {t("setup.title")}
          </Text>
        </View>
        <View className="mt-4">
          <View className="flex-row justify-between mb-2">
            <Text variant="caption" color="inverse" className="opacity-80">
              {t("setup.categoriesDone", { done: totalDone, total: totalItems })}
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
          // Show celebration banner AT TOP, but keep phase list below so user
          // can revisit any phase / re-tick categories any time.
          <View className="px-6 pt-6">
            <View
              className="rounded-2xl p-5 flex-row items-center gap-4 mb-6"
              style={{ backgroundColor: Colors.success.light }}
            >
              <View className="w-14 h-14 rounded-full items-center justify-center" style={{ backgroundColor: "#fff" }}>
                <Ionicons name="checkmark-circle" size={32} color={Colors.success.DEFAULT} />
              </View>
              <View className="flex-1">
                <Text
                  style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 18, color: Colors.grey[900] }}
                >
                  {t("setup.allDoneTitle")}
                </Text>
                <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
                  {t("setup.reviewAnytime")}
                </Text>
              </View>
            </View>
            <Text
              className="text-grey-900 mb-4"
              style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 18 }}
            >
              {t("setup.reviewSetup")}
            </Text>
          </View>
        ) : null}
        {/* Phase list is ALWAYS visible — even after completion so the
            user can revisit any phase / re-tick categories any time. */}
        <View className="px-6 pt-6 gap-4" style={{ paddingTop: allComplete ? 0 : 24 }}>
          {!allComplete && (
            <Text
              className="text-grey-900"
              style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 20 }}
            >
              {t("setup.journey")}
            </Text>
          )}

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
                        {t("setup.categoriesDone", { done, total })}
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
      </ScrollView>
    </View>
  );
}
