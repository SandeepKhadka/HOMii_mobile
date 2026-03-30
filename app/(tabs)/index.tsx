import { View, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";

const ESSENTIAL_APPS = [
  { id: "food",         title: "Food",           icon: "restaurant-outline" as const, color: "#FEF3C7", iconColor: "#F97316" },
  { id: "transport",    title: "Transport",       icon: "bus-outline"        as const, color: "#DBEAFE", iconColor: "#1E293B" },
  { id: "university",   title: "University",      icon: "school-outline"     as const, color: "#E5E7EB", iconColor: "#6B7280" },
  { id: "discounts",    title: "Discounts",       icon: "pricetag-outline"   as const, color: "#FFE4E6", iconColor: "#F43F5E" },
  { id: "flights",      title: "Flights",         icon: "airplane-outline"   as const, color: "#E0E7FF", iconColor: "#6366F1" },
  { id: "socialEvents", title: "Social Events",   icon: "calendar-outline"   as const, color: "#FFE4E6", iconColor: "#F472B6" },
];

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      {/* Hero header */}
      <View className="bg-primary-400 pt-14 pb-8 px-6 rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <Text variant="h3" color="inverse" className="font-heading">
            HOMii
          </Text>
          <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
            <Ionicons name="person-outline" size={20} color="#fff" />
          </View>
        </View>
        <Text variant="subtitle" color="inverse" className="mt-1 opacity-90">
          Hello, Luke
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 -mt-4">
        {/* Continue journey CTA */}
        <View className="mx-6 mt-2">
          <Button
            variant="primary"
            size="lg"
            label="Continue your journey."
            fullWidth
            onPress={() => {}}
          />
        </View>

        {/* Setup progress */}
        <View className="px-6 mt-6 gap-2">
          <Text variant="label" className="text-grey-500 tracking-widest">
            SETUP PROGRESS
          </Text>
          <View className="h-2 bg-grey-200 rounded-full overflow-hidden">
            <View className="h-full w-1/4 bg-primary-500 rounded-full" />
          </View>
        </View>

        {/* Essential Apps */}
        <View className="px-6 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text variant="h3" className="font-heading text-grey-900">
              ESSENTIAL APPS
            </Text>
            <Pressable>
              <Text variant="bodyMedium" color="muted">Explore All</Text>
            </Pressable>
          </View>

          <View className="flex-row flex-wrap gap-4">
            {ESSENTIAL_APPS.map((app) => (
              <Pressable
                key={app.id}
                className="w-[47%] bg-white rounded-2xl overflow-hidden shadow-card"
                onPress={() => router.push(`/category/${app.id}` as any)}
              >
                <View
                  className="h-24 items-center justify-center"
                  style={{ backgroundColor: app.color }}
                >
                  <Ionicons name={app.icon} size={28} color={app.iconColor} />
                </View>
                <View className="p-3">
                  <Text variant="bodyMedium" className="text-grey-800">{app.title}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Explore UK banner */}
        <View className="mx-6 mt-6 mb-8 bg-primary-400 rounded-2xl p-6">
          <Text variant="h3" color="inverse" className="font-heading">
            Explore UK
          </Text>
          <Text variant="body" color="inverse" className="opacity-80 mt-1">
            Discover top local locations
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
