import { router } from "expo-router";
import PhaseChecklist from "@/components/PhaseChecklist";
import { PHASES } from "@/constants/categories";

const phase = PHASES[1];

export default function UponArrivalScreen() {
  return (
    <PhaseChecklist
      title={phase.title}
      subtitle="Settle in smooth when you arrive."
      categoryIds={phase.categories}
      backgroundImage={require("@/assets/images/upon-arrival-bg.png")}
      onContinue={() => router.push("/(onboarding)/settling-in")}
    />
  );
}
