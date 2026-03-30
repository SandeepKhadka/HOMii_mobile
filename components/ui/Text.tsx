import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { cn } from "@/lib/utils";

type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "subtitle"
  | "body"
  | "bodyMedium"
  | "caption"
  | "captionMedium"
  | "label";

type Color =
  | "default"
  | "primary"
  | "secondary"
  | "muted"
  | "inverse"
  | "accent"
  | "success"
  | "error"
  | "warning";

interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: Color;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  h1:            "text-4xl font-bold leading-tight",
  h2:            "text-3xl font-bold leading-tight",
  h3:            "text-2xl font-semibold leading-snug",
  h4:            "text-xl font-semibold leading-snug",
  subtitle:      "text-lg font-medium leading-snug",
  body:          "text-sm font-normal leading-relaxed",
  bodyMedium:    "text-sm font-medium leading-relaxed",
  caption:       "text-xs font-normal leading-relaxed",
  captionMedium: "text-xs font-medium leading-relaxed",
  label:         "text-[10px] font-semibold tracking-wide uppercase",
};

const colorClasses: Record<Color, string> = {
  default:   "text-grey-900",
  primary:   "text-primary-500",
  secondary: "text-grey-700",
  muted:     "text-grey-400",
  inverse:   "text-white",
  accent:    "text-accent",
  success:   "text-success",
  error:     "text-error",
  warning:   "text-warning",
};

export function Text({
  variant = "body",
  color = "default",
  className,
  ...props
}: TextProps) {
  return (
    <RNText
      className={cn(variantClasses[variant], colorClasses[color], className)}
      {...props}
    />
  );
}
