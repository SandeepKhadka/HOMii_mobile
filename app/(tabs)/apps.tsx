import { View, ScrollView, Pressable, ActivityIndicator, Linking } from "react-native";
import { router } from "expo-router";
import { Text, Screen } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCategories } from "@/contexts/CategoriesContext";
import { api } from "@/lib/api";

const PHASE_ICONS: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
  "before-fly":  "airplane-outline",
  "upon-arrival": "location-outline",
  "settling-in":  "home-outline",
};

const CATEGORY_ICON_MAP: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
  sims:      "phone-portrait-outline",
  banking:   "card-outline",
  transport: "bus-outline",
  food:      "restaurant-outline",
  discounts: "pricetag-outline",
  groceries: "cart-outline",
  events:    "calendar-outline",
};

export default function AppsScreen() {
  const insets = useSafeAreaInsets();
  const { categories, phases, loading } = useCategories();

  const handleAppDownload = async (appId?: string) => {
    if (!appId) return;
    try {
      const { redirectUrl } = await api.trackClick(appId);
      if (redirectUrl) {
        await Linking.openURL(redirectUrl);
      }
    } catch {
      // silent fail
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-primary-400 px-6 pb-5 rounded-b-3xl"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text
          color="inverse"
          style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 22, lineHeight: 28 }}
        >
          All Apps
        </Text>
        <Text variant="body" color="inverse" className="opacity-80 mt-0.5">
          Explore all essential tools for your UK journey
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          className="flex-1"
        >
          {phases.map((phase) => {
            const phaseCats = phase.categories
              .map((catId) => categories.find((c) => c.id === catId))
              .filter(Boolean) as NonNullable<typeof categories[number]>[];

            if (phaseCats.length === 0) return null;

            return (
              <View key={phase.id} className="mt-6">
                {/* Phase heading */}
                <View className="flex-row items-center gap-2 px-6 mb-3">
                  <Ionicons
                    name={PHASE_ICONS[phase.id] || "ellipse-outline"}
                    size={18}
                    color={Colors.primary[500]}
                  />
                  <Text
                    className="text-grey-900"
                    style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 16 }}
                  >
                    {phase.title}
                  </Text>
                </View>

                <View className="px-6 gap-4">
                  {phaseCats.map((cat) => (
                    <View key={cat.id} className="bg-white rounded-2xl overflow-hidden border border-grey-100"
                      style={{ elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6 }}
                    >
                      {/* Category header row */}
                      <Pressable
                        className="flex-row items-center px-4 py-3 border-b border-grey-100"
                        style={{ backgroundColor: cat.color + "12" }}
                        onPress={() => router.push(`/category/${cat.id}` as any)}
                      >
                        <View
                          className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                          style={{ backgroundColor: cat.color + "30" }}
                        >
                          <Ionicons
                            name={(CATEGORY_ICON_MAP[cat.id] || "apps-outline") as any}
                            size={18}
                            color={cat.color}
                          />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-grey-900"
                            style={{ fontFamily: "BricolageGrotesque_600SemiBold", fontSize: 15 }}
                          >
                            {cat.title}
                          </Text>
                          {cat.subtitle ? (
                            <Text variant="caption" color="muted">{cat.subtitle}</Text>
                          ) : null}
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={Colors.grey[400]} />
                      </Pressable>

                      {/* App list */}
                      {cat.apps.length > 0 ? (
                        <View>
                          {cat.apps.map((app, idx) => (
                            <View
                              key={app.id || app.name}
                              className="flex-row items-center px-4 py-3"
                              style={{
                                borderBottomWidth: idx < cat.apps.length - 1 ? 1 : 0,
                                borderBottomColor: Colors.grey[100],
                              }}
                            >
                              <View
                                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                                style={{ backgroundColor: cat.color + "15" }}
                              >
                                <Ionicons
                                  name={(CATEGORY_ICON_MAP[cat.id] || "apps-outline") as any}
                                  size={16}
                                  color={cat.color}
                                />
                              </View>
                              <View className="flex-1">
                                <View className="flex-row items-center gap-2">
                                  <Text variant="bodyMedium" className="text-grey-900">{app.name}</Text>
                                  {app.recommended && (
                                    <View className="px-1.5 py-0.5 rounded" style={{ backgroundColor: cat.color }}>
                                      <Text variant="label" color="inverse" className="text-[9px]">TOP PICK</Text>
                                    </View>
                                  )}
                                </View>
                                {app.description ? (
                                  <Text variant="caption" color="muted" numberOfLines={1}>{app.description}</Text>
                                ) : null}
                              </View>
                              <Pressable
                                className="px-3 py-1.5 rounded-full"
                                style={{ backgroundColor: cat.color + "15" }}
                                onPress={() => handleAppDownload(app.id)}
                              >
                                <Text
                                  variant="captionMedium"
                                  style={{ color: cat.color, fontFamily: "BricolageGrotesque_600SemiBold" }}
                                >
                                  Get
                                </Text>
                              </Pressable>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <View className="px-4 py-4">
                          <Text variant="caption" color="muted">Apps coming soon</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
