import { useState, useCallback } from "react";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api, ApiCategory } from "@/lib/api";
import GradientHeader, { HEADER_GRADIENTS, lightenHex } from "@/components/GradientHeader";
import { capture } from "@/lib/analytics";
import { useFocusEffect } from "expo-router";

const PAGE_SIZE = 6;

export default function AppsScreen() {
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = useCallback(async (pageNum: number, reset = false) => {
    try {
      const res = await api.getCategoriesPaginated(pageNum, PAGE_SIZE);
      setCategories((prev) => reset ? res.items : [...prev, ...res.items]);
      setHasMore(res.hasMore);
      setPage(pageNum);
    } catch {
      // silent fail
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchPage(1, true).finally(() => setLoading(false));
    }, [fetchPage])
  );

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchPage(page + 1);
    setLoadingMore(false);
  };

  const handleCategoryPress = (cat: ApiCategory) => {
    // Map slug → id for category detail screen
    const id = cat.slug === 'sim-cards' ? 'sims' : cat.slug === 'food-delivery' ? 'food' : cat.slug === 'student-discounts' ? 'discounts' : cat.slug;
    router.push(`/category/${id}` as any);
  };

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
          All Apps
        </Text>
        <Text variant="body" color="inverse" className="opacity-80 mt-0.5">
          Explore all essential tools for your UK journey
        </Text>
      </GradientHeader>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, paddingBottom: insets.bottom + 32 }}
        >
          {/* 2-column grid — same card style as Essential Apps on home */}
          <View className="flex-row flex-wrap gap-4">
            {categories.map((cat) => {
              const color = cat.color || Colors.primary[500];
              const gradientEnd = lightenHex(color, 0.6);

              return (
                <Pressable
                  key={cat.id}
                  className="bg-white rounded-2xl overflow-hidden"
                  style={{ width: "47%", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 }}
                  onPress={() => handleCategoryPress(cat)}
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
                    <Text variant="bodyMedium" className="text-grey-800">{cat.name}</Text>
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

          {/* Load More */}
          {hasMore && (
            <Pressable
              onPress={loadMore}
              disabled={loadingMore}
              className="mt-6 py-3.5 rounded-2xl items-center justify-center border border-grey-200 bg-white"
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color={Colors.primary[500]} />
              ) : (
                <Text variant="bodyMedium" style={{ color: Colors.primary[500] }}>Load More</Text>
              )}
            </Pressable>
          )}

          {!hasMore && categories.length > 0 && (
            <Text variant="caption" color="muted" className="text-center mt-6">
              All {categories.length} categories loaded
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}
