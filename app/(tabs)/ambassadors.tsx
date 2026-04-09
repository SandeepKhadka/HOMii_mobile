import { useState, useCallback } from "react";
import { View, Pressable, ActivityIndicator, Share } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api, AmbassadorStats } from "@/lib/api";
import { capture } from "@/lib/analytics";
import GradientHeader, { HEADER_GRADIENTS } from "@/components/GradientHeader";
import { useTranslation } from "react-i18next";

const WHAT_YOU_DO = [
  "Share HOMii with students at your university",
  "Help new students discover essential services",
  "Promote useful tools like SIM, banking and more",
];

const WHAT_YOU_GET = [
  "Earn real money from referrals",
  "Track your performance in your dashboard",
  "Build experience for your CV",
];

export default function AmbassadorsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [stats, setStats] = useState<AmbassadorStats | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setCheckingStatus(true);
      api.getAmbassadorStats()
        .then(setStats)
        .catch(() => setStats(null))
        .finally(() => setCheckingStatus(false));
    }, [])
  );

  const shareReferralLink = async () => {
    if (!stats?.referralCode) return;
    const link = `https://homii.link/r/${stats.referralCode}`;
    try {
      const result = await Share.share({
        message: `Join me on HOMii — the essential app for international students in the UK! ${link}`,
        url: link,
        title: "HOMii Referral",
      });
      if (result.action === Share.sharedAction) {
        capture('referral_link_shared', { referral_code: stats.referralCode });
      }
    } catch {
      // user cancelled
    }
  };

  const isAmbassador = stats !== null;
  const isPending = stats?.status === "PENDING";
  const isApproved = stats?.status === "APPROVED";

  return (
    <View className="flex-1 bg-white">
      <GradientHeader colors={HEADER_GRADIENTS.ambassadors} style={{ paddingTop: insets.top + 12, paddingBottom: 16, paddingHorizontal: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <Text color="inverse" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 20, lineHeight: 28 }}>
          {t("ambassadors.title")}
        </Text>
      </GradientHeader>

      {checkingStatus ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.navy.DEFAULT} />
        </View>
      ) : isAmbassador ? (
        <View className="flex-1 px-6 pt-8 gap-6">
          <View
            className="rounded-2xl p-5"
            style={{ backgroundColor: isPending ? "#FFF7ED" : isApproved ? "#F0FDF4" : "#FFF1F2" }}
          >
            <View className="flex-row items-center gap-3 mb-3">
              <Ionicons
                name={isPending ? "time-outline" : isApproved ? "checkmark-circle" : "close-circle"}
                size={28}
                color={isPending ? Colors.warning?.DEFAULT ?? "#F59E0B" : isApproved ? Colors.success.DEFAULT : Colors.error.DEFAULT}
              />
              <Text className="text-grey-900" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 18 }}>
                {isPending ? t("ambassadors.pending") : isApproved ? t("ambassadors.approved") : t("ambassadors.rejected")}
              </Text>
            </View>
            <Text variant="body" color="muted">
              {isPending
                ? t("ambassadors.pendingMessage")
                : isApproved
                ? t("ambassadors.referralCode", { code: stats.referralCode })
                : t("ambassadors.rejectedMessage")}
            </Text>
          </View>

          {isApproved && (
            <>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-grey-50 rounded-2xl p-4">
                  <Text variant="caption" color="muted">{t("ambassadors.totalReferrals")}</Text>
                  <Text className="text-grey-900" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 28 }}>
                    {stats?.totalReferrals ?? 0}
                  </Text>
                </View>
                <View className="flex-1 bg-grey-50 rounded-2xl p-4">
                  <Text variant="caption" color="muted">{t("ambassadors.totalEarned")}</Text>
                  <Text className="text-grey-900" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 28 }}>
                    £{(stats?.totalEarnings ?? 0).toFixed(2)}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  label={t("ambassadors.dashboard")}
                  className="flex-1"
                  onPress={() => router.push("/ambassador/dashboard" as any)}
                />
                <Pressable
                  className="w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: Colors.teal.DEFAULT }}
                  onPress={shareReferralLink}
                >
                  <Ionicons name="share-social-outline" size={22} color="#fff" />
                </Pressable>
              </View>
            </>
          )}
        </View>
      ) : (
        <>
          <View className="flex-1 px-6 pt-6 gap-8">
            <Text variant="body" color="muted" className="text-center">
              {t("ambassadors.commission")}
            </Text>

            <View className="gap-3">
              <Text className="text-grey-900" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 18, textAlign: "center" }}>
                {t("ambassadors.whatYouDo")}
              </Text>
              {WHAT_YOU_DO.map((item) => (
                <View key={item} className="flex-row items-start gap-3 px-2">
                  <Ionicons name="checkmark-circle" size={20} color={Colors.teal.DEFAULT} style={{ marginTop: 2 }} />
                  <Text variant="body" className="flex-1 text-grey-700">{item}</Text>
                </View>
              ))}
            </View>

            <View className="gap-3">
              <Text className="text-grey-900" style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 18, textAlign: "center" }}>
                {t("ambassadors.whatYouGet")}
              </Text>
              {WHAT_YOU_GET.map((item) => (
                <View key={item} className="flex-row items-start gap-3 px-2">
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary[500]} style={{ marginTop: 2 }} />
                  <Text variant="body" className="flex-1 text-grey-700">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="px-6 gap-3" style={{ paddingBottom: insets.bottom + 16 }}>
            <Button
              variant="primary"
              size="lg"
              label={t("ambassadors.applyButton")}
              fullWidth
              onPress={() => router.push("/ambassador/signup" as any)}
            />
          </View>
        </>
      )}
    </View>
  );
}
