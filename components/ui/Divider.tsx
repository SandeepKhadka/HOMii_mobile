import React from "react";
import { View } from "react-native";
import { Text } from "./Text";
import { cn } from "@/lib/utils";

interface DividerProps {
  label?:     string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <View className={cn("h-px bg-grey-200", className)} />;
  }

  return (
    <View className={cn("flex-row items-center gap-3", className)}>
      <View className="flex-1 h-px bg-grey-200" />
      <Text variant="caption" color="muted">
        {label}
      </Text>
      <View className="flex-1 h-px bg-grey-200" />
    </View>
  );
}
