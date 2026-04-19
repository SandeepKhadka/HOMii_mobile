import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";
import { api, ApiCategory, ApiPhase } from "@/lib/api";
import { CATEGORIES, PHASES, Category } from "@/constants/categories";
import { useAuth } from "@/contexts/AuthContext";

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

// Map API response to the existing Category interface used by all screens.
// universityName: if provided, filters out apps that have a restricted supportedUniversities
// list that doesn't include this university.
function mapApiToCategory(apiCat: ApiCategory, universityName?: string | null): Category {
  const visibleApps = apiCat.apps.filter((app) => {
    if (!app.supportedUniversities || app.supportedUniversities.length === 0) return true;
    if (!universityName) return false; // university-restricted app, user has no university set
    return app.supportedUniversities.some(
      (u) => u.toLowerCase() === universityName.toLowerCase(),
    );
  });

  return {
    id: SLUG_TO_ID[apiCat.slug] || apiCat.slug,
    title: apiCat.name,
    subtitle: apiCat.description || "",
    icon: apiCat.icon || "apps-outline",
    color: apiCat.color || "#6366F1",
    textColor: "#FFFFFF",
    apps: visibleApps.map((app) => ({
      id: app.id,
      name: app.name,
      description: app.description || "",
      icon: app.icon || "",
      recommended: app.recommended ?? false,
      deepLinkScheme: app.deepLinkScheme ?? null,
      androidPackage: app.androidPackageName ?? null,
    })),
    checklistItems: apiCat.checklistItems.map((item) => item.title),
  };
}

// Metadata fallback for known phase IDs (used when API doesn't return phase definitions)
const PHASE_META: Record<string, { title: string; subtitle: string; icon: string }> = {
  "before-fly":   { title: "Before You Fly",  subtitle: "Get everything ready before arrival",       icon: "airplane-outline" },
  "upon-arrival": { title: "First 48 Hours",   subtitle: "Settle in smooth when you arrive",          icon: "location-outline" },
  "settling-in":  { title: "First Week",       subtitle: "Get comfortable and start your new life",   icon: "home-outline" },
};

// Build phases from the API phases list (ordered by sortOrder, already filtered to active).
// Groups categories by their `phase` slug field.
function buildDynamicPhases(cats: ApiCategory[], apiPhases: ApiPhase[]): PhaseData[] {
  const phaseMap: Record<string, string[]> = {};
  for (const cat of cats) {
    if (!phaseMap[cat.phase]) phaseMap[cat.phase] = [];
    phaseMap[cat.phase].push(SLUG_TO_ID[cat.slug] || cat.slug);
  }

  return apiPhases.map((p) => {
    const fallback = PHASE_META[p.slug] ?? { subtitle: "", icon: "ellipse-outline" };
    return {
      id: p.slug,
      title: p.name,
      subtitle: fallback.subtitle,
      icon: p.icon || fallback.icon,   // prefer icon from admin, fallback to hardcoded
      categories: phaseMap[p.slug] || [],
    };
  });
}

export function CategoriesProvider({ children }: PropsWithChildren) {
  const { profile } = useAuth();
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [phases, setPhases] = useState<PhaseData[]>(PHASES as unknown as PhaseData[]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const [cats, apiPhases] = await Promise.all([api.getCategories(), api.getPhases()]);
      if (cats && cats.length > 0) {
        setCategories(cats.map((cat) => mapApiToCategory(cat, profile?.university)));
        if (apiPhases && apiPhases.length > 0) {
          setPhases(buildDynamicPhases(cats, apiPhases));
        }
        console.log("[Categories] Loaded from API:", cats.length, "cats,", apiPhases?.length ?? 0, "phases");
      }
    } catch (e) {
      console.log("[Categories] API fetch failed, using fallback:", (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [profile?.university]);

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
