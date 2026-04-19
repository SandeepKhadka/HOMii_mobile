import { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";

async function checkConnectivity(): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch("https://www.google.com/generate_204", {
      method: "HEAD",
      signal: ctrl.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    return res.status === 204 || res.ok;
  } catch {
    return false;
  }
}

export function OfflineBanner() {
  const [status, setStatus] = useState<"online" | "offline" | "reconnected" | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevConnected = useRef(true);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const connected = await checkConnectivity();
      if (cancelled) return;
      setStatus((prev) => {
        if (!connected) {
          prevConnected.current = false;
          return "offline";
        }
        if (!prevConnected.current) {
          prevConnected.current = true;
          return "reconnected";
        }
        return prev ?? "online";
      });
    };

    poll();
    const interval = setInterval(poll, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);

    if (status === "offline") {
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else if (status === "reconnected") {
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      hideTimer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }).start(() =>
          setStatus("online")
        );
      }, 2500);
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  }, [status]);

  if (status === "online" || status === null) return null;

  const isOffline = status === "offline";

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 90,
        left: 16,
        right: 16,
        zIndex: 9999,
        opacity,
      }}
      pointerEvents="none"
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: isOffline ? "#ef4444" : "#16a34a",
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        <Ionicons
          name={isOffline ? "wifi-outline" : "checkmark-circle-outline"}
          size={18}
          color="#fff"
        />
        <Text variant="captionMedium" style={{ color: "#fff" }}>
          {isOffline ? "No internet connection" : "Back online"}
        </Text>
      </View>
    </Animated.View>
  );
}
