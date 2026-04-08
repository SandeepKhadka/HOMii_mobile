import { useEffect } from "react";
import { View, ScrollView, Pressable, Linking, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useCategories } from "@/contexts/CategoriesContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { capture } from "@/lib/analytics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientHeader, { lightenHex } from "@/components/GradientHeader";

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { categories } = useCategories();
  const { profile } = useAuth();
  const category = categories.find((c) => c.id === id);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (category) {
      capture('category_apps_viewed', { category_id: id, category_name: category.title });
    }
  }, [id]);

  if (!category) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text variant="body" color="muted">Category not found</Text>
      </View>
    );
  }

  const handleDownload = async (appId?: string, appName?: string) => {
    if (!appId) return;
    capture('partner_download_clicked', { app_id: appId, app_name: appName, category_id: id });
    try {
      const { redirectUrl } = await api.trackClick(appId, {
        refId: profile?.ref_id ?? undefined,
        platform: Platform.OS,
        actionType: 'download',
      });
      if (redirectUrl) {
        await Linking.openURL(redirectUrl);
      }
    } catch {
      // silent fail — click tracking should not block UX
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Gradient header */}
      <GradientHeader
        colors={[category.color, lightenHex(category.color, 0.6)]}
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 20,
          paddingHorizontal: 16,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text variant="h3" className="font-heading flex-1 ml-2" style={{ color: "#fff" }}>
            {category.title}
          </Text>
          <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
            <Ionicons name={category.icon as any} size={20} color="#fff" />
          </View>
        </View>
        {category.subtitle ? (
          <Text variant="body" className="mt-2 opacity-80" style={{ color: "#fff" }}>
            {category.subtitle}
          </Text>
        ) : null}
      </GradientHeader>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 pt-4">
        {/* App list */}
        {category.apps.length > 0 ? (
          <View className="gap-3">
            {category.apps.map((app) => (
              <View
                key={app.id || app.name}
                className={`flex-row items-center p-4 rounded-2xl bg-white ${
                  app.recommended ? "border-2" : ""
                }`}
                style={app.recommended ? { borderColor: category.color, backgroundColor: category.color + "15" } : {}}
              >
                {/* App icon placeholder */}
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: category.color + "20" }}
                >
                  <Ionicons name={category.icon as any} size={22} color={category.color} />
                </View>

                <View className="flex-1">
                  {app.recommended && (
                    <View className="self-start px-2 py-0.5 rounded mb-1" style={{ backgroundColor: category.color }}>
                      <Text variant="label" color="inverse" className="text-[8px]">RECOMMENDED</Text>
                    </View>
                  )}
                  <Text variant="bodyMedium" className="text-grey-900">{app.name}</Text>
                  <Text variant="caption" color="muted">{app.description}</Text>
                </View>

                <Pressable
                  className="bg-grey-900 px-4 py-2 rounded-full"
                  onPress={() => handleDownload(app.id, app.name)}
                >
                  <Text variant="captionMedium" color="inverse">Download</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center py-16">
            <Text variant="body" color="muted">Coming soon</Text>
          </View>
        )}

        {/* Affiliate disclosure */}
        {category.apps.length > 0 && (
          <View className="flex-row items-start gap-2 px-1 mt-4">
            <Ionicons name="information-circle-outline" size={14} color="#94a3b8" style={{ marginTop: 1 }} />
            <Text variant="caption" color="muted" className="flex-1 text-[11px]">
              Some links may earn HOMii a commission at no extra cost to you.
            </Text>
          </View>
        )}

        {/* Tip card */}
        {category.tip && (
          <View className="bg-primary-50 rounded-2xl p-5 mt-4 mb-6 flex-row gap-3">
            <Ionicons name="information-circle-outline" size={22} color="#F59E0B" />
            <View className="flex-1">
              <Text variant="bodyMedium" className="text-grey-900">
                {category.tip.title}
              </Text>
              <Text variant="body" color="muted" className="mt-1">
                {category.tip.description}
              </Text>
            </View>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
