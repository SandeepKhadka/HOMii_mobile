import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import en from "../locales/en.json";
import zhHans from "../locales/zh-Hans.json";
import zhHant from "../locales/zh-Hant.json";
import hi from "../locales/hi.json";
import bn from "../locales/bn.json";
import ne from "../locales/ne.json";
import ar from "../locales/ar.json";
import ur from "../locales/ur.json";

// Map device locale tag to our supported language codes
function detectDeviceLanguage(): string {
  try {
    const tag = getLocales()[0]?.languageTag ?? "en";
    if (tag.startsWith("zh")) {
      if (tag.includes("Hant") || tag.includes("TW") || tag.includes("HK")) return "zh-Hant";
      return "zh-Hans";
    }
    // Match the device's primary language code (e.g. "hi-IN" → "hi") against
    // our bundled single-script locales.
    const base = tag.split("-")[0];
    if (["hi", "bn", "ne", "ar", "ur"].includes(base)) return base;
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
  hi,
  bn,
  ne,
  ar,
  ur,
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

/** Maps profile language_code (underscores) to i18next language code (dashes).
 *  Single-script languages keep the same code; only script-variant languages
 *  like Chinese need the underscore form on the profile side. */
const PROFILE_TO_I18N: Record<string, string> = {
  en: "en",
  zh_Hans: "zh-Hans",
  zh_Hant: "zh-Hant",
  hi: "hi",
  bn: "bn",
  ne: "ne",
  ar: "ar",
  ur: "ur",
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
