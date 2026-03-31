import path from "node:path";
import { unlink } from "node:fs/promises";
import type { UploadApiResponse } from "cloudinary";
import { getCloudinary } from "@/lib/cloudinary-server";

const PORTFOLIO_UPLOAD_WEB_PATH = "/uploads/portfolio";
const MAX_IMAGE_SIZE = 6 * 1024 * 1024;
const CLOUDINARY_FOLDER = "sitecreator/portfolio";

function localFilePathFromUrl(imageUrl: string) {
  const fileName = imageUrl.replace(`${PORTFOLIO_UPLOAD_WEB_PATH}/`, "");
  return path.join(process.cwd(), "public", "uploads", "portfolio", fileName);
}

export function isPortfolioUploadUrl(imageUrl: string) {
  return imageUrl.startsWith(`${PORTFOLIO_UPLOAD_WEB_PATH}/`);
}

export async function savePortfolioImage(file: File) {
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

export async function deletePortfolioImage(
  imageUrl?: string | null,
  imagePublicId?: string | null
) {
  if (imagePublicId) {
    const cloudinary = getCloudinary();
    await cloudinary.uploader.destroy(imagePublicId, {
      resource_type: "image",
      invalidate: true,
    });
    return;
  }

  if (!imageUrl || !isPortfolioUploadUrl(imageUrl)) {
    return;
  }

  try {
    await unlink(localFilePathFromUrl(imageUrl));
  } catch {
    return;
  }
}
