import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { capture } from "@/lib/analytics";
import { useTranslation } from "react-i18next";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({ name, color }: { name: IoniconsName; color: string }) {
  return <Ionicons name={name} size={22} color={color} />;
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tabs
      screenListeners={({ route }) => ({
        tabPress: () => capture('home_tab_changed', { tab: route.name }),
      })}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   Colors.primary[500],
        tabBarInactiveTintColor: Colors.grey[400],
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor:  Colors.grey[100],
          borderTopWidth:  1,
          paddingTop:      6,
          paddingBottom:   insets.bottom + 8,
          height:          56 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontFamily: "BricolageGrotesque_500Medium",
          fontSize:   10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? "home" : "home-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="apps"
        options={{
          title: t("tabs.apps"),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? "grid" : "grid-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="connect"
        options={{
          title: t("tabs.connect"),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? "people-circle" : "people-circle-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ambassadors"
        options={{
          title: t("tabs.ambassadors"),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? "people" : "people-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setup"
        options={{
          href: null, // hide from tab bar
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? "person" : "person-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
