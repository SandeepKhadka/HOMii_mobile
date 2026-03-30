import React from "react";
import { View, ViewProps, Pressable, PressableProps } from "react-native";
import { cn } from "@/lib/utils";

interface CardProps extends ViewProps {
  children:   React.ReactNode;
  className?: string;
  elevated?:  boolean;
}

interface PressableCardProps extends PressableProps {
  children:   React.ReactNode;
  className?: string;
  elevated?:  boolean;
}

const baseClasses = "bg-white rounded-2xl p-4";
const elevatedClasses = "shadow-card";

export function Card({ children, className, elevated = true, ...props }: CardProps) {
  return (
    <View
      className={cn(baseClasses, elevated && elevatedClasses, className)}
      {...props}
    >
      {children}
    </View>
  );
}

export function PressableCard({
  children,
  className,
  elevated = true,
  ...props
}: PressableCardProps) {
  return (
    <Pressable
      className={cn(
        baseClasses,
        elevated && elevatedClasses,
        "active:opacity-80",
        className,
      )}
      {...props}
    >
      {children}
    </Pressable>
  );
}
