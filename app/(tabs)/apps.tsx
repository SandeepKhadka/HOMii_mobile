import { useState, useCallback, useEffect } from "react";
import { View, ScrollView, Pressable, ActivityIndicator, Linking } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientHeader, { HEADER_GRADIENTS } from "@/components/GradientHeader";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/contexts/CategoriesContext";

// "Your Apps" — apps the user actually has installed on the device. We probe
// each partner app's deepLinkScheme via Linking.canOpenURL; apps without a
// configured scheme are unreachable from here (admin needs to set deepLinkScheme
// on the App record). Tap on a row opens the parent category for context.
export default function YourAppsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { categories, loading: categoriesLoading } = useCategories();
  const [installedIds, setInstalledIds] = useState<Set<string>>(new Set());
  const [probing, setProbing] = useState(true);

  // Re-probe on every tab focus so the list updates after the user installs
  // an app from a category page.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setProbing(true);
      const probeAll = async () => {
        const probes: Promise<string | null>[] = [];
        for (const cat of categories) {
          for (const app of cat.apps) {
            const scheme = app.deepLinkScheme;
            if (!scheme || scheme.startsWith("http")) continue;
            probes.push(
              Linking.canOpenURL(scheme)
                .then((ok) => (ok ? app.id : null))
                .catch(() => null),
            );
          }
        }
        const results = await Promise.all(probes);
        if (!cancelled) {
          setInstalledIds(new Set(results.filter((id): id is string => !!id)));
          setProbing(false);
        }
      };
      probeAll();
      return () => { cancelled = true; };
    }, [categories]),
  );

  // Group installed apps by category, preserving category sort order.
  type Row = {
    categoryId: string;
    categoryTitle: string;
    categoryIcon: string | null;
    categoryColor: string;
    apps: typeof categories[number]["apps"];
  };
  const sections: Row[] = [];
  for (const cat of categories) {
    const installed = cat.apps.filter((a) => a.id && installedIds.has(a.id));
    if (installed.length === 0) continue;
    sections.push({
      categoryId: cat.id,
      categoryTitle: cat.title,
      categoryIcon: cat.icon,
      categoryColor: cat.color,
      apps: installed,
    });
  }

  const loading = probing || categoriesLoading;
  const hasApps = sections.length > 0;

  return (
    <View className="flex-1 bg-background">
      <GradientHeader
        colors={HEADER_GRADIENTS.apps}
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 24,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Text color="inverse" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 22, lineHeight: 28 }}>
          {t("yourApps.title")}
        </Text>
        <Text variant="body" color="inverse" className="opacity-80 mt-0.5">
          {t("yourApps.subtitle")}
        </Text>
      </GradientHeader>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
      ) : !hasApps ? (
        <View className="flex-1 items-center justify-center px-8 gap-4">
          <View className="w-20 h-20 rounded-full bg-primary-50 items-center justify-center">
            <Ionicons name="apps-outline" size={36} color={Colors.primary[500]} />
          </View>
          <Text
            className="text-center text-grey-900"
            style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 20 }}
          >
            {t("yourApps.emptyTitle")}
          </Text>
          <Text variant="body" color="muted" className="text-center" style={{ lineHeight: 22 }}>
            {t("yourApps.emptyMessage")}
          </Text>
          <View className="w-full mt-2">
            <Button
              variant="primary"
              size="lg"
              label={t("yourApps.browse")}
              fullWidth
              onPress={() => router.push("/browse" as any)}
            />
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 24, paddingBottom: insets.bottom + 32 }}
        >
          <View className="gap-6">
            {sections.map((section) => (
              <View key={section.categoryId} className="gap-3">
                <View className="flex-row items-center gap-2">
                  <View
                    className="w-7 h-7 rounded-lg items-center justify-center"
                    style={{ backgroundColor: section.categoryColor + "20" }}
                  >
                    <Ionicons
                      name={(section.categoryIcon || "apps-outline") as any}
                      size={15}
                      color={section.categoryColor}
                    />
                  </View>
                  <Text
                    className="text-grey-900"
                    style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 16 }}
                  >
                    {section.categoryTitle}
                  </Text>
                </View>
                <View className="bg-white rounded-2xl overflow-hidden" style={{ elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 }}>
                  {section.apps.map((app, idx) => (
                    <Pressable
                      key={app.id}
                      onPress={() => {
                        if (app.deepLinkScheme) {
                          Linking.openURL(app.deepLinkScheme).catch(() =>
                            router.push(`/category/${section.categoryId}` as any),
                          );
                        } else {
                          router.push(`/category/${section.categoryId}` as any);
                        }
                      }}
                      className="flex-row items-center px-4 py-3.5"
                      style={idx < section.apps.length - 1 ? { borderBottomWidth: 1, borderBottomColor: Colors.grey[100] } : {}}
                    >
                      <View
                        className="w-9 h-9 rounded-lg items-center justify-center mr-3"
                        style={{ backgroundColor: section.categoryColor + "20" }}
                      >
                        <Ionicons name={(section.categoryIcon || "apps-outline") as any} size={18} color={section.categoryColor} />
                      </View>
                      <View className="flex-1">
                        <Text variant="bodyMedium" className="text-grey-900">{app.name}</Text>
                        {app.description ? (
                          <Text variant="caption" color="muted" numberOfLines={1}>{app.description}</Text>
                        ) : null}
                      </View>
                      <Text variant="caption" style={{ color: section.categoryColor, fontFamily: "BricolageGrotesque_600SemiBold" }}>
                        {t("category.open")}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View className="mt-8">
            <Button
              variant="ghost"
              size="lg"
              label={t("yourApps.findMore")}
              fullWidth
              leftIcon={<Ionicons name="add-circle-outline" size={20} color={Colors.primary[600]} />}
              onPress={() => router.push("/browse" as any)}
              className="border border-primary-200 rounded-2xl"
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
