import React, { createContext, useContext, useState, useCallback } from "react";
import { Modal, View, Pressable, StyleSheet, Text as RNText } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getButtonBg(btnStyle?: string) {
  if (btnStyle === "cancel") return Colors.grey[100];
  if (btnStyle === "destructive") return Colors.error.DEFAULT;
  return Colors.primary[500];
}

function getButtonTextColor(btnStyle?: string) {
  return btnStyle === "cancel" ? Colors.grey[700] : "#fff";
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AlertConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const showAlert = useCallback(
    (
      title: string,
      message?: string,
      buttons?: AlertButton[],
      type: AlertType = "info",
    ) => {
      const resolvedButtons: AlertButton[] =
        buttons && buttons.length > 0 ? buttons : [{ text: "OK" }];
      setConfig({ title, message, buttons: resolvedButtons, type });
      setVisible(true);
    },
    [],
  );

  const dismiss = useCallback((onPress?: () => void) => {
    setVisible(false);
    setConfig(null);
    onPress?.();
  }, []);

  const typeConfig = config ? TYPE_CONFIG[config.type] : TYPE_CONFIG.info;

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => dismiss()}
      >
        <View style={styles.backdrop}>
          <View style={styles.centeredView}>
            <View style={styles.card}>
              {/* Icon */}
              <View style={styles.contentCenter}>
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
                <RNText style={styles.title}>{config?.title}</RNText>

                {/* Message */}
                {config?.message ? (
                  <RNText style={styles.message}>{config.message}</RNText>
                ) : null}
              </View>

              {/* Buttons — static styles only, no function style */}
              <View style={styles.buttonRow}>
                {config?.buttons.map((btn, i) => (
                  <Pressable
                    key={i}
                    onPress={() => dismiss(btn.onPress)}
                    android_ripple={{ color: "rgba(255,255,255,0.25)" }}
                    style={[
                      styles.button,
                      config.buttons.length > 1
                        ? styles.buttonFlex
                        : styles.buttonFull,
                      { backgroundColor: getButtonBg(btn.style) },
                      btn.style === "cancel" && styles.cancelBorder,
                    ]}
                  >
                    <RNText
                      style={[
                        styles.buttonText,
                        { color: getButtonTextColor(btn.style) },
                      ]}
                    >
                      {btn.text}
                    </RNText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAlert = () => useContext(AlertContext);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
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
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
  },
  contentCenter: {
    alignItems: "center",
  },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontFamily: "BricolageGrotesque_700Bold",
    fontSize: 18,
    lineHeight: 26,
    color: Colors.grey[900],
    textAlign: "center",
  },
  message: {
    fontFamily: "BricolageGrotesque_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: Colors.grey[400],
    textAlign: "center",
    marginTop: 6,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 22,
    gap: 10,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonFlex: {
    flex: 1,
  },
  buttonFull: {
    width: "100%",
  },
  cancelBorder: {
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  buttonText: {
    fontFamily: "BricolageGrotesque_600SemiBold",
    fontSize: 15,
    textAlign: "center",
  },
});
