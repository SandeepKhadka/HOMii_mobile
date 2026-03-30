import { View, ScrollView, Pressable } from "react-native";
import { useState, useMemo } from "react";
import { router } from "expo-router";
import { Screen, Text, Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

const UNIVERSITIES = [
  { name: "University of Manchester", city: "Manchester, UK" },
  { name: "University College London", city: "London, UK" },
  { name: "University of Birmingham", city: "Birmingham, UK" },
  { name: "University of Edinburgh", city: "Edinburgh, UK" },
  { name: "University of Leeds", city: "Leeds, UK" },
  { name: "University of Sheffield", city: "Sheffield, UK" },
  { name: "University of Nottingham", city: "Nottingham, UK" },
  { name: "University of Liverpool", city: "Liverpool, UK" },
  { name: "University of Bristol", city: "Bristol, UK" },
  { name: "University of Exeter", city: "Exeter, UK" },
  { name: "University of Southampton", city: "Southampton, UK" },
  { name: "University of Leicester", city: "Leicester, UK" },
  { name: "Newcastle University", city: "Newcastle, UK" },
  { name: "Cardiff University", city: "Cardiff, UK" },
  { name: "University of Glasgow", city: "Glasgow, UK" },
  { name: "Queen's University Belfast", city: "Belfast, UK" },
  { name: "University of Warwick", city: "Coventry, UK" },
  { name: "Loughborough University", city: "Loughborough, UK" },
  { name: "Coventry University", city: "Coventry, UK" },
  { name: "De Montfort University", city: "Leicester, UK" },
];

export default function UniversityScreen() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(
    () => UNIVERSITIES.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  return (
    <Screen className="bg-white" edges={["top", "bottom"]}>
      {/* Back */}
      <View className="px-4 pt-2">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
        </Pressable>
      </View>

      <View className="flex-1 px-6 pt-2 gap-5">
        {/* Icon */}
        <View className="items-center">
          <Ionicons name="school-outline" size={48} color={Colors.primary[500]} />
        </View>

        {/* Title */}
        <View className="items-center gap-1">
          <Text variant="h2" className="text-center font-heading text-grey-900">
            Select you University
          </Text>
          <Text variant="body" color="muted" className="text-center">
            We will personalize your setup and{"\n"}resources
          </Text>
        </View>

        {/* Search */}
        <Input
          placeholder="Search for your university"
          value={search}
          onChangeText={setSearch}
          leftIcon={<Ionicons name="search-outline" size={18} color={Colors.grey[400]} />}
          autoCorrect={false}
        />

        {/* List */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="gap-3 pb-4">
            {filtered.map((uni) => (
              <Pressable
                key={uni.name}
                onPress={() => setSelected(uni.name)}
                className={cn(
                  "px-5 py-4 rounded-2xl border",
                  selected === uni.name
                    ? "border-primary-200 bg-primary-50"
                    : "border-grey-200 bg-white",
                )}
              >
                <View className="flex-row items-center">
                  <View className="flex-1">
                    <Text variant="bodyMedium" className="text-grey-900">
                      {uni.name}
                    </Text>
                    <Text variant="caption" color="muted">
                      {uni.city}
                    </Text>
                  </View>
                  {selected === uni.name ? (
                    <Ionicons name="checkmark-circle" size={24} color={Colors.success.DEFAULT} />
                  ) : (
                    <View />
                  )}
                </View>
              </Pressable>
            ))}
            {filtered.length === 0 && (
              <Text variant="body" color="muted" className="text-center py-8">
                No universities found
              </Text>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Continue */}
      <View className="px-6 pb-8">
        <Button
          variant="primary"
          size="lg"
          label="Continue"
          fullWidth
          disabled={!selected}
          onPress={() => router.push("/(onboarding)/terms")}
        />
      </View>
    </Screen>
  );
}
