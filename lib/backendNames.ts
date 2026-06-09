import i18n from "@/lib/i18n";

// Backend categories/phases come back as English-only (admin hasn't entered
// per-language translations yet, even though the schema supports it). Until
// AI-translation lands in the admin, we look up known slugs in the bundled
// locale files and fall back to the backend-provided name.

export function localizePhaseName(slug: string, fallback: string): string {
  if (!slug) return fallback;
  const key = `phaseNames.${slug}`;
  const translated = i18n.t(key);
  // i18next returns the key string when not found
  return translated === key ? fallback : translated;
}

export function localizeCategoryName(slug: string, fallback: string): string {
  if (!slug) return fallback;
  const key = `categoryNames.${slug}`;
  const translated = i18n.t(key);
  return translated === key ? fallback : translated;
}

export function localizePhaseSubtitle(slug: string, fallback: string): string {
  if (!slug) return fallback;
  const key = `phaseSubtitles.${slug}`;
  const translated = i18n.t(key);
  return translated === key ? fallback : translated;
}

export function localizeCategoryDescription(slug: string, fallback: string): string {
  if (!slug) return fallback;
  const key = `categoryDescriptions.${slug}`;
  const translated = i18n.t(key);
  return translated === key ? fallback : translated;
}
