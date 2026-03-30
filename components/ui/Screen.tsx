import React, { PropsWithChildren } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

type ScreenProps = PropsWithChildren<{
  scrollable?:       boolean;
  keyboardAvoiding?: boolean;
  edges?:            ("top" | "bottom" | "left" | "right")[];
  className?:        string;
  contentClassName?: string;
}>;

export function Screen({
  children,
  scrollable       = false,
  keyboardAvoiding = false,
  edges            = ["top", "bottom"],
  className,
  contentClassName,
}: ScreenProps) {
  const inner = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      className={cn("flex-1", contentClassName)}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={cn("flex-1", contentClassName)}>{children}</View>
  );

  const content = keyboardAvoiding ? (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : inner;

  return (
    <SafeAreaView
      edges={edges}
      className={cn("flex-1 bg-background", className)}
    >
      {content}
    </SafeAreaView>
  );
}
