import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CATEGORIES } from "@/constants/categories";

interface OnboardingProgressContextType {
  /** Check if a specific checklist item is completed */
  isItemCompleted: (categoryId: string, item: string) => boolean;
  /** Toggle a checklist item */
  toggleItem: (categoryId: string, item: string) => void;
  /** Check if all checklist items in a category are completed */
  isCategoryCompleted: (categoryId: string) => boolean;
  /** Get count of completed items in a category */
  completedCount: (categoryId: string) => number;
}

const OnboardingProgressContext = createContext<OnboardingProgressContextType | null>(null);

export function OnboardingProgressProvider({ children }: { children: ReactNode }) {
  // Record<categoryId, Set<completedItemName>>
  const [progress, setProgress] = useState<Record<string, Set<string>>>({});

  const isItemCompleted = useCallback(
    (categoryId: string, item: string) => progress[categoryId]?.has(item) ?? false,
    [progress],
  );

  const toggleItem = useCallback((categoryId: string, item: string) => {
    setProgress((prev) => {
      const current = new Set(prev[categoryId] ?? []);
      if (current.has(item)) {
        current.delete(item);
      } else {
        current.add(item);
      }
      return { ...prev, [categoryId]: current };
    });
  }, []);

  const isCategoryCompleted = useCallback(
    (categoryId: string) => {
      const category = CATEGORIES.find((c) => c.id === categoryId);
      if (!category) return false;
      const done = progress[categoryId];
      if (!done) return false;
      return category.checklistItems.every((item) => done.has(item));
    },
    [progress],
  );

  const completedCount = useCallback(
    (categoryId: string) => progress[categoryId]?.size ?? 0,
    [progress],
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
