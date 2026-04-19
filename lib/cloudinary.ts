const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export async function uploadImageToCloudinary(localUri: string): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary is not configured. Set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
  }

  const filename = localUri.split("/").pop() ?? "photo.jpg";
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const mimeType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  const formData = new FormData();
  formData.append("file", { uri: localUri, name: filename, type: mimeType } as any);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "homii/avatars");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Cloudinary upload failed: ${err}`);
  }

  const data = await response.json();
  return data.secure_url as string;
}
