import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

interface OnboardingProgressContextType {
  isItemCompleted: (categoryId: string, item: string) => boolean;
  toggleItem: (categoryId: string, item: string) => void;
  // checklistItems must come from the API (useCategories), not a static constant
  isCategoryCompleted: (categoryId: string, checklistItems: string[]) => boolean;
  completedCount: (categoryId: string, checklistItems: string[]) => number;
}

const OnboardingProgressContext = createContext<OnboardingProgressContextType | null>(null);

export function OnboardingProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, Set<string>>>({});

  // Load progress from Supabase on mount
  useEffect(() => {
    if (!user) return;

    const loadProgress = async () => {
      const { data } = await supabase
        .from("onboarding_progress")
        .select("category_id, completed_items")
        .eq("user_id", user.id);

      if (data) {
        const loaded: Record<string, Set<string>> = {};
        data.forEach((row) => {
          loaded[row.category_id] = new Set(row.completed_items);
        });
        setProgress(loaded);
      }
    };

    loadProgress();
  }, [user]);

  // Sync a single category to Supabase
  const syncCategory = useCallback(
    async (categoryId: string, items: Set<string>) => {
      if (!user) return;
      await supabase
        .from("onboarding_progress")
        .upsert(
          {
            user_id: user.id,
            category_id: categoryId,
            completed_items: Array.from(items),
          },
          { onConflict: "user_id,category_id" }
        );
    },
    [user]
  );

  const isItemCompleted = useCallback(
    (categoryId: string, item: string) => progress[categoryId]?.has(item) ?? false,
    [progress]
  );

  const toggleItem = useCallback(
    (categoryId: string, item: string) => {
      setProgress((prev) => {
        const current = new Set(prev[categoryId] ?? []);
        if (current.has(item)) {
          current.delete(item);
        } else {
          current.add(item);
        }
        const updated = { ...prev, [categoryId]: current };
        // Fire-and-forget sync to DB
        syncCategory(categoryId, current);
        return updated;
      });
    },
    [syncCategory]
  );

  const isCategoryCompleted = useCallback(
    (categoryId: string, checklistItems: string[]) => {
      if (!checklistItems.length) return false;
      const done = progress[categoryId];
      if (!done) return false;
      return checklistItems.every((item) => done.has(item));
    },
    [progress]
  );

  const completedCount = useCallback(
    (categoryId: string, checklistItems: string[]) => {
      const done = progress[categoryId];
      if (!done) return 0;
      return checklistItems.filter((item) => done.has(item)).length;
    },
    [progress]
  );

  return (
    <OnboardingProgressContext.Provider
      value={{ isItemCompleted, toggleItem, isCategoryCompleted, completedCount }}
    >
      {children}
    </OnboardingProgressContext.Provider>
  );
}

export function useOnboardingProgress() {
  const ctx = useContext(OnboardingProgressContext);
  if (!ctx) throw new Error("useOnboardingProgress must be used within OnboardingProgressProvider");
  return ctx;
}
