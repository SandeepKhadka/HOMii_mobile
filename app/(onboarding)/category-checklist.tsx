import { View, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES } from "@/constants/categories";
import { useOnboardingProgress } from "@/contexts/OnboardingProgressContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

export default function CategoryChecklistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const category = CATEGORIES.find((c) => c.id === id);
  const { isItemCompleted, toggleItem } = useOnboardingProgress();

  if (!category) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text variant="body" color="muted">Category not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Colored header */}
      <View
        className="pb-5 px-6 rounded-b-3xl"
        style={{ backgroundColor: category.color, paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color={category.textColor} />
          </Pressable>
          <Text
            variant="h3"
            className="font-heading flex-1 ml-2"
            style={{ color: category.textColor }}
          >
            {category.title}
          </Text>
          <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
            <Ionicons
              name={category.icon as any}
              size={20}
              color={category.textColor}
            />
          </View>
        </View>
      </View>

      {/* Checklist items */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="gap-3">
          {category.checklistItems.map((item) => {
            const isDone = isItemCompleted(category.id, item);
            return (
              <Pressable
                key={item}
                onPress={() => toggleItem(category.id, item)}
                className="flex-row items-center bg-white rounded-2xl px-5 py-4"
                style={{
                  elevation: 2,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                }}
              >
                <Text variant="bodyMedium" className="flex-1 text-grey-900">
                  {item}
                </Text>

                {isDone ? (
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: Colors.teal.DEFAULT }}
                  >
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  </View>
                ) : (
                  <View
                    className="w-8 h-8 rounded-full border-2 items-center justify-center"
                    style={{ borderColor: Colors.teal.DEFAULT }}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
