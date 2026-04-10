import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientHeader, { HEADER_GRADIENTS, lightenHex } from "@/components/GradientHeader";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/contexts/CategoriesContext";

export default function AppsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { categories, loading } = useCategories();

  return (
    <View className="flex-1 bg-background">
      <GradientHeader
        colors={HEADER_GRADIENTS.apps}
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 20,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Text color="inverse" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 22, lineHeight: 28 }}>
          {t("apps.title")}
        </Text>
        <Text variant="body" color="inverse" className="opacity-80 mt-0.5">
          Explore all essential tools for your UK journey
        </Text>
      </GradientHeader>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      ) : categories.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="apps-outline" size={48} color="#9CA3AF" />
          <Text variant="bodyMedium" color="muted" className="text-center mt-3">
            {t("apps.empty")}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, paddingBottom: insets.bottom + 32 }}
        >
          <View className="flex-row flex-wrap gap-4">
            {categories.map((cat) => {
              const color = cat.color || Colors.primary[500];
              const gradientEnd = lightenHex(color, 0.6);

              return (
                <Pressable
                  key={cat.id}
                  className="bg-white rounded-2xl overflow-hidden"
                  style={{ width: "47%", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 }}
                  onPress={() => router.push(`/category/${cat.id}` as any)}
                >
                  <LinearGradient
                    colors={[color, gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ height: 96, alignItems: "center", justifyContent: "center" }}
                  >
                    <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.85)", alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name={(cat.icon || "apps-outline") as any} size={26} color={color} />
                    </View>
                  </LinearGradient>

                  <View className="p-3">
                    <Text variant="bodyMedium" className="text-grey-800">{cat.title}</Text>
                    {cat.apps.length > 0 && (
                      <Text variant="caption" color="muted">
                        {cat.apps.length} app{cat.apps.length !== 1 ? "s" : ""}
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {categories.length > 0 && (
            <Text variant="caption" color="muted" className="text-center mt-6">
              All {categories.length} categories loaded
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}
