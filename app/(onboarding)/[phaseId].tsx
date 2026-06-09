import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import PhaseChecklist from "@/components/PhaseChecklist";
import { Text } from "@/components/ui";
import { useCategories } from "@/contexts/CategoriesContext";
import { capture } from "@/lib/analytics";
import { useTranslation } from "react-i18next";

export default function PhaseScreen() {
  const { t } = useTranslation();
  const { phaseId, onboarding } = useLocalSearchParams<{ phaseId: string; onboarding?: string }>();
  const { phases } = useCategories();
  const isOnboarding = onboarding === "true";

  const phaseIndex = phases.findIndex((p) => p.id === phaseId);
  const phase = phases[phaseIndex];

  if (!phase) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text variant="body" color="muted">{t("onboarding.phase.notFound")}</Text>
      </View>
    );
  }

  // Onboarding wizard was removed in favor of a single consolidated
  // checklist (`checklist-intro`). When a user drills into a phase from
  // there and finishes, send them back to the checklist instead of
  // marching them through the next phase.
  const handleContinue = isOnboarding
    ? () => {
        capture('onboarding_step_completed', { phase_id: phase.id, phase_title: phase.title });
        router.back();
      }
    : undefined;

  return (
    <PhaseChecklist
      phaseId={phase.id}
      title={phase.title}
      subtitle={phase.subtitle}
      categoryIds={phase.categories}
      isOnboarding={isOnboarding}
      onContinue={handleContinue}
      continueLabel={t("common.done")}
    />
  );
}
