import { View, Pressable, ImageBackground } from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOnboardingProgress } from "@/contexts/OnboardingProgressContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { capture } from "@/lib/analytics";
import GradientHeader from "@/components/GradientHeader";
import { useTranslation } from "react-i18next";

// Background images only exist for the original 3 phases — new phases get no bg
const ONBOARDING_BG: Record<string, any> = {
  "before-fly":   require("@/assets/images/before-fly-bg.png"),
  "upon-arrival": require("@/assets/images/upon-arrival-bg.png"),
  "settling-in":  require("@/assets/images/settling-in-bg.png"),
};

interface PhaseChecklistProps {
  phaseId: string;
  title: string;
  subtitle: string;
  categoryIds: readonly string[];
  isOnboarding?: boolean;
  onContinue?: () => void;
  continueLabel?: string;
}

export default function PhaseChecklist({
  phaseId,
  title,
  subtitle,
  categoryIds,
  isOnboarding = false,
  onContinue,
  continueLabel,
}: PhaseChecklistProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { isCategoryCompleted, toggleCategoryComplete } = useOnboardingProgress();
  const { categories: allCategories } = useCategories();
  const resolvedContinueLabel = continueLabel ?? t("common.continue");

  const categories = categoryIds
    .map((id) => allCategories.find((c) => c.id === id))
    .filter(Boolean);

  const checklist = (
    <View className="px-5 gap-3">
      {categories.map((cat) => {
        if (!cat) return null;
        const iconColor = cat.color || "#6B7280";
        const iconBg = cat.color ? cat.color + "20" : "#F3F4F6";
        const iconName = (cat.icon || "ellipse-outline") as React.ComponentProps<typeof Ionicons>["name"];
        const isDone = isCategoryCompleted(cat.id, cat.checklistItems);

        return (
          // Row: two tap targets. Tapping the icon/title/count opens the
          // category's app recommendations. Tapping the circle on the right
          // marks the whole category complete (or unmarks it) without nav.
          <View
            key={cat.id}
            className="flex-row items-center bg-white rounded-2xl pr-2 gap-4"
            style={{
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
            }}
          >
            <Pressable
              onPress={() => {
                capture('checklist_category_opened', { category_id: cat.id, category_name: cat.title, phase_id: phaseId });
                router.push({ pathname: "/category/[id]", params: { id: cat.id } });
              }}
              className="flex-row items-center flex-1 px-4 py-4 gap-4"
            >
              <View className="w-11 h-11 rounded-xl items-center justify-center" style={{ backgroundColor: iconBg }}>
                <Ionicons name={iconName} size={22} color={iconColor} />
              </View>
              <View className="flex-1">
                <Text variant="subtitle" className="font-heading text-grey-900">
                  {cat.title}
                </Text>
                <Text variant="caption" color="muted">
                  {isDone ? t("setup.statusDone") : t("setup.statusNotStarted")}
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                capture('checklist_category_toggled', { category_id: cat.id, category_name: cat.title, phase_id: phaseId, completing: !isDone });
                toggleCategoryComplete(cat.id, cat.checklistItems);
              }}
              hitSlop={10}
              className="p-2"
            >
              {isDone ? (
                <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: Colors.teal.DEFAULT }}>
                  <Ionicons name="checkmark" size={18} color="#fff" />
                </View>
              ) : (
                <View className="w-8 h-8 rounded-full border-2 items-center justify-center" style={{ borderColor: Colors.teal.DEFAULT }} />
              )}
            </Pressable>
          </View>
        );
      })}
    </View>
  );

  if (isOnboarding) {
    const bgImage = ONBOARDING_BG[phaseId];
    const inner = (
      <View className="flex-1" style={{ backgroundColor: bgImage ? "rgba(255,255,255,0.3)" : "#fff", paddingTop: insets.top + 8 }}>
        {/* Onboarding header — floating pill */}
        <View className="flex-row items-center px-4">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
          </Pressable>
          <View className="flex-1 items-center">
            <View
              className="bg-white px-8 py-2 rounded-full items-center"
              style={{ elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}
            >
              <Text variant="h4" className="font-heading text-grey-900 text-center">{title}</Text>
              <Text variant="caption" color="muted" className="text-center mt-0.5">{subtitle}</Text>
            </View>
          </View>
          <View className="w-10" />
        </View>
        <View className="h-4" />
        {checklist}
        <View className="flex-1" />
        {onContinue && (
          <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
            <Button variant="primary" size="lg" label={resolvedContinueLabel} fullWidth onPress={onContinue} />
          </View>
        )}
      </View>
    );

    if (bgImage) {
      return (
        <ImageBackground source={bgImage} className="flex-1" resizeMode="cover">
          {inner}
        </ImageBackground>
      );
    }
    return inner;
  }

  // Non-onboarding (setup journey revisit) — gradient header, clean white bg
  return (
    <View className="flex-1 bg-background">
      <GradientHeader style={{ paddingTop: insets.top + 12, paddingBottom: 20, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <View className="flex-1 ml-1">
            <Text
              style={{
                fontFamily: "BricolageGrotesque_700Bold",
                fontSize: 22,
                lineHeight: 28,
                color: "#fff",
              }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text style={{ fontSize: 13, lineHeight: 16, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      </GradientHeader>

      <View className="flex-1 pt-5">
        {checklist}
      </View>

      {onContinue && (
        <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
          <Button variant="primary" size="lg" label={resolvedContinueLabel} fullWidth onPress={onContinue} />
        </View>
      )}
    </View>
  );
}
