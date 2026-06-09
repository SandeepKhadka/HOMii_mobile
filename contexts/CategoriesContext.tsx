import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";
import { api, ApiCategory, ApiPhase } from "@/lib/api";
import { CATEGORIES, PHASES, Category } from "@/constants/categories";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { localizeCategoryName, localizePhaseName, localizePhaseSubtitle, localizeCategoryDescription } from "@/lib/backendNames";

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
// Filters apps by the user's university AND city — an app is visible when:
//   - both restriction lists are empty (default; available to everyone), OR
//   - supportedUniversities matches the user's selected university, OR
//   - supportedCities matches the city of the user's university.
// If a restriction is set but the user has no university yet, the app is
// hidden to avoid showing irrelevant recommendations mid-onboarding.
function mapApiToCategory(
  apiCat: ApiCategory,
  universityName?: string | null,
  cityName?: string | null,
): Category {
  const visibleApps = apiCat.apps.filter((app) => {
    const restrictedByUni = (app.supportedUniversities ?? []).length > 0;
    const restrictedByCity = (app.supportedCities ?? []).length > 0;
    if (!restrictedByUni && !restrictedByCity) return true;

    const uniMatch = restrictedByUni && universityName
      ? app.supportedUniversities.some((u) => u.toLowerCase() === universityName.toLowerCase())
      : false;
    const cityMatch = restrictedByCity && cityName
      ? app.supportedCities.some((c) => c.toLowerCase() === cityName.toLowerCase())
      : false;

    return uniMatch || cityMatch;
  });

  return {
    id: SLUG_TO_ID[apiCat.slug] || apiCat.slug,
    title: localizeCategoryName(apiCat.slug, apiCat.name),
    subtitle: localizeCategoryDescription(apiCat.slug, apiCat.description || ""),
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
      title: localizePhaseName(p.slug, p.name),
      subtitle: localizePhaseSubtitle(p.slug, fallback.subtitle),
      icon: p.icon || fallback.icon,   // prefer icon from admin, fallback to hardcoded
      categories: phaseMap[p.slug] || [],
    };
  });
}

export function CategoriesProvider({ children }: PropsWithChildren) {
  const { profile } = useAuth();
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [phases, setPhases] = useState<PhaseData[]>(PHASES as unknown as PhaseData[]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Universities fetched alongside categories so we can resolve the user's
      // city from their saved university name and pass it to the per-app filter.
      const [cats, apiPhases, unis] = await Promise.all([
        api.getCategories(),
        api.getPhases(),
        api.getUniversities().catch(() => []),
      ]);
      const userCity = profile?.university
        ? unis.find((u) => u.name.toLowerCase() === profile.university!.toLowerCase())?.city ?? null
        : null;

      if (cats && cats.length > 0) {
        setCategories(cats.map((cat) => mapApiToCategory(cat, profile?.university, userCity)));
        if (apiPhases && apiPhases.length > 0) {
          setPhases(buildDynamicPhases(cats, apiPhases));
        }
        console.log("[Categories] Loaded from API:", cats.length, "cats,", apiPhases?.length ?? 0, "phases, city:", userCity ?? "n/a");
      }
    } catch (e) {
      console.log("[Categories] API fetch failed, using fallback:", (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [profile?.university, i18n.language]);

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
