// Static logo map. require() can't take a dynamic string in Metro, so each
// uni's logo must be explicitly registered. Slugs match the backend's
// `toSlug` rule (lowercase, non-alphanumeric -> dashes, no leading/trailing).
//
// When adding a new university, drop the PNG into
// assets/images/universities/<slug>.png and add an entry below.

const LOGOS: Record<string, ReturnType<typeof require>> = {
  "university-college-london":     require("@/assets/images/universities/university-college-london.png"),
  "university-of-manchester":      require("@/assets/images/universities/university-of-manchester.png"),
  "university-of-edinburgh":       require("@/assets/images/universities/university-of-edinburgh.png"),
  "kings-college-london":          require("@/assets/images/universities/kings-college-london.png"),
  "university-of-glasgow":         require("@/assets/images/universities/university-of-glasgow.png"),
  "university-of-leeds":           require("@/assets/images/universities/university-of-leeds.png"),
  "university-of-birmingham":      require("@/assets/images/universities/university-of-birmingham.png"),
  "imperial-college-london":       require("@/assets/images/universities/imperial-college-london.png"),
  "university-of-nottingham":      require("@/assets/images/universities/university-of-nottingham.png"),
  "university-of-bristol":         require("@/assets/images/universities/university-of-bristol.png"),
  "university-of-the-west-of-england-uwe-bristol": require("@/assets/images/universities/uwe-bristol.png"),
  "uwe-bristol":                   require("@/assets/images/universities/uwe-bristol.png"),
  "university-of-sheffield":       require("@/assets/images/universities/university-of-sheffield.png"),
  "university-of-liverpool":       require("@/assets/images/universities/university-of-liverpool.png"),
  "cardiff-university":            require("@/assets/images/universities/cardiff-university.png"),
  "university-of-exeter":          require("@/assets/images/universities/university-of-exeter.png"),
  "university-of-southampton":     require("@/assets/images/universities/university-of-southampton.png"),
  "university-of-bath":            require("@/assets/images/universities/university-of-bath.png"),
  "swansea-university":            require("@/assets/images/universities/swansea-university.png"),
  "university-of-essex":           require("@/assets/images/universities/university-of-essex.png"),
  "university-of-huddersfield":    require("@/assets/images/universities/university-of-huddersfield.png"),
};

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getUniversityLogo(name: string | null | undefined) {
  if (!name) return null;
  return LOGOS[toSlug(name)] ?? null;
}
