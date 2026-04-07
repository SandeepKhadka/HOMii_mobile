import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api";

const PENDING_REFERRAL_KEY = 'pendingReferralCode';

WebBrowser.maybeCompleteAuthSession();

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: string | null }>;
  verifyResetOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Database["public"]["Tables"]["profiles"]["Update"]) => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from DB — retries to allow DB trigger to complete
  const fetchProfile = async (userId: string) => {
    for (let attempt = 1; attempt <= 5; attempt++) {
      const { data: rows, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId);

      if (error) {
        console.log("[Auth] fetchProfile error on attempt", attempt, ":", error.message);
      }

      if (rows && rows.length > 0) {
        console.log("[Auth] Profile found on attempt", attempt);
        setProfile(rows[0]);
        return;
      }

      // On last retry, try to create the profile ourselves (trigger may have failed)
      if (attempt === 3) {
        console.log("[Auth] Attempting to create profile manually");
        const { data: session } = await supabase.auth.getSession();
        const user = session?.session?.user;
        if (user) {
          const { error: insertErr } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email ?? "",
              full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? "",
            });
          if (insertErr) {
            console.log("[Auth] Manual profile insert error:", insertErr.message);
          } else {
            console.log("[Auth] Manual profile insert succeeded");
          }
        }
      }

      console.log("[Auth] Profile not found, attempt", attempt, "- waiting...");
      await new Promise((r) => setTimeout(r, 1000));
    }
    console.log("[Auth] Profile not found after 5 attempts, signing out");
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  // Listen for auth changes — only set session state, no DB queries here
  useEffect(() => {
    let initialDone = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      initialDone = true;
      setSession(session);
      if (!session?.user) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[Auth] State change:", event, "user:", session?.user?.id?.slice(0, 8));
        // Ignore early SIGNED_OUT/INITIAL_SESSION before getSession resolves
        if (!initialDone && !session) return;
        setSession(session);
        if (!session) {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch profile in a separate effect when session changes
  useEffect(() => {
    if (session?.user) {
      setLoading(true);
      console.log("[Auth] Session user detected, fetching profile for:", session.user.id.slice(0, 8));
      fetchProfile(session.user.id).finally(() => {
        setLoading(false);
        // Apply any referral code stored from a deep link (homii://r/{code})
        AsyncStorage.getItem(PENDING_REFERRAL_KEY).then((code) => {
          if (!code) return;
          AsyncStorage.removeItem(PENDING_REFERRAL_KEY);
          api.attributeReferral(code).catch((e) => {
            console.log("[Referral] Attribution skipped (already attributed or invalid):", (e as Error).message);
          });
        });
      });
    }
  }, [session?.user?.id]);

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log("[Auth] Signing up:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    console.log("[Auth] SignUp result:", { user: data?.user?.id, session: !!data?.session, error: error?.message });

    if (error) {
      // Check if user already exists (likely signed up with Google)
      if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("already been registered")) {
        return { error: "An account with this email already exists. Try signing in with Google or use your password.", needsConfirmation: false };
      }
      return { error: error.message, needsConfirmation: false };
    }

    // Supabase may return a user with no session and fake identities to prevent email enumeration
    // If the user has no identities, the email is already taken
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return { error: "An account with this email already exists. Try signing in with Google or use your password.", needsConfirmation: false };
    }

    const needsConfirmation = !data.session;
    return { error: null, needsConfirmation };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message === "Invalid login credentials") {
        return { error: "Invalid email or password. If you signed up with Google, use 'Continue with Google' instead." };
      }
      return { error: error.message };
    }
    return { error: null };
  };

  const signInWithGoogle = async () => {
    // Show loading overlay immediately so there's no flash when browser closes
    setLoading(true);
    try {
      const redirectUrl = AuthSession.makeRedirectUri();
      console.log("[Auth] Google redirect URL:", redirectUrl);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });
      if (error || !data.url) {
        setLoading(false);
        return { error: error?.message ?? "Failed to start Google sign-in" };
      }
      console.log("[Auth] Opening Google OAuth URL");
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl,
        { showInRecents: true }
      );
      console.log("[Auth] WebBrowser result type:", result.type);
      if (result.type === "success") {
        console.log("[Auth] Redirect URL received:", result.url?.slice(0, 100));
        const url = result.url;
        // Extract tokens from URL hash fragment
        const hashPart = url.split("#")[1];
        if (hashPart) {
          const params = new URLSearchParams(hashPart);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          console.log("[Auth] Tokens found:", !!accessToken, !!refreshToken);
          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (sessionError) setLoading(false);
            // On success: profile-fetch useEffect will call setLoading(false)
            return { error: sessionError?.message ?? null };
          }
        }
        setLoading(false);
        return { error: "No tokens received from Google" };
      }
      if (result.type === "cancel" || result.type === "dismiss") {
        setLoading(false);
        return { error: null }; // User cancelled
      }
      setLoading(false);
      return { error: "Google sign-in failed" };
    } catch (e: any) {
      setLoading(false);
      return { error: e?.message ?? "Google sign-in failed" };
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });
    return { error: error?.message ?? null };
  };

  const resetPasswordForEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error?.message ?? null };
  };

  const verifyResetOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });
    return { error: error?.message ?? null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Database["public"]["Tables"]["profiles"]["Update"]) => {
    if (!session?.user) {
      console.log("[Auth] updateProfile: no session");
      return;
    }
    console.log("[Auth] updateProfile for user:", session.user.id, JSON.stringify(updates));

    // If we don't have a profile yet, ensure one exists first
    if (!profile) {
      console.log("[Auth] updateProfile: no profile in state, creating first");
      const { error: insertErr } = await supabase
        .from("profiles")
        .insert({
          id: session.user.id,
          email: session.user.email ?? "",
          full_name: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? "",
        });
      if (insertErr && !insertErr.message.includes("duplicate")) {
        console.log("[Auth] updateProfile insert error:", insertErr.message);
      }
    }

    // Now update
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", session.user.id)
      .select();

    console.log("[Auth] updateProfile result:", data?.length, "error:", error?.message);

    if (data && data.length > 0) {
      console.log("[Auth] updateProfile success");
      setProfile(data[0]);
      return;
    }

    console.log("[Auth] updateProfile: update returned no rows");
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        verifyOtp,
        resetPasswordForEmail,
        verifyResetOtp,
        updatePassword,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
