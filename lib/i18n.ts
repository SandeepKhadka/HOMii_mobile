import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import en from "../locales/en.json";
import zhHans from "../locales/zh-Hans.json";
import zhHant from "../locales/zh-Hant.json";

// Map device locale tag to our supported language codes
function detectDeviceLanguage(): string {
  try {
    const tag = getLocales()[0]?.languageTag ?? "en";
    if (tag.startsWith("zh")) {
      if (tag.includes("Hant") || tag.includes("TW") || tag.includes("HK")) return "zh-Hant";
      return "zh-Hans";
    }
    return "en";
  } catch {
    return "en";
  }
}

/** Bundled locale files. Add a new entry here when a dev ships a new language JSON. */
const BUNDLED_LOCALES: Record<string, object> = {
  en,
  "zh-Hans": zhHans,
  "zh-Hant": zhHant,
};

i18n.use(initReactI18next).init({
  resources: Object.fromEntries(
    Object.entries(BUNDLED_LOCALES).map(([code, msgs]) => [code, { translation: msgs }])
  ),
  lng: detectDeviceLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  compatibilityJSON: "v4",
});

/** Maps profile language_code (underscores) to i18next language code (dashes). */
const PROFILE_TO_I18N: Record<string, string> = {
  en: "en",
  zh_Hans: "zh-Hans",
  zh_Hant: "zh-Hant",
};

/**
 * Convert a profile language code (e.g. "zh_Hans") to the i18next code ("zh-Hans").
 * For unknown languages, return the code as-is (e.g. "fr" → "fr").
 */
export function profileCodeToI18n(profileCode: string): string {
  return PROFILE_TO_I18N[profileCode] ?? profileCode;
}

/**
 * Switch the active app language. profileCode uses underscore format (e.g. "zh_Hans").
 * If a bundled locale exists it will be used; otherwise i18next falls back to English.
 */
export function setAppLanguage(profileCode: string) {
  const lang = profileCodeToI18n(profileCode);
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
}

export default i18n;
