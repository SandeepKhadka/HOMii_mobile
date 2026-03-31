export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          university: string | null;
          language: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          university?: string | null;
          language?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          university?: string | null;
          language?: string | null;
          onboarding_completed?: boolean;
        };
      };
      onboarding_progress: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          completed_items: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          completed_items?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          completed_items?: string[];
          updated_at?: string;
        };
      };
      ambassador_applications: {
        Row: {
          id: string;
          user_id: string;
          student_email: string;
          course: string;
          motivation: string | null;
          status: "pending" | "approved" | "rejected";
          referral_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          student_email: string;
          course: string;
          motivation?: string | null;
          referral_code: string;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "pending" | "approved" | "rejected";
          updated_at?: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          ambassador_id: string;
          referred_user_id: string;
          commission_amount: number;
          status: "pending" | "confirmed" | "paid";
          created_at: string;
        };
        Insert: {
          id?: string;
          ambassador_id: string;
          referred_user_id: string;
          commission_amount?: number;
          status?: "pending" | "confirmed" | "paid";
          created_at?: string;
        };
        Update: {
          status?: "pending" | "confirmed" | "paid";
          commission_amount?: number;
        };
      };
      withdrawals: {
        Row: {
          id: string;
          ambassador_id: string;
          amount: number;
          status: "pending" | "completed" | "failed";
          created_at: string;
        };
        Insert: {
          id?: string;
          ambassador_id: string;
          amount: number;
          status?: "pending" | "completed" | "failed";
          created_at?: string;
        };
        Update: {
          status?: "pending" | "completed" | "failed";
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
