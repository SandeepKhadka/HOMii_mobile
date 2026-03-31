import { useEffect, useState, useCallback } from "react";
import { View, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "@/contexts/AuthContext";
import { getAmbassadorApplication, getAmbassadorStats, requestWithdrawal } from "@/lib/ambassador";
import { Database } from "@/types/database";

type Withdrawal = Database["public"]["Tables"]["withdrawals"]["Row"];

export default function AmbassadorDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    availableToWithdraw: 0,
    withdrawals: [] as Withdrawal[],
  });
  const [loading, setLoading] = useState(true);
  const [appId, setAppId] = useState<string | null>(null);

  const referralLink = `https://homii.com/${referralCode}`;

  const loadData = useCallback(async () => {
    if (!user) return;
    const { data: app } = await getAmbassadorApplication(user.id);
    if (app) {
      setReferralCode(app.referral_code);
      setAppId(app.id);
      const ambassadorStats = await getAmbassadorStats(app.id);
      setStats(ambassadorStats);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const copyLink = async () => {
    await Clipboard.setStringAsync(referralLink);
    Alert.alert("Copied!", "Referral link copied to clipboard");
  };

  const handleWithdraw = async () => {
    if (!appId || stats.availableToWithdraw <= 0) {
      Alert.alert("Error", "No funds available to withdraw");
      return;
    }
    const { error } = await requestWithdrawal(appId, stats.availableToWithdraw);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Withdrawal request submitted!");
      loadData();
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.teal.DEFAULT} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="flex-row items-center px-4 pb-4"
        style={{ backgroundColor: Colors.teal.DEFAULT, paddingTop: insets.top + 12 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text
          color="inverse"
          style={{
            fontFamily: "BricolageGrotesque_700Bold",
            fontSize: 20,
            lineHeight: 28,
            marginLeft: 8,
          }}
        >
          Dashboard
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="px-6 pt-6 gap-4">
          {/* Referral link */}
          <View className="gap-1.5">
            <Text variant="caption" color="muted">Referral link</Text>
            <View className="flex-row items-center border border-grey-200 rounded-xl px-4 py-3">
              <Text variant="body" className="flex-1 text-grey-800" numberOfLines={1}>
                {referralLink}
              </Text>
              <Pressable onPress={copyLink} className="ml-2">
                <Ionicons name="copy-outline" size={20} color={Colors.grey[400]} />
              </Pressable>
            </View>
          </View>

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
                style={{
                  fontFamily: "BricolageGrotesque_700Bold",
                  fontSize: 28,
                  lineHeight: 36,
                }}
              >
                {stats.totalReferrals}
              </Text>
            </View>
          </View>

          {/* Balance card */}
          <View
            className="rounded-2xl px-5 py-4 flex-row items-center gap-4"
            style={{ backgroundColor: "#EFF6FF" }}
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: Colors.primary[100] }}
            >
              <Ionicons name="wallet" size={24} color={Colors.primary[500]} />
            </View>
            <View>
              <Text variant="caption" color="muted">Total Balance</Text>
              <Text
                className="text-grey-900"
                style={{
                  fontFamily: "BricolageGrotesque_700Bold",
                  fontSize: 28,
                  lineHeight: 36,
                }}
              >
                ${stats.totalEarnings.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-2xl px-4 py-4 bg-grey-50">
              <Text variant="caption" color="muted">Pending Earnings</Text>
              <Text
                className="text-grey-900"
                style={{
                  fontFamily: "BricolageGrotesque_700Bold",
                  fontSize: 22,
                  lineHeight: 30,
                }}
              >
                ${stats.pendingEarnings.toFixed(2)}
              </Text>
            </View>
            <View className="flex-1 rounded-2xl px-4 py-4 bg-grey-50">
              <Text variant="caption" color="muted">Available to withdraw</Text>
              <Text
                className="text-grey-900"
                style={{
                  fontFamily: "BricolageGrotesque_700Bold",
                  fontSize: 22,
                  lineHeight: 30,
                }}
              >
                ${stats.availableToWithdraw.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Recent Withdrawals */}
          <View className="mt-2">
            <View className="flex-row justify-between items-center mb-3">
              <Text
                className="text-grey-900"
                style={{
                  fontFamily: "BricolageGrotesque_700Bold",
                  fontSize: 18,
                  lineHeight: 24,
                }}
              >
                Recent Withdrawals
              </Text>
              <Pressable>
                <Text variant="body" color="muted">View all</Text>
              </Pressable>
            </View>

            {stats.withdrawals.length === 0 ? (
              <Text variant="body" color="muted" className="text-center py-6">
                No withdrawals yet
              </Text>
            ) : (
              <View>
                {stats.withdrawals.slice(0, 4).map((item, index) => (
                  <View
                    key={item.id}
                    className="flex-row justify-between items-center py-4"
                    style={{
                      borderBottomWidth: index < Math.min(stats.withdrawals.length, 4) - 1 ? 1 : 0,
                      borderBottomColor: Colors.grey[100],
                    }}
                  >
                    <Text variant="body" className="text-grey-700">
                      {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                    <Text
                      className="text-grey-900"
                      style={{
                        fontFamily: "BricolageGrotesque_600SemiBold",
                        fontSize: 15,
                      }}
                    >
                      ${item.amount.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Withdraw button */}
          <Pressable
            className="items-center py-4 rounded-2xl mt-2"
            style={{ backgroundColor: Colors.primary[500] }}
            onPress={handleWithdraw}
          >
            <Text
              color="inverse"
              style={{
                fontFamily: "BricolageGrotesque_600SemiBold",
                fontSize: 16,
              }}
            >
              Withdraw
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
