import { router } from "expo-router";
import PhaseChecklist from "@/components/PhaseChecklist";
import { PHASES } from "@/constants/categories";

const phase = PHASES[2];

export default function SettlingInScreen() {
  return (
    <PhaseChecklist
      title={phase.title}
      subtitle="Get Comfortable and start your new life."
      categoryIds={phase.categories}
      backgroundImage={require("@/assets/images/settling-in-bg.png")}
      onContinue={() => router.push("/(onboarding)/complete")}
    />
  );
}
