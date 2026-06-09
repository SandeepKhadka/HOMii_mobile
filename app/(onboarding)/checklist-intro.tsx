import { useState, useCallback } from "react";
import { View, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCategories } from "@/contexts/CategoriesContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";

// Consolidated post-university checklist. Replaces the old multi-page
// wizard (intro → Before You Fly → Upon Arrival → Settling In → complete).
// Users see all phases at once with progress, tap any to drill in, and can
// Continue or Skip — both lead to the Connect intro, then home.
export default function ChecklistIntroScreen() {
  const insets = useSafeAreaInsets();
  const { phases, categories } = useCategories();
  const { profile, updateProfile, user } = useAuth();
  const { t } = useTranslation();
  const [progress, setProgress] = useState<Record<string, string[]>>({});
  const [finishing, setFinishing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      (async () => {
        const { data } = await supabase
          .from("onboarding_progress")
          .select("category_id, completed_items")
          .eq("user_id", user.id);
        if (data) {
          const map: Record<string, string[]> = {};
          data.forEach((row: any) => { map[row.category_id] = row.completed_items || []; });
          setProgress(map);
        }
      })();
    }, [user])
  );

  const isCategoryDone = (catId: string): boolean => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat || cat.checklistItems.length === 0) return false;
    const completed = progress[catId] || [];
    return cat.checklistItems.every((item) => completed.includes(item));
  };

  const getPhaseProgress = (phaseCategories: string[]) => {
    let done = 0, total = 0;
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
  const totalPercent = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;

  const finishOnboarding = async () => {
    setFinishing(true);
    await updateProfile({ onboarding_completed: true });
    router.replace("/(onboarding)/connect-intro" as any);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Top header — purple background with progress */}
      <View
        className="px-6"
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 28,
          backgroundColor: Colors.primary[500],
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          {profile?.university ? (
            <View className="flex-1 items-center">
              <View className="bg-white/20 px-4 py-1.5 rounded-full max-w-[80%]">
                <Text variant="caption" style={{ color: "#fff" }} numberOfLines={1}>
                  {profile.university}
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex-1" />
          )}
          <View className="w-10" />
        </View>

        <Text
          className="mt-5"
          style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 24, lineHeight: 30, color: "#fff" }}
        >
          {t("onboarding.checklistIntro.title")}
        </Text>
        <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
          {t("onboarding.checklistIntro.subtitle")}
        </Text>

        <View className="mt-5">
          <View className="flex-row justify-between mb-2">
            <Text variant="caption" style={{ color: "rgba(255,255,255,0.9)" }}>
              {t("setup.categoriesDone", { done: totalDone, total: totalItems })}
            </Text>
            <Text variant="caption" style={{ color: "rgba(255,255,255,0.9)" }}>
              {totalPercent}%
            </Text>
          </View>
          <View className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full bg-white"
              style={{ width: `${totalPercent}%` }}
            />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        <View className="px-6 pt-6 gap-3">
          <Text
            className="text-grey-900 mb-1"
            style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 18 }}
          >
            {t("setup.journey")}
          </Text>

          {phases.map((phase) => {
            const { done, total } = getPhaseProgress(phase.categories as string[]);
            const phaseDone = done >= total && total > 0;
            const percent = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <Pressable
                key={phase.id}
                className="bg-white rounded-2xl px-5 py-4"
                style={{ elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 }}
                onPress={() => router.push({ pathname: `/(onboarding)/${phase.id}` as any, params: { onboarding: "true" } })}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="w-11 h-11 rounded-xl items-center justify-center"
                    style={{ backgroundColor: phaseDone ? Colors.success.light : Colors.primary[50] }}
                  >
                    <Ionicons
                      name={phaseDone ? "checkmark-circle" : ((phase.icon || "ellipse-outline") as any)}
                      size={22}
                      color={phaseDone ? Colors.success.DEFAULT : Colors.primary[500]}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-grey-900"
                      style={{ fontFamily: "BricolageGrotesque_600SemiBold", fontSize: 15 }}
                    >
                      {phase.title}
                    </Text>
                    <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
                      {t("setup.categoriesDone", { done, total })}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.grey[400]} />
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

      {/* Bottom CTAs — Continue moves on, Skip jumps straight to Connect intro. */}
      <View
        className="px-6 pt-3 bg-white border-t border-grey-100"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <Button
          variant="primary"
          size="lg"
          label={finishing ? t("common.continue") + "..." : t("common.continue")}
          fullWidth
          disabled={finishing}
          onPress={finishOnboarding}
        />
        <Pressable onPress={finishOnboarding} disabled={finishing} className="py-3 mt-1">
          <Text variant="bodyMedium" color="muted" className="text-center font-semibold">
            {finishing ? <ActivityIndicator size="small" color={Colors.grey[500]} /> : t("onboarding.checklistIntro.skip")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
