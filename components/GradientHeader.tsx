import { LinearGradient } from "expo-linear-gradient";

export const GRADIENT_COLORS = ["#5B92F7", "#A5C9FD"] as const;
export const GRADIENT_START = { x: 0, y: 0 };
export const GRADIENT_END   = { x: 1, y: 1 };

// Per-screen header gradient presets
export const HEADER_GRADIENTS = {
  home:        ["#5B92F7", "#A5C9FD"] as const,
  apps:        ["#059669", "#34D399"] as const,
  setup:       ["#EA580C", "#FBBF24"] as const,
  ambassadors: ["#7C3AED", "#A78BFA"] as const,
  profile:     ["#0D9488", "#2DD4BF"] as const,
};

/**
 * Mixes a hex color toward white by `ratio` (0 = original, 1 = white).
 * Used to auto-generate the second stop of a category gradient from cat.color.
 */
export function lightenHex(hex: string, ratio: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const lr = Math.round(r + (255 - r) * ratio).toString(16).padStart(2, "0");
  const lg = Math.round(g + (255 - g) * ratio).toString(16).padStart(2, "0");
  const lb = Math.round(b + (255 - b) * ratio).toString(16).padStart(2, "0");
  return `#${lr}${lg}${lb}`;
}

interface GradientHeaderProps {
  style?: object;
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
}

export default function GradientHeader({ style, children, colors = GRADIENT_COLORS }: GradientHeaderProps) {
  return (
    <LinearGradient
      colors={colors}
      start={GRADIENT_START}
      end={GRADIENT_END}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}
