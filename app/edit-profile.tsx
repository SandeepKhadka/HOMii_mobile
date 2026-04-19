import { useState, useCallback } from "react";
import {
  View,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { Text, Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const YEAR_OPTIONS = [
  { key: "foundation", labelKey: "yearFoundation" },
  { key: "year_1",     labelKey: "yearOne" },
  { key: "year_2",     labelKey: "yearTwo" },
  { key: "year_3",     labelKey: "yearThree" },
  { key: "year_4",     labelKey: "yearFour" },
  { key: "masters",    labelKey: "yearMasters" },
  { key: "phd",        labelKey: "yearPhd" },
] as const;

function isValidDob(val: string): boolean {
  if (!val.trim()) return true; // optional field
  const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;
  const [, d, m, y] = match.map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function SectionHeader({ label }: { label: string }) {
  return (
    <View className="mt-6 mb-3">
      <Text variant="captionMedium" style={{ color: Colors.grey[500], letterSpacing: 0.8 }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text variant="captionMedium" color="secondary" className="mb-1.5">
      {label}{required ? " *" : ""}
    </Text>
  );
}

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation();

  const [fullName,    setFullName]    = useState(profile?.full_name ?? "");
  const [phone,       setPhone]       = useState(profile?.phone_number ?? "");
  const [dob,         setDob]         = useState(profile?.date_of_birth
    ? (() => {
        const [y, m, d] = (profile.date_of_birth ?? "").split("-");
        return `${d}/${m}/${y}`;
      })()
    : "");
  const [nationality, setNationality] = useState(profile?.nationality ?? "");
  const [course,      setCourse]      = useState(profile?.course ?? "");
  const [yearStudy,   setYearStudy]   = useState(profile?.year_of_study ?? "");
  const [address,     setAddress]     = useState(profile?.current_address ?? "");
  const [avatarUri,   setAvatarUri]   = useState<string | null>(profile?.avatar_url ?? null);
  const [saving,      setSaving]      = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [photoModal,  setPhotoModal]  = useState(false);

  const toDbDob = (val: string): string | null => {
    if (!val.trim()) return null;
    const [d, m, y] = val.split("/");
    return `${y}-${m}-${d}`;
  };

  const originalDob = profile?.date_of_birth
    ? (() => {
        const [y, m, d] = (profile.date_of_birth ?? "").split("-");
        return `${d}/${m}/${y}`;
      })()
    : "";

  const hasChanges =
    fullName.trim()    !== (profile?.full_name ?? "").trim() ||
    phone.trim()       !== (profile?.phone_number ?? "").trim() ||
    dob.trim()         !== originalDob.trim() ||
    nationality.trim() !== (profile?.nationality ?? "").trim() ||
    course.trim()      !== (profile?.course ?? "").trim() ||
    yearStudy          !== (profile?.year_of_study ?? "") ||
    address.trim()     !== (profile?.current_address ?? "").trim() ||
    avatarUri          !== (profile?.avatar_url ?? null);

  const pickImage = useCallback(async (source: "camera" | "library") => {
    setPhotoModal(false);
    const { status } = source === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      showAlert(
        t("common.error"),
        source === "camera"
          ? "Camera permission is required to take a photo."
          : "Photo library permission is required.",
        undefined,
        "error"
      );
      return;
    }

    const result = source === "camera"
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: "images",
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.75,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "images",
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.75,
        });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }, [t, showAlert]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      showAlert(t("common.error"), t("editProfile.nameRequired"), undefined, "error");
      return;
    }
    if (dob.trim() && !isValidDob(dob)) {
      showAlert(t("common.error"), t("editProfile.dobInvalid"), undefined, "error");
      return;
    }

    setSaving(true);

    let finalAvatarUrl = profile?.avatar_url ?? null;

    // Upload new photo if user picked a local image
    if (avatarUri && avatarUri !== profile?.avatar_url) {
      setUploading(true);
      try {
        finalAvatarUrl = await uploadImageToCloudinary(avatarUri);
      } catch {
        setUploading(false);
        setSaving(false);
        showAlert(t("editProfile.uploadFailed"), t("editProfile.uploadFailedMessage"), undefined, "error");
        return;
      }
      setUploading(false);
    }

    await updateProfile({
      full_name:       fullName.trim() || null,
      phone_number:    phone.trim() || null,
      date_of_birth:   toDbDob(dob),
      nationality:     nationality.trim() || null,
      course:          course.trim() || null,
      year_of_study:   yearStudy || null,
      current_address: address.trim() || null,
      avatar_url:      finalAvatarUrl,
    });

    setSaving(false);
    showAlert(t("editProfile.savedTitle"), t("editProfile.savedMessage"), [
      { text: "OK", onPress: () => router.back() },
    ], "success");
  };

  const avatarSource = avatarUri ? { uri: avatarUri } : null;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View
        className="flex-row items-center px-4 pb-4 bg-white border-b border-grey-100"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center mr-2"
        >
          <Ionicons name="arrow-back" size={22} color={Colors.grey[900]} />
        </Pressable>
        <Text style={{ fontFamily: "BricolageGrotesque_700Bold", fontSize: 18 }} className="text-grey-900 flex-1">
          {t("editProfile.title")}
        </Text>
        {(saving || uploading) && <ActivityIndicator size="small" color={Colors.primary[600]} />}
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Avatar */}
        <View className="items-center mt-6 mb-2">
          <Pressable
            onPress={() => setPhotoModal(true)}
            style={{ position: "relative" }}
          >
            {avatarSource ? (
              <Image
                source={avatarSource}
                style={{ width: 88, height: 88, borderRadius: 44 }}
              />
            ) : (
              <View
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  backgroundColor: Colors.grey[100],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="person" size={40} color={Colors.grey[400]} />
              </View>
            )}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: Colors.primary[600],
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#fff",
              }}
            >
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </Pressable>
          <Pressable onPress={() => setPhotoModal(true)}>
            <Text variant="captionMedium" style={{ color: Colors.primary[600], marginTop: 8 }}>
              {t("editProfile.changePhoto")}
            </Text>
          </Pressable>
        </View>

        {/* ── Personal Information ──────────────────── */}
        <SectionHeader label={t("editProfile.sectionPersonal")} />

        <View className="gap-4">
          {/* Full Name */}
          <View>
            <FieldLabel label={t("editProfile.fullNameLabel")} required />
            <View className="flex-row items-center border border-grey-200 rounded-xl px-4 h-12 bg-white gap-3">
              <Ionicons name="person-outline" size={18} color={Colors.grey[400]} />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder={t("editProfile.fullNamePlaceholder")}
                placeholderTextColor={Colors.grey[400]}
                autoCapitalize="words"
                autoComplete="name"
                style={{ flex: 1, color: Colors.grey[900], fontSize: 15 }}
              />
            </View>
          </View>

          {/* Phone */}
          <View>
            <FieldLabel label={t("editProfile.phoneLabel")} />
            <View className="flex-row items-center border border-grey-200 rounded-xl px-4 h-12 bg-white gap-3">
              <Ionicons name="call-outline" size={18} color={Colors.grey[400]} />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder={t("editProfile.phonePlaceholder")}
                placeholderTextColor={Colors.grey[400]}
                keyboardType="phone-pad"
                autoComplete="tel"
                style={{ flex: 1, color: Colors.grey[900], fontSize: 15 }}
              />
            </View>
          </View>

          {/* Date of Birth */}
          <View>
            <FieldLabel label={t("editProfile.dobLabel")} />
            <View className="flex-row items-center border border-grey-200 rounded-xl px-4 h-12 bg-white gap-3">
              <Ionicons name="calendar-outline" size={18} color={Colors.grey[400]} />
              <TextInput
                value={dob}
                onChangeText={(v) => {
                  // Auto-insert slashes: 01 → 01/ → 01/05 → 01/05/
                  const digits = v.replace(/\D/g, "").slice(0, 8);
                  let formatted = digits;
                  if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
                  if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
                  setDob(formatted);
                }}
                placeholder={t("editProfile.dobPlaceholder")}
                placeholderTextColor={Colors.grey[400]}
                keyboardType="number-pad"
                maxLength={10}
                style={{ flex: 1, color: Colors.grey[900], fontSize: 15 }}
              />
            </View>
          </View>

          {/* Nationality */}
          <View>
            <FieldLabel label={t("editProfile.nationalityLabel")} />
            <View className="flex-row items-center border border-grey-200 rounded-xl px-4 h-12 bg-white gap-3">
              <Ionicons name="globe-outline" size={18} color={Colors.grey[400]} />
              <TextInput
                value={nationality}
                onChangeText={setNationality}
                placeholder={t("editProfile.nationalityPlaceholder")}
                placeholderTextColor={Colors.grey[400]}
                autoCapitalize="words"
                style={{ flex: 1, color: Colors.grey[900], fontSize: 15 }}
              />
            </View>
          </View>
        </View>

        {/* ── Academic Details ──────────────────────── */}
        <SectionHeader label={t("editProfile.sectionAcademic")} />

        <View className="gap-4">
          {/* Course */}
          <View>
            <FieldLabel label={t("editProfile.courseLabel")} />
            <View className="flex-row items-center border border-grey-200 rounded-xl px-4 h-12 bg-white gap-3">
              <Ionicons name="book-outline" size={18} color={Colors.grey[400]} />
              <TextInput
                value={course}
                onChangeText={setCourse}
                placeholder={t("editProfile.coursePlaceholder")}
                placeholderTextColor={Colors.grey[400]}
                autoCapitalize="words"
                style={{ flex: 1, color: Colors.grey[900], fontSize: 15 }}
              />
            </View>
          </View>

          {/* Year of Study */}
          <View>
            <FieldLabel label={t("editProfile.yearLabel")} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
              <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 4, paddingVertical: 2 }}>
                {YEAR_OPTIONS.map((opt) => {
                  const active = yearStudy === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      onPress={() => setYearStudy(active ? "" : opt.key)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 20,
                        borderWidth: 1.5,
                        backgroundColor: active ? Colors.primary[600] : "#fff",
                        borderColor: active ? Colors.primary[600] : Colors.grey[200],
                      }}
                    >
                      <Text
                        variant="captionMedium"
                        style={{ color: active ? "#fff" : Colors.grey[600] }}
                      >
                        {t(`editProfile.${opt.labelKey}`)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* ── Address ───────────────────────────────── */}
        <SectionHeader label={t("editProfile.sectionAddress")} />

        <View>
          <FieldLabel label={t("editProfile.addressLabel")} />
          <View className="border border-grey-200 rounded-xl px-4 pt-3 pb-3 bg-white">
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder={t("editProfile.addressPlaceholder")}
              placeholderTextColor={Colors.grey[400]}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              autoCapitalize="words"
              style={{ color: Colors.grey[900], fontSize: 15, minHeight: 72 }}
            />
          </View>
        </View>

        {/* ── Account ───────────────────────────────── */}
        <SectionHeader label={t("editProfile.sectionAccount")} />

        <View className="gap-1.5">
          <FieldLabel label={t("editProfile.emailLabel")} />
          <View className="flex-row items-center border border-grey-200 rounded-xl px-4 h-12 bg-grey-50 gap-3">
            <Ionicons name="mail-outline" size={18} color={Colors.grey[400]} />
            <Text variant="body" style={{ color: Colors.grey[500], flex: 1 }}>
              {profile?.email ?? ""}
            </Text>
          </View>
          <Text variant="caption" color="muted" className="mt-0.5">
            {t("editProfile.emailNote")}
          </Text>
        </View>

        {/* Save button */}
        <View className="mt-8">
          <Button
            variant="primary"
            size="lg"
            label={saving ? t("editProfile.saving") : t("editProfile.save")}
            fullWidth
            disabled={saving || !hasChanges}
            onPress={handleSave}
          />
        </View>
      </ScrollView>

      {/* Photo source modal */}
      <Modal
        transparent
        visible={photoModal}
        animationType="fade"
        onRequestClose={() => setPhotoModal(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
          onPress={() => setPhotoModal(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: insets.bottom + 16,
              gap: 4,
            }}
          >
            <Text variant="bodyMedium" className="text-grey-900 mb-3">
              {t("editProfile.changePhoto")}
            </Text>

            <Pressable
              onPress={() => pickImage("camera")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: Colors.grey[100],
              }}
            >
              <Ionicons name="camera-outline" size={22} color={Colors.grey[700]} />
              <Text variant="body" className="text-grey-900">{t("editProfile.takePhoto")}</Text>
            </Pressable>

            <Pressable
              onPress={() => pickImage("library")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 14,
              }}
            >
              <Ionicons name="image-outline" size={22} color={Colors.grey[700]} />
              <Text variant="body" className="text-grey-900">{t("editProfile.chooseLibrary")}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
