import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({ name, color }: { name: IoniconsName; color: string }) {
  return <Ionicons name={name} size={22} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   Colors.primary[500],
        tabBarInactiveTintColor: Colors.grey[400],
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor:  Colors.grey[100],
          borderTopWidth:  1,
          paddingTop:      6,
          paddingBottom:   8,
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
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? "home" : "home-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="apps"
        options={{
          title: "Apps",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? "grid" : "grid-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ambassadors"
        options={{
          title: "Ambassadors",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? "people" : "people-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? "person" : "person-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
