import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import PhaseChecklist from "@/components/PhaseChecklist";
import { Text } from "@/components/ui";
import { useCategories } from "@/contexts/CategoriesContext";
import { capture } from "@/lib/analytics";

export default function PhaseScreen() {
  const { phaseId, onboarding } = useLocalSearchParams<{ phaseId: string; onboarding?: string }>();
  const { phases } = useCategories();
  const isOnboarding = onboarding === "true";

  const phaseIndex = phases.findIndex((p) => p.id === phaseId);
  const phase = phases[phaseIndex];

  if (!phase) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text variant="body" color="muted">Phase not found</Text>
      </View>
    );
  }

  const nextPhase = phases[phaseIndex + 1];
  const isLastPhase = !nextPhase;

  const handleContinue = isOnboarding
    ? () => {
        capture('onboarding_step_completed', { phase_id: phase.id, phase_title: phase.title, is_last_phase: isLastPhase });
        if (isLastPhase) {
          router.push("/(onboarding)/complete");
        } else {
          router.push({ pathname: `/(onboarding)/${nextPhase.id}` as any, params: { onboarding: "true" } });
        }
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
      continueLabel={isLastPhase ? "Continue to Home" : "Continue"}
    />
  );
}
