import { useState } from "react";
import { View, ScrollView, Pressable, ActivityIndicator, TextInput } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientHeader, { HEADER_GRADIENTS, lightenHex } from "@/components/GradientHeader";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/contexts/CategoriesContext";

// Category browser — reached from "Your Apps" tab via the "Find more apps" CTA.
// Previously this was the Apps tab itself; that tab now shows the user's
// selected apps and routes here for discovery.
export default function BrowseScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { categories, loading } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");

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
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 -ml-2 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text color="inverse" className="flex-1" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 22, lineHeight: 28 }}>
            {t("apps.title")}
          </Text>
        </View>
        <Text variant="body" color="inverse" className="opacity-80 mt-0.5">
          {t("apps.subtitle")}
        </Text>
        <View className="flex-row items-center bg-white/20 rounded-xl h-10 px-3 mt-3 gap-2">
          <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.8)" />
          <TextInput
            placeholder={t("apps.searchPlaceholder")}
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, color: "#fff", fontSize: 14 }}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.8)" />
            </Pressable>
          )}
        </View>
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
          {(() => {
            const filtered = searchQuery.trim()
              ? categories.filter((c) =>
                  c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (c.apps ?? []).some((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
                )
              : categories;

            if (filtered.length === 0) {
              return (
                <View className="items-center py-12 px-6">
                  <Ionicons name="search-outline" size={44} color="#9CA3AF" />
                  <Text variant="bodyMedium" color="muted" className="text-center mt-3">
                    {t("apps.noResults")}
                  </Text>
                  <Text variant="caption" color="muted" className="text-center mt-2" style={{ lineHeight: 18 }}>
                    {t("apps.recommendPrompt")}
                  </Text>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/contact",
                        params: {
                          subject: t("apps.recommendSubject", { query: searchQuery.trim() }),
                          message: t("apps.recommendMessage", { query: searchQuery.trim() }),
                        },
                      } as any)
                    }
                    className="mt-4 px-5 py-2.5 rounded-full bg-primary-50"
                  >
                    <Text variant="captionMedium" style={{ color: Colors.primary[600] }}>
                      {t("apps.recommendCta")}
                    </Text>
                  </Pressable>
                </View>
              );
            }

            return (
              <>
                <View className="flex-row flex-wrap gap-4">
                  {filtered.map((cat) => {
                    const color = cat.color || Colors.primary[500];
                    const gradientEnd = lightenHex(color, 0.6);
                    const hasRecommended = cat.apps.some((a) => a.recommended);

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
                          {hasRecommended && (
                            <View
                              style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                backgroundColor: "rgba(255,255,255,0.95)",
                                paddingHorizontal: 7,
                                paddingVertical: 3,
                                borderRadius: 10,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 3,
                              }}
                            >
                              <Ionicons name="star" size={10} color={color} />
                              <Text variant="caption" style={{ color, fontSize: 10, fontFamily: "BricolageGrotesque_600SemiBold" }}>
                                {t("home.homiiPick")}
                              </Text>
                            </View>
                          )}
                        </LinearGradient>

                        <View className="p-3">
                          <Text variant="bodyMedium" className="text-grey-800">{cat.title}</Text>
                          {cat.apps.length > 0 && (
                            <Text variant="caption" color="muted">
                              {t("apps.appsCount", { count: cat.apps.length })}
                            </Text>
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
                {!searchQuery && (
                  <Text variant="caption" color="muted" className="text-center mt-6">
                    {t("apps.allCategoriesLoaded", { count: categories.length })}
                  </Text>
                )}
              </>
            );
          })()}
        </ScrollView>
      )}
    </View>
  );
}
