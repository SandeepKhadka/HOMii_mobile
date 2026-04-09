import { useEffect, useState, useCallback } from "react";
import { View, Pressable, ScrollView, ActivityIndicator, Share } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { api, AmbassadorStats, AmbassadorReferral } from "@/lib/api";
import { useAlert } from "@/contexts/AlertContext";
import GradientHeader, { HEADER_GRADIENTS } from "@/components/GradientHeader";
import { useTranslation } from "react-i18next";

export default function AmbassadorDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const [stats, setStats] = useState<AmbassadorStats | null>(null);
  const [referrals, setReferrals] = useState<AmbassadorReferral[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [statsData, referralsData] = await Promise.all([
        api.getAmbassadorStats(),
        api.getAmbassadorReferrals(),
      ]);
      setStats(statsData);
      setReferrals(referralsData ?? []);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const referralLink = stats ? `https://homii.link/r/${stats.referralCode}` : "";

  const copyLink = async () => {
    if (!referralLink) return;
    await Clipboard.setStringAsync(referralLink);
    showAlert(t("ambassadorDashboard.copied"), t("ambassadorDashboard.copiedMessage"), undefined, "success");
  };

  const shareLink = async () => {
    if (!referralLink) return;
    try {
      await Share.share({
        message: `Join me on HOMii — the essential app for international students in the UK! ${referralLink}`,
        url: referralLink,
        title: "HOMii Referral",
      });
    } catch {
      // user cancelled
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.teal.DEFAULT} />
      </View>
    );
  }

  if (!stats) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Ionicons name="alert-circle-outline" size={48} color={Colors.grey[400]} />
        <Text variant="h3" className="text-grey-700 text-center mt-4">
          {t("ambassadorDashboard.noData")}
        </Text>
        <Text variant="body" color="muted" className="text-center mt-2">
          {t("ambassadorDashboard.noDataMessage")}
        </Text>
        <Pressable
          className="mt-6 px-6 py-3 rounded-2xl"
          style={{ backgroundColor: Colors.teal.DEFAULT }}
          onPress={() => router.replace("/ambassador/signup" as any)}
        >
          <Text color="inverse" style={{ fontFamily: "BricolageGrotesque_600SemiBold", fontSize: 15 }}>
            {t("ambassadorDashboard.applyNow")}
          </Text>
        </Pressable>
      </View>
    );
  }

  const statusColor = stats.status === "APPROVED"
    ? Colors.success.DEFAULT
    : stats.status === "REJECTED"
    ? Colors.error.DEFAULT
    : "#F59E0B";

  const statusBg = stats.status === "APPROVED" ? "#F0FDF4" : stats.status === "REJECTED" ? "#FFF1F2" : "#FFF7ED";

  const statusLabel = stats.status === "APPROVED"
    ? t("ambassadorDashboard.statusApproved")
    : stats.status === "REJECTED"
    ? t("ambassadorDashboard.statusRejected")
    : t("ambassadorDashboard.statusPending");

  return (
    <View className="flex-1 bg-white">
      <GradientHeader colors={HEADER_GRADIENTS.ambassadors} style={{ paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text color="inverse" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 20, lineHeight: 28, marginLeft: 8 }}>
            {t("ambassadorDashboard.title")}
          </Text>
        </View>
      </GradientHeader>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View className="px-6 pt-6 gap-4">
          {/* Status badge */}
          <View className="flex-row items-center gap-2 px-4 py-3 rounded-xl" style={{ backgroundColor: statusBg }}>
            <Ionicons
              name={stats.status === "APPROVED" ? "checkmark-circle" : stats.status === "REJECTED" ? "close-circle" : "time-outline"}
              size={20}
              color={statusColor}
            />
            <Text variant="bodyMedium" style={{ color: statusColor }}>
              {t("ambassadorDashboard.status", { status: statusLabel })}
            </Text>
          </View>

          {/* Referral link */}
          {stats.status === "APPROVED" && (
            <View className="gap-1.5">
              <Text variant="caption" color="muted">{t("ambassadorDashboard.referralLink")}</Text>
              <Pressable
                className="flex-row items-center border border-grey-200 rounded-xl px-4 py-3"
                onPress={copyLink}
              >
                <Text variant="body" className="flex-1 text-grey-800" numberOfLines={1}>
                  {referralLink}
                </Text>
                <Ionicons name="copy-outline" size={20} color={Colors.grey[400]} />
              </Pressable>
            </View>
          )}

          {/* Total referrals card */}
          <View className="rounded-2xl px-5 py-4 flex-row items-center gap-4" style={{ backgroundColor: "#F0FDF9" }}>
            <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: Colors.teal.light }}>
              <Ionicons name="people" size={24} color={Colors.teal.DEFAULT} />
            </View>
            <View>
              <Text variant="caption" color="muted">{t("ambassadorDashboard.totalReferrals")}</Text>
              <Text className="text-grey-900" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 28, lineHeight: 36 }}>
                {stats.totalReferrals}
              </Text>
              <Text variant="caption" color="muted">
                {t("ambassadorDashboard.confirmed", { count: stats.confirmedReferrals })}
              </Text>
            </View>
          </View>

          {/* Earnings row */}
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl px-4 py-4" style={{ backgroundColor: "#EFF6FF" }}>
              <View className="w-10 h-10 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: Colors.primary[100] }}>
                <Ionicons name="wallet" size={20} color={Colors.primary[500]} />
              </View>
              <Text variant="caption" color="muted">{t("ambassadorDashboard.totalEarned")}</Text>
              <Text className="text-grey-900" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 22, lineHeight: 30 }}>
                £{stats.totalEarnings.toFixed(2)}
              </Text>
            </View>
            <View className="flex-1 rounded-2xl px-4 py-4 bg-grey-50">
              <View className="w-10 h-10 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: "#FFF7ED" }}>
                <Ionicons name="hourglass-outline" size={20} color="#F59E0B" />
              </View>
              <Text variant="caption" color="muted">{t("ambassadorDashboard.pending")}</Text>
              <Text className="text-grey-900" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 22, lineHeight: 30 }}>
                £{stats.pendingEarnings.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Share buttons */}
          {stats.status === "APPROVED" && (
            <View className="flex-row gap-3 mt-2">
              <Pressable
                className="flex-1 flex-row items-center justify-center gap-2 py-4 rounded-2xl"
                style={{ backgroundColor: Colors.teal.DEFAULT }}
                onPress={shareLink}
              >
                <Ionicons name="share-social-outline" size={20} color="#fff" />
                <Text color="inverse" style={{ fontFamily: "BricolageGrotesque_600SemiBold", fontSize: 15 }}>
                  {t("ambassadorDashboard.share")}
                </Text>
              </Pressable>
              <Pressable
                className="flex-row items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-grey-100"
                onPress={copyLink}
              >
                <Ionicons name="copy-outline" size={20} color={Colors.grey[600]} />
              </Pressable>
            </View>
          )}

          {/* Info note */}
          <View className="bg-grey-50 rounded-xl px-4 py-3 flex-row gap-2">
            <Ionicons name="information-circle-outline" size={18} color={Colors.grey[400]} style={{ marginTop: 1 }} />
            <Text variant="caption" color="muted" className="flex-1">
              {t("ambassadorDashboard.payoutInfo")}
            </Text>
          </View>

          {/* Referral history */}
          <View className="gap-3">
            <Text variant="caption" color="muted" className="tracking-widest">
              {t("ambassadorDashboard.referralHistory").toUpperCase()}
            </Text>
            {referrals.length === 0 ? (
              <View className="bg-grey-50 rounded-2xl px-4 py-6 items-center gap-2">
                <Ionicons name="people-outline" size={32} color={Colors.grey[300]} />
                <Text variant="body" color="muted" className="text-center">
                  {t("ambassadorDashboard.noReferrals")}
                </Text>
                <Text variant="caption" color="muted" className="text-center">
                  {t("ambassadorDashboard.noReferralsMessage")}
                </Text>
              </View>
            ) : (
              <View className="bg-white rounded-2xl overflow-hidden">
                {referrals.map((ref, idx) => {
                  const statusColor =
                    ref.status === "PAID"
                      ? Colors.success.DEFAULT
                      : ref.status === "CONFIRMED"
                      ? Colors.primary[500]
                      : Colors.grey[400];
                  const statusLabel =
                    ref.status === "PAID"
                      ? t("ambassadorDashboard.referralStatusPaid")
                      : ref.status === "CONFIRMED"
                      ? t("ambassadorDashboard.referralStatusConfirmed")
                      : t("ambassadorDashboard.referralStatusPending");
                  const dateStr = new Date(ref.createdAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <View
                      key={ref.id}
                      className={`flex-row items-center px-4 py-3 ${idx < referrals.length - 1 ? "border-b border-grey-100" : ""}`}
                    >
                      <View className="w-9 h-9 rounded-full bg-grey-100 items-center justify-center mr-3">
                        <Ionicons name="person-outline" size={18} color={Colors.grey[500]} />
                      </View>
                      <View className="flex-1">
                        <Text variant="body" className="text-grey-800">
                          {t("ambassadorDashboard.referralDate", { date: dateStr })}
                        </Text>
                      </View>
                      <View className="px-2 py-1 rounded-full" style={{ backgroundColor: `${statusColor}18` }}>
                        <Text variant="caption" style={{ color: statusColor, fontFamily: "BricolageGrotesque_600SemiBold" }}>
                          {statusLabel}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
