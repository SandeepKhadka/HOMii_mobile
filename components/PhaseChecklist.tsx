import { View, Pressable, ImageBackground, ImageSourcePropType } from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { CATEGORIES } from "@/constants/categories";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOnboardingProgress } from "@/contexts/OnboardingProgressContext";

interface PhaseChecklistProps {
  title: string;
  subtitle: string;
  categoryIds: readonly string[];
  backgroundImage: ImageSourcePropType;
  onContinue: () => void;
}

const CATEGORY_ICONS: Record<string, { name: React.ComponentProps<typeof Ionicons>["name"]; bg: string; color: string }> = {
  documents:     { name: "document-text",       bg: "#FEF3C7", color: "#F59E0B" },
  accommodation: { name: "home",                bg: "#EDE9FE", color: "#7C3AED" },
  banking:       { name: "card",                bg: "#CCFBF1", color: "#14B8A6" },
  sims:          { name: "phone-portrait",      bg: "#FEF3C7", color: "#F59E0B" },
  flights:       { name: "airplane",            bg: "#DCFCE7", color: "#22C55E" },
  insurance:     { name: "shield-checkmark",    bg: "#FEE2E2", color: "#DC2626" },
  transport:     { name: "bus",                 bg: "#E2E8F0", color: "#1E293B" },
  food:          { name: "restaurant",          bg: "#FFEDD5", color: "#F97316" },
  university:    { name: "school",              bg: "#E0F2FE", color: "#38BDF8" },
  discounts:     { name: "pricetag",            bg: "#FFE4E6", color: "#F43F5E" },
  socialEvents:  { name: "calendar",            bg: "#FCE7F3", color: "#F472B6" },
  exploreUK:     { name: "compass",             bg: "#E2E8F0", color: "#475569" },
};

export default function PhaseChecklist({
  title,
  subtitle,
  categoryIds,
  backgroundImage,
  onContinue,
}: PhaseChecklistProps) {
  const insets = useSafeAreaInsets();
  const { isCategoryCompleted, completedCount } = useOnboardingProgress();

  const categories = categoryIds
    .map((id) => CATEGORIES.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <ImageBackground
      source={backgroundImage}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Semi-transparent overlay so checklist items are readable */}
      <View className="flex-1" style={{ backgroundColor: "rgba(255,255,255,0.3)", paddingTop: insets.top + 8 }}>
        {/* Header */}
        <View className="flex-row items-center px-4">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
          </Pressable>
          <View className="flex-1 items-center">
            <View
              className="bg-white px-8 py-2 rounded-full items-center"
              style={{
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}
            >
              <Text variant="h4" className="font-heading text-grey-900 text-center">
                {title}
              </Text>
              <Text variant="caption" color="muted" className="text-center mt-0.5">
                {subtitle}
              </Text>
            </View>
          </View>
          <View className="w-10" />
        </View>

        {/* Spacer after header */}
        <View className="h-4" />

        {/* Checklist items */}
        <View className="px-5 gap-3">
          {categories.map((cat) => {
            if (!cat) return null;
            const iconInfo = CATEGORY_ICONS[cat.id] || { name: "ellipse-outline" as const, bg: "#F3F4F6", color: "#6B7280" };
            const isDone = isCategoryCompleted(cat.id);
            const done = completedCount(cat.id);
            const total = cat.checklistItems.length;

            return (
              <Pressable
                key={cat.id}
                onPress={() => router.push({ pathname: "/(onboarding)/category-checklist", params: { id: cat.id } })}
                className="flex-row items-center bg-white rounded-2xl px-4 py-4 gap-4"
                style={{
                  elevation: 2,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                }}
              >
                {/* Category icon */}
                <View
                  className="w-11 h-11 rounded-xl items-center justify-center"
                  style={{ backgroundColor: iconInfo.bg }}
                >
                  <Ionicons name={iconInfo.name} size={22} color={iconInfo.color} />
                </View>

                {/* Title + subtitle */}
                <View className="flex-1">
                  <Text variant="subtitle" className="font-heading text-grey-900">
                    {cat.id === "discounts" ? "Student Discounts" : cat.title}
                  </Text>
                  <Text variant="caption" color="muted">{done}/{total} completed</Text>
                </View>

                {/* Check circle */}
                {isDone ? (
                  <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: Colors.teal.DEFAULT }}>
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  </View>
                ) : (
                  <View className="w-8 h-8 rounded-full border-2 items-center justify-center" style={{ borderColor: Colors.teal.DEFAULT }} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Spacer pushes button to bottom */}
        <View className="flex-1" />

        {/* Continue button at bottom — background image shows through below checklist */}
        <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
          <Button
            variant="primary"
            size="lg"
            label="Continue"
            fullWidth
            onPress={onContinue}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
