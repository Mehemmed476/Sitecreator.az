import type { UploadApiResponse } from "cloudinary";
import { getCloudinary } from "@/lib/cloudinary-server";

const MAX_IMAGE_SIZE = 6 * 1024 * 1024;
const CLOUDINARY_FOLDER = "sitecreator/insights";

export async function saveInsightImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image size must be 6MB or smaller.");
  }

  const cloudinary = getCloudinary();

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: "image",
      },
      (error, uploaded) => {
        if (error || !uploaded) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }

        resolve(uploaded);
      }
    );

    upload.end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteInsightImage(publicId?: string | null) {
  if (!publicId) {
    return;
  }

  const cloudinary = getCloudinary();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
}
