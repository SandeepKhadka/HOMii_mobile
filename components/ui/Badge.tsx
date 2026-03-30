import React from "react";
import { View, ViewProps } from "react-native";
import { Text } from "./Text";
import { cn } from "@/lib/utils";

type Variant = "primary" | "success" | "warning" | "error" | "grey";

interface BadgeProps extends ViewProps {
  label:      string;
  variant?:   Variant;
  className?: string;
}

const variantClasses: Record<Variant, { container: string; text: string }> = {
  primary: { container: "bg-primary-50",   text: "text-primary-500" },
  success: { container: "bg-success-light", text: "text-success-dark" },
  warning: { container: "bg-warning-light", text: "text-warning" },
  error:   { container: "bg-error-light",   text: "text-error" },
  grey:    { container: "bg-grey-100",      text: "text-grey-600" },
};

export function Badge({ label, variant = "primary", className, ...props }: BadgeProps) {
  return (
    <View
      className={cn(
        "px-2.5 py-1 rounded-full self-start",
        variantClasses[variant].container,
        className,
      )}
      {...props}
    >
      <Text variant="captionMedium" className={variantClasses[variant].text}>
        {label}
      </Text>
    </View>
  );
}
