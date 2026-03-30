import { TextStyle } from "react-native";

export const FontFamily = {
  regular:   "Inter_400Regular",
  medium:    "Inter_500Medium",
  semibold:  "Inter_600SemiBold",
  bold:      "Inter_700Bold",
  extrabold: "Inter_800ExtraBold",
} as const;

export const FontSize = {
  xs:   10,
  sm:   12,
  base: 14,
  md:   16,
  lg:   18,
  xl:   20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
  "5xl": 40,
} as const;

export const LineHeight = {
  tight:  1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export const TextVariants: Record<string, TextStyle> = {
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize["4xl"],
    lineHeight: FontSize["4xl"] * LineHeight.tight,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize["3xl"],
    lineHeight: FontSize["3xl"] * LineHeight.tight,
  },
  h3: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize["2xl"],
    lineHeight: FontSize["2xl"] * LineHeight.normal,
  },
  h4: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.normal,
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.normal,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  bodyMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.relaxed,
  },
  captionMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.relaxed,
  },
  label: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * LineHeight.normal,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
} as const;
