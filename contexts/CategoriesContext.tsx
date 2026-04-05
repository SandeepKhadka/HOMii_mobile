import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";
import { api, ApiCategory } from "@/lib/api";
import { CATEGORIES, PHASES, Category } from "@/constants/categories";

interface CategoriesState {
  categories: Category[];
  phases: typeof PHASES;
  loading: boolean;
  refetch: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesState>({
  categories: CATEGORIES,
  phases: PHASES,
  loading: false,
  refetch: async () => {},
});

// Map API response to the existing Category interface used by all screens
function mapApiToCategory(apiCat: ApiCategory): Category {
  return {
    id: apiCat.slug,
    title: apiCat.name,
    subtitle: apiCat.description || "",
    icon: apiCat.icon || "apps-outline",
    color: apiCat.color || "#6366F1",
    textColor: "#FFFFFF",
    apps: apiCat.apps.map((app) => ({
      name: app.name,
      description: app.description || "",
      icon: app.icon || "",
    })),
    checklistItems: apiCat.checklistItems.map((item) => item.title),
  };
}

// Map API categories to phases
function buildPhases(cats: ApiCategory[]) {
  return PHASES.map((phase) => ({
    ...phase,
    categories: cats
      .filter((c) => c.phase === phase.id)
      .map((c) => c.slug)
      // Map backend slugs to frontend IDs used in PHASES
      .map((slug) => {
        const mapping: Record<string, string> = {
          "sim-cards": "sims",
          "banking": "banking",
          "transport": "transport",
          "food-delivery": "food",
          "student-discounts": "discounts",
          "groceries": "groceries",
          "events": "events",
        };
        return mapping[slug] || slug;
      }),
  }));
}

export function CategoriesProvider({ children }: PropsWithChildren) {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      if (data && data.length > 0) {
        const mapped = data.map(mapApiToCategory);
        // Map backend slugs to match frontend IDs
        const slugToId: Record<string, string> = {
          "sim-cards": "sims",
          "food-delivery": "food",
          "student-discounts": "discounts",
        };
        mapped.forEach((cat) => {
          if (slugToId[cat.id]) cat.id = slugToId[cat.id];
        });
        setCategories(mapped);
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
      value={{ categories, phases: PHASES, loading, refetch: fetchCategories }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}
