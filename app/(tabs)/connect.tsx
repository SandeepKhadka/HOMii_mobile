import { useState, useCallback, useMemo } from "react";
import { View, ScrollView, Pressable, ActivityIndicator, Linking, Image, TextInput } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientHeader, { HEADER_GRADIENTS } from "@/components/GradientHeader";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { ConnectSocials } from "@/types/database";

interface ConnectProfileRow {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  university: string | null;
  course: string | null;
  nationality: string | null;
  year_of_study: string | null;
  socials: ConnectSocials | null;
}

type FilterKey = "university" | "course" | "nationality";

// Discovery tab — lists other students who have opted in via Connect Profile.
// Filters: university (default = own), course (search), nationality. Tapping
// a social icon opens the external app/site via Linking.
export default function ConnectScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [profiles, setProfiles] = useState<ConnectProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterUniversity, setFilterUniversity] = useState<string | null>(profile?.university ?? null);
  const [courseQuery, setCourseQuery] = useState("");
  const [filterNationality, setFilterNationality] = useState<string | null>(null);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.rpc("list_connect_profiles", {
      filter_university: filterUniversity,
      filter_course: courseQuery.trim() || null,
      filter_nationality: filterNationality,
      filter_year: null,
      page_limit: 50,
    });
    if (err) {
      setError(err.message);
      setProfiles([]);
    } else {
      setProfiles((data ?? []) as ConnectProfileRow[]);
    }
    setLoading(false);
  }, [filterUniversity, courseQuery, filterNationality]);

  useFocusEffect(
    useCallback(() => {
      loadProfiles();
    }, [loadProfiles]),
  );

  // Distinct nationalities pulled from the current result set, used to power
  // the nationality filter chips. Cheap because the result set is capped at 50.
  const nationalityOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of profiles) if (p.nationality) set.add(p.nationality);
    return Array.from(set).slice(0, 10);
  }, [profiles]);

  const openSocial = (kind: keyof ConnectSocials, value: string) => {
    let url: string | null = null;
    const v = value.replace(/^@/, "").trim();
    switch (kind) {
      case "instagram":   url = `https://instagram.com/${v}`; break;
      case "facebook":    url = `https://facebook.com/${v}`; break;
      case "twitter":     url = `https://x.com/${v}`; break;
      case "linkedin":    url = `https://linkedin.com/in/${v}`; break;
      case "custom_url":  url = v.startsWith("http") ? v : `https://${v}`; break;
      default: return;
    }
    if (url) Linking.openURL(url).catch(() => {});
  };

  // Empty state for users who haven't opted in themselves — encourage them
  // to be discoverable too (network effect).
  const showOptInHint = !profile?.connect_enabled;

  return (
    <View className="flex-1 bg-background">
      <GradientHeader
        colors={HEADER_GRADIENTS.ambassadors}
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 20,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Text color="inverse" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 22, lineHeight: 28 }}>
          {t("connect.title")}
        </Text>
        <Text variant="body" color="inverse" className="opacity-80 mt-0.5">
          {t("connect.subtitle")}
        </Text>
      </GradientHeader>

      {showOptInHint && (
        <Pressable
          onPress={() => router.push("/connect-profile" as any)}
          className="mx-6 mt-4 bg-primary-50 rounded-2xl p-4 flex-row items-center gap-3"
        >
          <View className="w-10 h-10 rounded-xl bg-white items-center justify-center">
            <Ionicons name="add" size={22} color={Colors.primary[500]} />
          </View>
          <View className="flex-1">
            <Text variant="bodyMedium" className="text-grey-900">{t("connect.optInBanner")}</Text>
            <Text variant="caption" color="muted">{t("connect.optInBannerSubtitle")}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.grey[400]} />
        </Pressable>
      )}

      {/* Filter row: course search + university toggle + nationality chips */}
      <View className="px-6 pt-4 gap-3">
        <View className="flex-row items-center bg-white border border-grey-200 rounded-xl h-11 px-4 gap-2">
          <Ionicons name="search-outline" size={16} color={Colors.grey[400]} />
          <TextInput
            placeholder={t("connect.courseSearchPlaceholder")}
            placeholderTextColor={Colors.grey[400]}
            value={courseQuery}
            onChangeText={setCourseQuery}
            className="flex-1 text-grey-900 text-sm"
            returnKeyType="search"
          />
          {courseQuery.length > 0 && (
            <Pressable onPress={() => setCourseQuery("")}>
              <Ionicons name="close-circle" size={16} color={Colors.grey[400]} />
            </Pressable>
          )}
        </View>

        <View className="flex-row gap-2 flex-wrap">
          <FilterChip
            label={t("connect.filterAll")}
            active={filterUniversity === null}
            onPress={() => setFilterUniversity(null)}
          />
          {profile?.university && (
            <FilterChip
              label={t("connect.filterMyUni")}
              active={filterUniversity === profile.university}
              onPress={() => setFilterUniversity(profile.university!)}
            />
          )}
          {filterNationality && (
            <FilterChip
              label={filterNationality}
              active
              onPress={() => setFilterNationality(null)}
              dismissible
            />
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1 mt-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 32 }}
      >
        {loading ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color={Colors.primary[500]} />
          </View>
        ) : error ? (
          <View className="items-center py-12 gap-3">
            <Ionicons name="cloud-offline-outline" size={48} color={Colors.grey[400]} />
            <Text variant="body" color="muted" className="text-center">{t("connect.loadError")}</Text>
            <Button variant="ghost" size="md" label={t("common.retry")} onPress={loadProfiles} />
          </View>
        ) : profiles.length === 0 ? (
          <View className="items-center py-12 gap-3">
            <Ionicons name="people-outline" size={48} color={Colors.grey[400]} />
            <Text variant="bodyMedium" className="text-center text-grey-900">{t("connect.emptyTitle")}</Text>
            <Text variant="caption" color="muted" className="text-center px-6" style={{ lineHeight: 18 }}>{t("connect.emptyMessage")}</Text>
          </View>
        ) : (
          <View className="gap-3">
            {nationalityOptions.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} className="-mx-2 px-2 mb-1">
                {nationalityOptions.map((nat) => (
                  <FilterChip
                    key={nat}
                    label={nat}
                    active={filterNationality === nat}
                    onPress={() => setFilterNationality(filterNationality === nat ? null : nat)}
                    compact
                  />
                ))}
              </ScrollView>
            )}

            {profiles.map((p) => (
              <ProfileCard key={p.id} profile={p} onOpenSocial={openSocial} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function FilterChip({
  label,
  active,
  onPress,
  dismissible,
  compact,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  dismissible?: boolean;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-full"
      style={{
        backgroundColor: active ? Colors.primary[500] : Colors.grey[100],
        paddingHorizontal: compact ? 12 : 14,
        paddingVertical: compact ? 6 : 7,
        gap: 4,
      }}
    >
      <Text
        variant="caption"
        style={{
          color: active ? "#fff" : Colors.grey[700],
          fontFamily: "BricolageGrotesque_600SemiBold",
        }}
      >
        {label}
      </Text>
      {dismissible && active && (
        <Ionicons name="close" size={12} color="#fff" />
      )}
    </Pressable>
  );
}

function ProfileCard({
  profile,
  onOpenSocial,
}: {
  profile: ConnectProfileRow;
  onOpenSocial: (kind: keyof ConnectSocials, value: string) => void;
}) {
  const s = profile.socials ?? {};
  const initial = (profile.full_name ?? "?").charAt(0).toUpperCase();
  return (
    <View
      className="bg-white rounded-2xl p-4 flex-row gap-3"
      style={{ elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 }}
    >
      {profile.avatar_url ? (
        <Image source={{ uri: profile.avatar_url }} style={{ width: 56, height: 56, borderRadius: 28 }} />
      ) : (
        <View className="w-14 h-14 rounded-full bg-primary-50 items-center justify-center">
          <Text style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 22, color: Colors.primary[500] }}>{initial}</Text>
        </View>
      )}
      <View className="flex-1">
        <Text variant="bodyMedium" className="text-grey-900">{profile.full_name ?? "Student"}</Text>
        {profile.course || profile.year_of_study ? (
          <Text variant="caption" color="muted">
            {[profile.course, profile.year_of_study].filter(Boolean).join(" · ")}
          </Text>
        ) : null}
        {profile.university ? (
          <Text variant="caption" color="muted">{profile.university}</Text>
        ) : null}
        {profile.nationality ? (
          <Text variant="caption" color="muted" className="mt-0.5">{profile.nationality}</Text>
        ) : null}

        <View className="flex-row flex-wrap gap-2 mt-3">
          {s.instagram   && <SocialIcon icon="logo-instagram" color="#E4405F" onPress={() => onOpenSocial("instagram", s.instagram!)} />}
          {s.facebook    && <SocialIcon icon="logo-facebook"  color="#1877F2" onPress={() => onOpenSocial("facebook", s.facebook!)} />}
          {s.twitter     && <SocialIcon icon="logo-twitter"   color="#000000" onPress={() => onOpenSocial("twitter", s.twitter!)} />}
          {s.linkedin    && <SocialIcon icon="logo-linkedin"  color="#0A66C2" onPress={() => onOpenSocial("linkedin", s.linkedin!)} />}
          {s.custom_url  && (
            <Pressable
              onPress={() => onOpenSocial("custom_url", s.custom_url!)}
              className="flex-row items-center px-3 py-1.5 rounded-full bg-grey-100 gap-1.5"
            >
              <Ionicons name="link-outline" size={14} color={Colors.grey[700]} />
              <Text variant="caption" style={{ color: Colors.grey[700], fontFamily: "BricolageGrotesque_500Medium" }}>
                {s.custom_label || "Link"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

function SocialIcon({
  icon,
  color,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-9 h-9 rounded-full items-center justify-center"
      style={{ backgroundColor: color + "15" }}
    >
      <Ionicons name={icon} size={18} color={color} />
    </Pressable>
  );
}
