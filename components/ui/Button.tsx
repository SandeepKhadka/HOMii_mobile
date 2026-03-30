import React from "react";
import {
  Pressable,
  PressableProps,
  ActivityIndicator,
  View,
} from "react-native";
import { Text } from "./Text";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
  variant?:  Variant;
  size?:     Size;
  label:     string;
  loading?:  boolean;
  fullWidth?: boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<Variant, { container: string; label: string }> = {
  primary: {
    container: "bg-primary-500 active:bg-primary-600",
    label:     "text-white font-semibold",
  },
  secondary: {
    container: "bg-primary-50 active:bg-primary-100",
    label:     "text-primary-500 font-semibold",
  },
  outline: {
    container: "border border-primary-500 bg-transparent active:bg-primary-50",
    label:     "text-primary-500 font-semibold",
  },
  ghost: {
    container: "bg-transparent active:bg-grey-100",
    label:     "text-grey-700 font-medium",
  },
  danger: {
    container: "bg-error active:opacity-80",
    label:     "text-white font-semibold",
  },
};

const sizeStyles: Record<Size, { container: string; label: string }> = {
  sm: { container: "h-9 px-4 rounded-full",   label: "text-sm" },
  md: { container: "h-12 px-6 rounded-full",  label: "text-base" },
  lg: { container: "h-14 px-8 rounded-full",  label: "text-md" },
};

export function Button({
  variant  = "primary",
  size     = "md",
  label,
  loading  = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      className={cn(
        "flex-row items-center justify-center",
        variantStyles[variant].container,
        sizeStyles[size].container,
        fullWidth && "w-full",
        isDisabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "danger" ? "#fff" : "#0A7EF5"}
        />
      ) : (
        <>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text
            className={cn(
              variantStyles[variant].label,
              sizeStyles[size].label,
            )}
          >
            {label}
          </Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
}
