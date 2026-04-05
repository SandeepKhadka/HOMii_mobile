import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useState, useMemo, useEffect } from "react";
import { router } from "expo-router";
import { Text, Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

// Fallback list in case API is unavailable
const FALLBACK_UNIVERSITIES = [
  { name: "University College London", city: "London" },
  { name: "University of Manchester", city: "Manchester" },
  { name: "University of Edinburgh", city: "Edinburgh" },
  { name: "King's College London", city: "London" },
  { name: "University of Glasgow", city: "Glasgow" },
  { name: "University of Leeds", city: "Leeds" },
  { name: "University of Birmingham", city: "Birmingham" },
  { name: "Imperial College London", city: "London" },
  { name: "University of Nottingham", city: "Nottingham" },
  { name: "University of Bristol", city: "Bristol" },
  { name: "University of the West of England (UWE Bristol)", city: "Bristol" },
  { name: "University of Sheffield", city: "Sheffield" },
  { name: "University of Liverpool", city: "Liverpool" },
  { name: "Cardiff University", city: "Cardiff" },
  { name: "University of Exeter", city: "Exeter" },
  { name: "University of Southampton", city: "Southampton" },
  { name: "University of Bath", city: "Bath" },
  { name: "Swansea University", city: "Swansea" },
  { name: "University of Essex", city: "Colchester" },
  { name: "University of Huddersfield", city: "Huddersfield" },
];

export default function UniversityScreen() {
  const insets = useSafeAreaInsets();
  const { updateProfile } = useAuth();
  const [universities, setUniversities] = useState(FALLBACK_UNIVERSITIES);
  const [loadingUnis, setLoadingUnis] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getUniversities()
      .then((data) => {
        if (data && data.length > 0) {
          setUniversities(data.map((u) => ({ name: u.name, city: u.city })));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingUnis(false));
  }, []);

  const filtered = useMemo(
    () => universities.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase())
    ),
    [search],
  );

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 8 }}>
      {/* Back */}
      <View className="px-4">
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
          <Text
            className="text-center text-grey-900"
            style={{
              fontFamily: "BricolageGrotesque_700Bold",
              fontSize: 26,
              lineHeight: 34,
            }}
          >
            Select your University
          </Text>
          <Text variant="body" color="muted" className="text-center">
            We'll personalize your setup and resources
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
                  {selected === uni.name && (
                    <Ionicons name="checkmark-circle" size={24} color={Colors.success.DEFAULT} />
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
      <View className="px-6" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button
          variant="primary"
          size="lg"
          label="Continue"
          fullWidth
          disabled={!selected}
          onPress={async () => {
            if (!selected) return;
            setSaving(true);
            await updateProfile({ university: selected });
            setSaving(false);
            router.push("/(onboarding)/checklist-intro");
          }}
        />
      </View>
    </View>
  );
}
