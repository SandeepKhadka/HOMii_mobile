import { supabase } from "./supabase";

const BUCKET = "avatars";

// Uploads a local image (from ImagePicker) to Supabase Storage and returns
// a public URL. Uses one fixed path per user (`<uid>/avatar.jpg`) with
// upsert, then appends a cache-busting query param so the new image renders
// immediately even though the path is reused.
export async function uploadAvatarToSupabase(
  userId: string,
  localUri: string,
): Promise<string> {
  // React Native's fetch can read a `file://` URI and produce an ArrayBuffer.
  // This is the officially-recommended path in Supabase's RN docs and avoids
  // the FormData / Blob quirks that bite on Hermes.
  const arrayBuffer = await fetch(localUri).then((res) => res.arrayBuffer());

  const path = `${userId}/avatar.jpg`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    throw new Error(`Avatar upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}
