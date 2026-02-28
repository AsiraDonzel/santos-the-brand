const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = "ml_default";

export const uploadImage = async (file: string | Blob) => {
  if (!file) throw new Error("No file selected");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Cloudinary error:", errorData);
      throw new Error("Image upload failed");
    }

    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
