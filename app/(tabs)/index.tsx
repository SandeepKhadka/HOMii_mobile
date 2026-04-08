import { useState, useCallback, useEffect } from "react";
import { View, ScrollView, Pressable, ActivityIndicator, FlatList, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { supabase } from "@/lib/supabase";
import { api, ApiUniversity } from "@/lib/api";
import GradientHeader, { HEADER_GRADIENTS, lightenHex } from "@/components/GradientHeader";


export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const { categories, phases, loading: categoriesLoading } = useCategories();
  const [completedTotal, setCompletedTotal] = useState(0);
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [uniResources, setUniResources] = useState<ApiUniversity['resourceLinks']>(null);

  useEffect(() => {
    if (!profile?.university) return;
    api.getUniversities().then((unis) => {
      const match = unis.find(
        (u) => u.name.toLowerCase() === profile.university!.toLowerCase()
      );
      setUniResources(match?.resourceLinks ?? null);
    }).catch(() => {});
  }, [profile?.university]);

  const TOTAL_ITEMS = categories.reduce((sum, cat) => sum + cat.checklistItems.length, 0);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("onboarding_progress")
      .select("completed_items")
      .eq("user_id", user.id);
    if (data) {
      const total = data.reduce((sum: number, row: any) => {
        return sum + (row.completed_items?.length || 0);
      }, 0);
      setCompletedTotal(total);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchProgress();
    }, [fetchProgress])
  );

  const progressPercent = TOTAL_ITEMS > 0 ? Math.round((completedTotal / TOTAL_ITEMS) * 100) : 0;
  const firstName = profile?.full_name?.split(" ")[0] || "Student";

  // Filter categories by selected phase; if no phase selected, show all
  const activePhase = phases.find((p) => p.id === activePhaseId);
  const visibleCategories = activePhase
    ? categories.filter((cat) => activePhase.categories.includes(cat.id))
    : categories;

  return (
    <View className="flex-1 bg-background">
      {/* Hero header */}
      <GradientHeader colors={HEADER_GRADIENTS.home} style={{ paddingTop: insets.top + 12, paddingBottom: 32, paddingHorizontal: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View className="flex-row justify-between items-center">
          <Text variant="h3" color="inverse" className="font-heading">
            HOMii
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/profile" as any)}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Ionicons name="person-outline" size={20} color="#fff" />
          </Pressable>
        </View>
        <Text variant="subtitle" color="inverse" className="mt-1 opacity-90">
          Hello, {firstName}
        </Text>
        {profile?.university ? (
          <Text variant="caption" color="inverse" className="opacity-70 mt-0.5">
            Starter Pack for {profile.university} Students
          </Text>
        ) : null}
      </GradientHeader>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 -mt-4">
        {/* Setup progress / Continue Setup banner */}
        <Pressable
          onPress={() => router.push("/(tabs)/setup" as any)}
          className="mx-6 mt-6 mb-4 rounded-2xl px-5 py-5"
          style={{
            backgroundColor: progressPercent === 100 ? "#F0FDF4" : Colors.primary[500],
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
        >
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center gap-2">
              <Ionicons
                name={progressPercent === 100 ? "checkmark-circle" : "rocket-outline"}
                size={20}
                color={progressPercent === 100 ? Colors.success.DEFAULT : "#fff"}
              />
              <Text
                style={{
                  fontFamily: "BricolageGrotesque_600SemiBold",
                  fontSize: 15,
                  color: progressPercent === 100 ? Colors.success.DEFAULT : "#fff",
                }}
              >
                {progressPercent === 100 ? "All set up!" : "Continue Setup"}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text
                style={{
                  fontFamily: "BricolageGrotesque_700Bold",
                  fontSize: 15,
                  color: progressPercent === 100 ? Colors.success.DEFAULT : "#fff",
                }}
              >
                {progressPercent}%
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={progressPercent === 100 ? Colors.success.DEFAULT : "#fff"}
              />
            </View>
          </View>
          <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: progressPercent === 100 ? Colors.success.light : "rgba(255,255,255,0.3)" }}>
            <View
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: progressPercent === 100 ? Colors.success.DEFAULT : "#fff",
              }}
            />
          </View>
          <Text
            variant="caption"
            className="mt-2"
            style={{ color: progressPercent === 100 ? Colors.success.DEFAULT : "rgba(255,255,255,0.8)" }}
          >
            {completedTotal}/{TOTAL_ITEMS} tasks completed
          </Text>
        </Pressable>

        {/* Essential Apps — dynamic from API */}
        <View className="mt-4">
          <View className="flex-row justify-between items-center mb-3 px-6">
            <Text variant="h3" className="font-heading text-grey-900">
              ESSENTIAL APPS
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/apps" as any)}>
              <Text variant="bodyMedium" color="muted">Explore All</Text>
            </Pressable>
          </View>

          {/* Phase filter tabs */}
          {phases.length > 0 && (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[{ id: null, title: "All" }, ...phases.map((p) => ({ id: p.id, title: p.title }))]}
              keyExtractor={(item) => item.id ?? "all"}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 8, paddingBottom: 12 }}
              renderItem={({ item }) => {
                const isActive = item.id === activePhaseId;
                return (
                  <Pressable
                    onPress={() => setActivePhaseId(item.id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 7,
                      borderRadius: 20,
                      backgroundColor: isActive ? Colors.primary[500] : Colors.grey[100],
                    }}
                  >
                    <Text
                      variant="caption"
                      style={{
                        fontFamily: "BricolageGrotesque_600SemiBold",
                        color: isActive ? "#fff" : Colors.grey[600],
                      }}
                    >
                      {item.title}
                    </Text>
                  </Pressable>
                );
              }}
            />
          )}

          {categoriesLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="small" color={Colors.primary[500]} />
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-4 px-6">
              {visibleCategories.slice(0, 6).map((cat) => {
                const gradientEnd = lightenHex(cat.color, 0.6);
                return (
                  <Pressable
                    key={cat.id}
                    className="w-[47%] bg-white rounded-2xl overflow-hidden shadow-card"
                    onPress={() => router.push(`/category/${cat.id}` as any)}
                  >
                    <LinearGradient
                      colors={[cat.color, gradientEnd]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ height: 96, alignItems: "center", justifyContent: "center" }}
                    >
                      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.85)", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name={(cat.icon || "apps-outline") as any} size={26} color={cat.color} />
                      </View>
                    </LinearGradient>
                    <View className="p-3">
                      <Text variant="bodyMedium" className="text-grey-800">{cat.title}</Text>
                      {cat.apps.length > 0 && (
                        <Text variant="caption" color="muted">{cat.apps.length} app{cat.apps.length !== 1 ? "s" : ""}</Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* University Resources */}
        {uniResources && Object.values(uniResources).some(Boolean) && (
          <View className="mt-6 mx-6">
            <Text variant="h3" className="font-heading text-grey-900 mb-3">
              UNIVERSITY RESOURCES
            </Text>
            <View className="bg-white rounded-2xl overflow-hidden" style={{ elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 }}>
              {(
                [
                  { key: 'campusMap', label: 'Campus Map', icon: 'map-outline' },
                  { key: 'studentUnion', label: 'Student Union', icon: 'people-outline' },
                  { key: 'accommodation', label: 'Accommodation', icon: 'home-outline' },
                  { key: 'universityApp', label: 'University App', icon: 'phone-portrait-outline' },
                ] as { key: keyof NonNullable<ApiUniversity['resourceLinks']>; label: string; icon: string }[]
              )
                .filter(({ key }) => !!uniResources![key])
                .map(({ key, label, icon }, i, arr) => (
                  <Pressable
                    key={key}
                    onPress={() => Linking.openURL(uniResources![key]!)}
                    className="flex-row items-center px-4 py-3.5"
                    style={i < arr.length - 1 ? { borderBottomWidth: 1, borderBottomColor: Colors.grey[100] } : {}}
                  >
                    <View
                      className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                      style={{ backgroundColor: Colors.primary[50] }}
                    >
                      <Ionicons name={icon as any} size={17} color={Colors.primary[500]} />
                    </View>
                    <Text variant="bodyMedium" className="flex-1 text-grey-800">{label}</Text>
                    <Ionicons name="open-outline" size={15} color={Colors.grey[400]} />
                  </Pressable>
                ))}
            </View>
          </View>
        )}

        {/* Refer a Friend CTA */}
        <Pressable
          className="mx-6 mt-6 mb-8 rounded-2xl p-6 flex-row items-center gap-4"
          style={{ backgroundColor: Colors.navy.DEFAULT }}
          onPress={() => router.push("/(tabs)/ambassadors" as any)}
        >
          <View className="w-12 h-12 rounded-xl bg-white/15 items-center justify-center">
            <Ionicons name="gift-outline" size={24} color="#fff" />
          </View>
          <View className="flex-1">
            <Text
              color="inverse"
              style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 16, lineHeight: 22 }}
            >
              Refer Friends Coming to the UK
            </Text>
            <Text variant="caption" color="inverse" className="opacity-70 mt-0.5">
              Earn 10% commission on every referral
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
        </Pressable>
      </ScrollView>
    </View>
  );
}
