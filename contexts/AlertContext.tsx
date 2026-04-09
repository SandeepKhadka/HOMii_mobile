import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import {
  Modal, View, Pressable, Animated, StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui";
import { Colors } from "@/constants/colors";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertType = "info" | "success" | "error" | "warning";

export type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
};

type AlertConfig = {
  title: string;
  message?: string;
  buttons: AlertButton[];
  type: AlertType;
};

type AlertContextType = {
  showAlert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    type?: AlertType,
  ) => void;
};

// ─── Config per type ──────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  info: {
    icon: "information-circle" as const,
    color: Colors.primary[500],
    bg: Colors.primary[50],
  },
  success: {
    icon: "checkmark-circle" as const,
    color: Colors.success.DEFAULT,
    bg: Colors.success.light,
  },
  error: {
    icon: "alert-circle" as const,
    color: Colors.error.DEFAULT,
    bg: Colors.error.light,
  },
  warning: {
    icon: "warning" as const,
    color: Colors.warning.DEFAULT,
    bg: Colors.warning.light,
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AlertContext = createContext<AlertContextType>({ showAlert: () => {} });

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AlertConfig | null>(null);
  const [visible, setVisible] = useState(false);
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  const showAlert = useCallback(
    (
      title: string,
      message?: string,
      buttons?: AlertButton[],
      type: AlertType = "info",
    ) => {
      const resolvedButtons: AlertButton[] =
        buttons?.length ? buttons : [{ text: "OK" }];
      setConfig({ title, message, buttons: resolvedButtons, type });
      setVisible(true);
      backdropAnim.setValue(0);
      cardAnim.setValue(0);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(cardAnim, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [],
  );

  const dismiss = useCallback((onPress?: () => void) => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      setConfig(null);
      onPress?.();
    });
  }, []);

  const typeConfig = config ? TYPE_CONFIG[config.type] : TYPE_CONFIG.info;

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        {/* Backdrop */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0,0,0,0.45)", opacity: backdropAnim },
          ]}
        />

        {/* Centered card */}
        <View style={styles.centeredView}>
          <Animated.View
            style={[
              styles.card,
              {
                opacity: cardAnim,
                transform: [
                  {
                    scale: cardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.88, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Icon */}
            <View
              style={[styles.iconWrap, { backgroundColor: typeConfig.bg }]}
            >
              <Ionicons
                name={typeConfig.icon}
                size={34}
                color={typeConfig.color}
              />
            </View>

            {/* Title */}
            <Text
              style={{
                fontFamily: "BricolageGrotesque_700Bold",
                fontSize: 18,
                lineHeight: 26,
                color: Colors.grey[900],
                textAlign: "center",
                marginBottom: config?.message ? 6 : 0,
              }}
            >
              {config?.title}
            </Text>

            {/* Message */}
            {config?.message ? (
              <Text
                variant="body"
                color="muted"
                style={{ textAlign: "center", lineHeight: 22 }}
              >
                {config.message}
              </Text>
            ) : null}

            {/* Buttons */}
            <View
              style={[
                styles.buttonRow,
                (config?.buttons.length ?? 0) === 1 &&
                  styles.buttonRowSingle,
              ]}
            >
              {config?.buttons.map((btn, i) => {
                const isDestructive = btn.style === "destructive";
                const isCancel = btn.style === "cancel";
                return (
                  <Pressable
                    key={i}
                    onPress={() => dismiss(btn.onPress)}
                    style={({ pressed }) => [
                      styles.button,
                      (config?.buttons.length ?? 1) > 1 && { flex: 1 },
                      !isCancel &&
                        !isDestructive && {
                          backgroundColor: Colors.primary[500],
                        },
                      isDestructive && {
                        backgroundColor: Colors.error.DEFAULT,
                      },
                      isCancel && styles.cancelButton,
                      pressed && { opacity: 0.75 },
                    ]}
                  >
                    <Text
                      style={{
                        fontFamily: "BricolageGrotesque_600SemiBold",
                        fontSize: 15,
                        color: isCancel ? Colors.grey[700] : "#fff",
                        textAlign: "center",
                      }}
                    >
                      {btn.text}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAlert = () => useContext(AlertContext);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 10,
  },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 22,
    width: "100%",
    gap: 10,
  },
  buttonRowSingle: {},
  button: {
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.grey[100],
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
});
