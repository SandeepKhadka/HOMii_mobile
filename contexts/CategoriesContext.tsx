import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";
import { api, ApiCategory } from "@/lib/api";
import { CATEGORIES, PHASES, Category } from "@/constants/categories";

export interface PhaseData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  categories: string[];
}

interface CategoriesState {
  categories: Category[];
  phases: PhaseData[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesState>({
  categories: CATEGORIES,
  phases: PHASES as unknown as PhaseData[],
  loading: false,
  refetch: async () => {},
});

const SLUG_TO_ID: Record<string, string> = {
  "sim-cards": "sims",
  "food-delivery": "food",
  "student-discounts": "discounts",
};

// Map API response to the existing Category interface used by all screens
function mapApiToCategory(apiCat: ApiCategory): Category {
  return {
    id: SLUG_TO_ID[apiCat.slug] || apiCat.slug,
    title: apiCat.name,
    subtitle: apiCat.description || "",
    icon: apiCat.icon || "apps-outline",
    color: apiCat.color || "#6366F1",
    textColor: "#FFFFFF",
    apps: apiCat.apps.map((app) => ({
      id: app.id,           // Preserved for click tracking
      name: app.name,
      description: app.description || "",
      icon: app.icon || "",
    })),
    checklistItems: apiCat.checklistItems.map((item) => item.title),
  };
}

// Build dynamic phases from API categories, preserving phase metadata from constants
function buildDynamicPhases(cats: ApiCategory[]): PhaseData[] {
  return (PHASES as unknown as PhaseData[]).map((phase) => {
    const phaseCats = cats.filter((c) => c.phase === phase.id);
    if (phaseCats.length === 0) {
      // Keep static categories if API didn't return any for this phase
      return phase;
    }
    return {
      ...phase,
      categories: phaseCats.map((c) => SLUG_TO_ID[c.slug] || c.slug),
    };
  });
}

export function CategoriesProvider({ children }: PropsWithChildren) {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [phases, setPhases] = useState<PhaseData[]>(PHASES as unknown as PhaseData[]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      if (data && data.length > 0) {
        const mapped = data.map(mapApiToCategory);
        setCategories(mapped);
        setPhases(buildDynamicPhases(data));
        console.log("[Categories] Loaded from API:", mapped.length);
      }
    } catch (e) {
      console.log("[Categories] API fetch failed, using fallback:", (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{ categories, phases, loading, refetch: fetchCategories }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}
