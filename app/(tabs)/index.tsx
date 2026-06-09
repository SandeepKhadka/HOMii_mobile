import { useState, useCallback, useEffect } from "react";
import { View, ScrollView, Pressable, ActivityIndicator, FlatList, Linking, Share, Image, ImageBackground } from "react-native";
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
import { useTranslation } from "react-i18next";
import { LINKS } from "@/constants/links";
import { capture } from "@/lib/analytics";
import { getUniversityLogo } from "@/constants/universityLogos";
import Svg, { Circle as SvgCircle } from "react-native-svg";


export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const { categories, phases, loading: categoriesLoading } = useCategories();
  const { t } = useTranslation();
  const [completedTotal, setCompletedTotal] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [uniResources, setUniResources] = useState<ApiUniversity['resourceLinks']>(null);
  const [uniCity, setUniCity] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.university) return;
    api.getUniversities().then((unis) => {
      const match = unis.find(
        (u) => u.name.toLowerCase() === profile.university!.toLowerCase()
      );
      setUniResources(match?.resourceLinks ?? null);
      setUniCity(match?.city ?? null);
    }).catch(() => {});
  }, [profile?.university]);

  // Counted in CATEGORIES, not individual checklist items. A category is
  // "done" only when every one of its checklist items is present in the
  // completed_items array (matches the green-circle toggle behavior).
  const TOTAL_CATEGORIES = categories.length;

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("onboarding_progress")
      .select("category_id, completed_items")
      .eq("user_id", user.id);
    const progressByCat: Record<string, string[]> = {};
    for (const row of (data ?? []) as { category_id: string; completed_items: string[] | null }[]) {
      progressByCat[row.category_id] = row.completed_items ?? [];
    }
    const done = categories.reduce((sum, cat) => {
      const items = progressByCat[cat.id] ?? [];
      const isDone = cat.checklistItems.length > 0 && cat.checklistItems.every((i) => items.includes(i));
      return sum + (isDone ? 1 : 0);
    }, 0);
    setCompletedTotal(done);
    setProgressLoaded(true);
  }, [user, categories]);

  useFocusEffect(
    useCallback(() => {
      fetchProgress();
    }, [fetchProgress])
  );

  const progressPercent = TOTAL_CATEGORIES > 0 ? Math.round((completedTotal / TOTAL_CATEGORIES) * 100) : 0;
  // Hide the live progress UI until BOTH categories and the user's progress
  // rows have loaded, otherwise the bar flashes a wrong percent (often 100%)
  // for the first frame before the DB query resolves.
  const progressReady = !categoriesLoading && progressLoaded && TOTAL_CATEGORIES > 0;
  const rawFirstName = profile?.full_name?.split(" ")[0] || "Student";
  const firstName = rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1);

  // Filter categories by selected phase; if no phase selected, show all
  const activePhase = phases.find((p) => p.id === activePhaseId);
  const visibleCategories = activePhase
    ? categories.filter((cat) => activePhase.categories.includes(cat.id))
    : categories;

  return (
    <View className="flex-1 bg-background">
      {/* Hero header — light lavender London skyline banner.
          Layout mirrors the design Luke sent: wordmark top-left, avatar with
          online dot top-right, large dark greeting + subtitle, then a white
          university card. Dark text reads cleanly on the lavender bg. */}
      <ImageBackground
        source={require("@/assets/images/top-banner.jpeg")}
        resizeMode="cover"
        imageStyle={{ borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}
        style={{ paddingTop: insets.top + 12, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}
      >
        <View className="flex-row items-center justify-between">
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 95, height: 28 }}
            resizeMode="contain"
          />
          <Pressable
            onPress={() => router.push("/(tabs)/profile" as any)}
            style={{ position: "relative" }}
          >
            {profile?.avatar_url ? (
              <>
                <View
                  className="w-14 h-14 rounded-full overflow-hidden bg-white"
                  style={{ elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, borderWidth: 2, borderColor: "#fff" }}
                >
                  <Image
                    source={{ uri: profile.avatar_url }}
                    style={{ width: 52, height: 52, borderRadius: 26 }}
                  />
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: "#22C55E",
                    borderWidth: 2,
                    borderColor: "#fff",
                  }}
                />
              </>
            ) : (
              /* Default avatar already has the ring + green dot baked in,
                 so render uncropped at a slightly larger size. */
              <Image
                source={require("@/assets/images/default-avatar.png")}
                style={{ width: 48, height: 48 }}
                resizeMode="contain"
              />
            )}
          </Pressable>
        </View>

        <Text
          className="mt-4"
          style={{
            fontFamily: "BricolageGrotesque_700Bold",
            fontSize: 24,
            lineHeight: 30,
            color: Colors.grey[900],
          }}
        >
          {t("home.hello", { name: firstName })} 👋
        </Text>
        <Text
          className="mt-1"
          style={{
            fontSize: 13,
            color: Colors.grey[600],
          }}
        >
          {t("home.welcomeSubtitle")}
        </Text>

        {profile?.university ? (
          <Pressable
            onPress={() => router.push("/settings" as any)}
            className="flex-row items-center bg-white rounded-2xl px-3 py-2.5 mt-4"
            style={{
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
            }}
          >
            {(() => {
              const uniLogo = getUniversityLogo(profile.university);
              return uniLogo ? (
                <Image
                  source={uniLogo}
                  style={{ width: 36, height: 36, marginRight: 10 }}
                  resizeMode="contain"
                />
              ) : (
                <View className="w-9 h-9 rounded-lg bg-primary-100 items-center justify-center mr-2.5">
                  <Ionicons name="school" size={20} color={Colors.primary[600]} />
                </View>
              );
            })()}
            <View className="flex-1">
              <Text
                style={{
                  fontFamily: "BricolageGrotesque_700Bold",
                  fontSize: 14,
                  color: Colors.grey[900],
                }}
                numberOfLines={1}
              >
                {profile.university}
              </Text>
              {uniCity ? (
                <Text variant="caption" color="muted" numberOfLines={1}>
                  {uniCity}
                </Text>
              ) : null}
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.grey[400]} />
          </Pressable>
        ) : null}
      </ImageBackground>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 -mt-4">
        {/* Setup progress / Continue Setup banner.
            Renders a skeleton placeholder until both categories and the user's
            progress rows finish loading — otherwise the bar would briefly show
            a wrong percentage on first mount. */}
        {progressReady ? (
          <Pressable
            onPress={() => router.push("/(tabs)/setup" as any)}
            className="mx-6 mt-6 mb-4 rounded-2xl px-5 py-5 flex-row items-center"
            style={{
              backgroundColor: progressPercent === 100 ? "#F0FDF4" : Colors.primary[500],
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            {/* Circular progress ring with percent in the center */}
            <View style={{ width: 76, height: 76, marginRight: 14 }}>
              <Svg width={76} height={76}>
                {/* Track */}
                <SvgCircle
                  cx={38}
                  cy={38}
                  r={32}
                  stroke={progressPercent === 100 ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.3)"}
                  strokeWidth={6}
                  fill="none"
                />
                {/* Filled arc */}
                <SvgCircle
                  cx={38}
                  cy={38}
                  r={32}
                  stroke={progressPercent === 100 ? Colors.success.DEFAULT : "#fff"}
                  strokeWidth={6}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - progressPercent / 100)}`}
                  transform="rotate(-90 38 38)"
                />
              </Svg>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "BricolageGrotesque_700Bold",
                    fontSize: 16,
                    color: progressPercent === 100 ? Colors.success.DEFAULT : "#fff",
                  }}
                >
                  {progressPercent}%
                </Text>
              </View>
            </View>

            {/* Middle: title + subtitle */}
            <View className="flex-1">
              <Text
                style={{
                  fontFamily: "BricolageGrotesque_700Bold",
                  fontSize: 18,
                  color: progressPercent === 100 ? Colors.success.DEFAULT : "#fff",
                }}
              >
                {progressPercent === 100 ? t("home.allSet") : t("home.continueSetup")}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginTop: 2,
                  color: progressPercent === 100 ? Colors.success.DEFAULT : "rgba(255,255,255,0.85)",
                }}
                numberOfLines={2}
              >
                {progressPercent === 100
                  ? t("home.categoriesDone", { done: completedTotal, total: TOTAL_CATEGORIES })
                  : t("home.completeProfileForRecommendations")}
              </Text>
            </View>

            {/* Right: CTA pill */}
            <View
              className="bg-white rounded-full px-4 py-2 flex-row items-center ml-2"
              style={{ elevation: 1 }}
            >
              <Text
                style={{
                  fontFamily: "BricolageGrotesque_700Bold",
                  fontSize: 13,
                  color: Colors.primary[600],
                }}
              >
                {t("home.continue")}
              </Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.primary[600]} style={{ marginLeft: 4 }} />
            </View>
          </Pressable>
        ) : (
          <View
            className="mx-6 mt-6 mb-4 rounded-2xl px-5 py-5"
            style={{
              backgroundColor: Colors.primary[500],
              opacity: 0.6,
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          >
            <View className="flex-row justify-between items-center mb-3">
              <View className="h-4 w-32 rounded bg-white/30" />
              <View className="h-4 w-10 rounded bg-white/30" />
            </View>
            <View className="h-2 rounded-full bg-white/20" />
            <View className="h-3 w-24 rounded bg-white/20 mt-2" />
          </View>
        )}

        {/* Essential Apps — dynamic from API */}
        <View className="mt-4">
          <View className="flex-row justify-between items-center mb-3 px-6">
            <Text variant="h3" className="font-heading text-grey-900">
              {t("home.essentialApps").toUpperCase()}
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/apps" as any)}>
              <Text variant="bodyMedium" color="muted">{t("home.viewAll")}</Text>
            </Pressable>
          </View>

          {/* Phase filter tabs */}
          {phases.length > 0 && (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[{ id: null, title: t("common.all") }, ...phases.map((p) => ({ id: p.id, title: p.title }))]}
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
                const hasRecommended = cat.apps.some((a) => a.recommended);
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
                          <Ionicons name="star" size={10} color={cat.color} />
                          <Text variant="caption" style={{ color: cat.color, fontSize: 10, fontFamily: "BricolageGrotesque_600SemiBold" }}>
                            {t("home.homiiPick")}
                          </Text>
                        </View>
                      )}
                    </LinearGradient>
                    <View className="p-3">
                      <Text variant="bodyMedium" className="text-grey-800">{cat.title}</Text>
                      {cat.apps.length > 0 && (
                        <Text variant="caption" color="muted">{t("apps.appsCount", { count: cat.apps.length })}</Text>
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

        {/* Refer a Friend CTA — plain share link, no referral attribution.
            For tracked ambassador referrals users go to the Ambassadors tab. */}
        <Pressable
          className="mx-6 mt-6 mb-8 rounded-2xl p-6 flex-row items-center gap-4"
          style={{ backgroundColor: Colors.navy.DEFAULT }}
          onPress={async () => {
            try {
              const result = await Share.share({
                message: t("home.referFriends.shareMessage", { url: LINKS.appShare }),
                url: LINKS.appShare,
                title: "HOMii",
              });
              if (result.action === Share.sharedAction) {
                capture('home_share_link_shared');
              }
            } catch {
              // user dismissed the share sheet
            }
          }}
        >
          <View className="w-12 h-12 rounded-xl bg-white/15 items-center justify-center">
            <Ionicons name="share-social-outline" size={24} color="#fff" />
          </View>
          <View className="flex-1">
            <Text
              color="inverse"
              style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 16, lineHeight: 22 }}
            >
              {t("home.referFriends.title")}
            </Text>
            <Text variant="caption" color="inverse" className="opacity-70 mt-0.5">
              {t("home.referFriends.subtitle")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
        </Pressable>
      </ScrollView>
    </View>
  );
}
