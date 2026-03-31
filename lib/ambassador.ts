import { supabase } from "./supabase";

/** Generate a short unique referral code */
function generateReferralCode(name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, "-").slice(0, 10);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${slug}-${rand}`;
}

/** Submit ambassador application */
export async function submitAmbassadorApplication(params: {
  userId: string;
  studentEmail: string;
  course: string;
  motivation?: string;
  fullName: string;
}) {
  const referralCode = generateReferralCode(params.fullName);

  const { data, error } = await supabase
    .from("ambassador_applications")
    .insert({
      user_id: params.userId,
      student_email: params.studentEmail,
      course: params.course,
      motivation: params.motivation || null,
      referral_code: referralCode,
    })
    .select()
    .single();

  return { data, error };
}

/** Get current user's ambassador application */
export async function getAmbassadorApplication(userId: string) {
  const { data, error } = await supabase
    .from("ambassador_applications")
    .select("*")
    .eq("user_id", userId)
    .single();

  return { data, error };
}

/** Get ambassador stats (referrals, earnings) */
export async function getAmbassadorStats(ambassadorAppId: string) {
  const [referralsResult, withdrawalsResult] = await Promise.all([
    supabase
      .from("referrals")
      .select("*")
      .eq("ambassador_id", ambassadorAppId),
    supabase
      .from("withdrawals")
      .select("*")
      .eq("ambassador_id", ambassadorAppId)
      .order("created_at", { ascending: false }),
  ]);

  const referrals = referralsResult.data ?? [];
  const withdrawals = withdrawalsResult.data ?? [];

  const totalReferrals = referrals.length;
  const totalEarnings = referrals.reduce((sum, r) => sum + r.commission_amount, 0);
  const pendingEarnings = referrals
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + r.commission_amount, 0);
  const totalWithdrawn = withdrawals
    .filter((w) => w.status === "completed")
    .reduce((sum, w) => sum + w.amount, 0);
  const availableToWithdraw = totalEarnings - pendingEarnings - totalWithdrawn;

  return {
    totalReferrals,
    totalEarnings,
    pendingEarnings,
    availableToWithdraw,
    withdrawals,
  };
}

/** Request a withdrawal */
export async function requestWithdrawal(ambassadorAppId: string, amount: number) {
  const { data, error } = await supabase
    .from("withdrawals")
    .insert({
      ambassador_id: ambassadorAppId,
      amount,
    })
    .select()
    .single();

  return { data, error };
}
