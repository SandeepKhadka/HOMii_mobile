import { router, useLocalSearchParams } from "expo-router";
import PhaseChecklist from "@/components/PhaseChecklist";
import { PHASES } from "@/constants/categories";

const phase = PHASES[1];

export default function UponArrivalScreen() {
  const { onboarding } = useLocalSearchParams<{ onboarding?: string }>();
  const isOnboarding = onboarding === "true";

  return (
    <PhaseChecklist
      title={phase.title}
      subtitle="Settle in smooth when you arrive."
      categoryIds={phase.categories}
      backgroundImage={require("@/assets/images/upon-arrival-bg.png")}
      onContinue={isOnboarding ? () => router.push({ pathname: "/(onboarding)/settling-in", params: { onboarding: "true" } }) : undefined}
    />
  );
}
