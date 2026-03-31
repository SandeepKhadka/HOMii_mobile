import { router, useLocalSearchParams } from "expo-router";
import PhaseChecklist from "@/components/PhaseChecklist";
import { PHASES } from "@/constants/categories";
import { useAuth } from "@/contexts/AuthContext";

const phase = PHASES[2];

export default function SettlingInScreen() {
  const { onboarding } = useLocalSearchParams<{ onboarding?: string }>();
  const { updateProfile } = useAuth();
  const isOnboarding = onboarding === "true";

  const handleContinueToHome = async () => {
    await updateProfile({ onboarding_completed: true });
    router.replace("/(tabs)");
  };

  return (
    <PhaseChecklist
      title={phase.title}
      subtitle="Get Comfortable and start your new life."
      categoryIds={phase.categories}
      backgroundImage={require("@/assets/images/settling-in-bg.png")}
      onContinue={isOnboarding ? handleContinueToHome : undefined}
      continueLabel="Continue to Home"
    />
  );
}
