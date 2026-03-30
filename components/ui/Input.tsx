import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  Pressable,
} from "react-native";
import { Text } from "./Text";
import { cn } from "@/lib/utils";

interface InputProps extends TextInputProps {
  label?:       string;
  error?:       string;
  hint?:        string;
  leftIcon?:    React.ReactNode;
  rightIcon?:   React.ReactNode;
  onRightIconPress?: () => void;
  className?:   string;
  inputClassName?: string;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  className,
  inputClassName,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className={cn("gap-1.5", className)}>
      {label && (
        <Text variant="captionMedium" color="secondary">
          {label}
        </Text>
      )}

      <View
        className={cn(
          "flex-row items-center bg-white border rounded-xl h-12 px-4",
          focused ? "border-primary-500" : "border-grey-200",
          error  ? "border-error bg-error-light" : "",
        )}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}

        <TextInput
          className={cn(
            "flex-1 text-grey-900 text-sm font-normal",
            inputClassName,
          )}
          placeholderTextColor="#9CA3AF"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />

        {rightIcon && (
          <Pressable onPress={onRightIconPress} className="ml-2">
            {rightIcon}
          </Pressable>
        )}
      </View>

      {error && (
        <Text variant="caption" color="error">
          {error}
        </Text>
      )}
      {!error && hint && (
        <Text variant="caption" color="muted">
          {hint}
        </Text>
      )}
    </View>
  );
}
