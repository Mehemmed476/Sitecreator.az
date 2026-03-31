import type { UploadApiResponse } from "cloudinary";
import { getCloudinary } from "@/lib/cloudinary-server";

const MAX_CHAT_FILE_SIZE = 10 * 1024 * 1024;
const CHAT_FOLDER = "sitecreator/project-chat";

export async function uploadProjectChatAttachments(files: File[]) {
  if (!files.length) {
    return [];
  }

  const cloudinary = getCloudinary();

  return Promise.all(
    files.map(async (file) => {
      if (file.size > MAX_CHAT_FILE_SIZE) {
        throw new Error(`${file.name} 10MB limitini keçir.`);
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          {
            folder: CHAT_FOLDER,
            resource_type: "auto",
            use_filename: true,
            unique_filename: true,
          },
          (error, uploaded) => {
            if (error || !uploaded) {
              reject(error ?? new Error("Attachment upload failed."));
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
        originalName: file.name,
        resourceType: result.resource_type,
        format: result.format,
        bytes: result.bytes,
        width: typeof result.width === "number" ? result.width : undefined,
        height: typeof result.height === "number" ? result.height : undefined,
      };
    })
  );
}
