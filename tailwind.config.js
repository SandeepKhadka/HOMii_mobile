/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // HOMii Brand — purple/indigo from Figma
        primary: {
          50:  "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1", // main brand purple
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        // Category accent colors from Figma
        category: {
          banking:       "#14B8A6", // teal
          transport:     "#1E293B", // dark navy
          sims:          "#F59E0B", // amber
          food:          "#F97316", // orange
          accommodation: "#7C3AED", // purple
          discounts:     "#F43F5E", // coral-rose
          documents:     "#F59E0B", // amber
          insurance:     "#DC2626", // red
          university:    "#38BDF8", // sky blue
          flights:       "#86EFAC", // light green
          socialEvents:  "#F472B6", // pink
          exploreUK:     "#FB923C", // orange
        },
        // Ambassador navy
        navy: {
          DEFAULT: "#1E1B4B",
          light:   "#312E81",
        },
        // Dashboard teal
        teal: {
          DEFAULT: "#14B8A6",
          light:   "#99F6E4",
          dark:    "#0D9488",
        },
        success: {
          DEFAULT: "#10B981", // teal checkmark from Figma
          light:   "#D1FAE5",
          dark:    "#059669",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light:   "#FDE68A",
        },
        error: {
          DEFAULT: "#EF4444",
          light:   "#FEE2E2",
        },
        grey: {
          50:  "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        surface:    "#FFFFFF",
        background: "#F5F7FF",
      },
      fontFamily: {
        heading:    ["BricolageGrotesque_700Bold", "System"],
        subheading: ["BricolageGrotesque_600SemiBold", "System"],
        sans:       ["BricolageGrotesque_400Regular", "System"],
        medium:     ["BricolageGrotesque_500Medium", "System"],
        semibold:   ["BricolageGrotesque_600SemiBold", "System"],
        bold:       ["BricolageGrotesque_700Bold", "System"],
        extrabold:  ["BricolageGrotesque_800ExtraBold", "System"],
      },
      borderRadius: {
        "2xs": "4px",
        xs:    "6px",
        sm:    "8px",
        md:    "12px",
        lg:    "16px",
        xl:    "20px",
        "2xl": "24px",
        "3xl": "32px",
        full:  "9999px",
      },
    },
  },
  plugins: [],
};
