import { router, useLocalSearchParams } from "expo-router";
import PhaseChecklist from "@/components/PhaseChecklist";
import { PHASES } from "@/constants/categories";

const phase = PHASES[0];

export default function BeforeFlyScreen() {
  const { onboarding } = useLocalSearchParams<{ onboarding?: string }>();
  const isOnboarding = onboarding === "true";

  return (
    <PhaseChecklist
      title={phase.title}
      subtitle="Get Everything ready before your arrive"
      categoryIds={phase.categories}
      backgroundImage={require("@/assets/images/before-fly-bg.png")}
      onContinue={isOnboarding ? () => router.push({ pathname: "/(onboarding)/upon-arrival", params: { onboarding: "true" } }) : undefined}
    />
  );
}
