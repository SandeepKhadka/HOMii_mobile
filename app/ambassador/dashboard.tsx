import { useEffect, useState, useCallback } from "react";
import { View, Pressable, ScrollView, Alert, ActivityIndicator, Share } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { api, AmbassadorStats } from "@/lib/api";
import GradientHeader, { HEADER_GRADIENTS } from "@/components/GradientHeader";

export default function AmbassadorDashboardScreen() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<AmbassadorStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const data = await api.getAmbassadorStats();
      setStats(data);
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
    Alert.alert("Copied!", "Referral link copied to clipboard");
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
          No ambassador data found
        </Text>
        <Text variant="body" color="muted" className="text-center mt-2">
          You may not have applied yet or your application is still pending.
        </Text>
        <Pressable
          className="mt-6 px-6 py-3 rounded-2xl"
          style={{ backgroundColor: Colors.teal.DEFAULT }}
          onPress={() => router.replace("/ambassador/signup" as any)}
        >
          <Text color="inverse" style={{ fontFamily: "BricolageGrotesque_600SemiBold", fontSize: 15 }}>
            Apply Now
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

  const statusBg = stats.status === "APPROVED"
    ? "#F0FDF4"
    : stats.status === "REJECTED"
    ? "#FFF1F2"
    : "#FFF7ED";

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <GradientHeader colors={HEADER_GRADIENTS.ambassadors} style={{ paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Text
            color="inverse"
            style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 20, lineHeight: 28, marginLeft: 8 }}
          >
            Dashboard
          </Text>
        </View>
      </GradientHeader>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="px-6 pt-6 gap-4">
          {/* Status badge */}
          <View className="flex-row items-center gap-2 px-4 py-3 rounded-xl" style={{ backgroundColor: statusBg }}>
            <Ionicons
              name={stats.status === "APPROVED" ? "checkmark-circle" : stats.status === "REJECTED" ? "close-circle" : "time-outline"}
              size={20}
              color={statusColor}
            />
            <Text variant="bodyMedium" style={{ color: statusColor }}>
              Status: {stats.status === "APPROVED" ? "Approved" : stats.status === "REJECTED" ? "Rejected" : "Pending Review"}
            </Text>
          </View>

          {/* Referral link */}
          {stats.status === "APPROVED" && (
            <View className="gap-1.5">
              <Text variant="caption" color="muted">Referral link</Text>
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
          <View
            className="rounded-2xl px-5 py-4 flex-row items-center gap-4"
            style={{ backgroundColor: "#F0FDF9" }}
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: Colors.teal.light }}
            >
              <Ionicons name="people" size={24} color={Colors.teal.DEFAULT} />
            </View>
            <View>
              <Text variant="caption" color="muted">Total referrals</Text>
              <Text
                className="text-grey-900"
                style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 28, lineHeight: 36 }}
              >
                {stats.totalReferrals}
              </Text>
              <Text variant="caption" color="muted">
                {stats.confirmedReferrals} confirmed
              </Text>
            </View>
          </View>

          {/* Earnings row */}
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl px-4 py-4" style={{ backgroundColor: "#EFF6FF" }}>
              <View className="w-10 h-10 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: Colors.primary[100] }}>
                <Ionicons name="wallet" size={20} color={Colors.primary[500]} />
              </View>
              <Text variant="caption" color="muted">Total Earned</Text>
              <Text
                className="text-grey-900"
                style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 22, lineHeight: 30 }}
              >
                £{stats.totalEarnings.toFixed(2)}
              </Text>
            </View>
            <View className="flex-1 rounded-2xl px-4 py-4 bg-grey-50">
              <View className="w-10 h-10 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: "#FFF7ED" }}>
                <Ionicons name="hourglass-outline" size={20} color="#F59E0B" />
              </View>
              <Text variant="caption" color="muted">Pending</Text>
              <Text
                className="text-grey-900"
                style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 22, lineHeight: 30 }}
              >
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
                  Share
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
              Payouts are processed monthly. Earnings are calculated as 10% of confirmed conversions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
