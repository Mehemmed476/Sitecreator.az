import type { UploadApiResponse } from "cloudinary";
import { getCloudinary } from "@/lib/cloudinary-server";

const MAX_IMAGE_SIZE = 6 * 1024 * 1024;
const SITECREATOR_PREFIX = "sitecreator/";
const LIBRARY_FOLDER = "sitecreator/library";

export type MediaLibraryAsset = {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
  folder: string;
  filename: string;
};

function mapAsset(resource: {
  public_id?: string;
  secure_url?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  created_at?: string;
  folder?: string;
  asset_folder?: string;
  filename?: string;
}) {
  const publicId = String(resource.public_id ?? "");
  const segments = publicId.split("/");
  const filename = segments[segments.length - 1] ?? publicId;

  return {
    publicId,
    url: String(resource.secure_url ?? ""),
    width: Number(resource.width ?? 0),
    height: Number(resource.height ?? 0),
    format: String(resource.format ?? ""),
    bytes: Number(resource.bytes ?? 0),
    createdAt: String(resource.created_at ?? ""),
    folder: String(resource.asset_folder ?? resource.folder ?? ""),
    filename,
  } satisfies MediaLibraryAsset;
}

export async function listMediaLibraryAssets(): Promise<MediaLibraryAsset[]> {
  const cloudinary = getCloudinary();
  const response = await cloudinary.api.resources({
    type: "upload",
    prefix: SITECREATOR_PREFIX,
    max_results: 100,
    resource_type: "image",
  });

  const resources = Array.isArray(response.resources) ? response.resources : [];

  return resources
    .map(mapAsset)
    .filter((item: MediaLibraryAsset) => Boolean(item.publicId && item.url))
    .sort((left: MediaLibraryAsset, right: MediaLibraryAsset) =>
      right.createdAt.localeCompare(left.createdAt)
    );
}

export async function uploadMediaLibraryAsset(file: File): Promise<MediaLibraryAsset> {
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
        folder: LIBRARY_FOLDER,
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

  return mapAsset(result);
}

export async function deleteMediaLibraryAsset(publicId: string) {
  if (!publicId) {
    return;
  }

  const cloudinary = getCloudinary();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
}
