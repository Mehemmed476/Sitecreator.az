import { connectDB } from "@/lib/db";
import {
  defaultSocialProofContent,
  sanitizeSocialProofContent,
  type SocialProofContent,
} from "@/lib/social-proof-content";
import { SocialProofContentModel } from "@/lib/models/SocialProofContent";

export async function loadSocialProofContent(): Promise<SocialProofContent> {
  await connectDB();

  const existing = await SocialProofContentModel.findOne({
    singletonKey: "main",
  }).lean();

  if (existing?.content) {
    return sanitizeSocialProofContent(existing.content);
  }

  const created = await SocialProofContentModel.create({
    singletonKey: "main",
    content: defaultSocialProofContent,
  });

  return sanitizeSocialProofContent(created.toObject().content);
}

export async function saveSocialProofContent(input: unknown): Promise<SocialProofContent> {
  const content = sanitizeSocialProofContent(input);

  await connectDB();
  await SocialProofContentModel.findOneAndUpdate(
    { singletonKey: "main" },
    { singletonKey: "main", content },
    { upsert: true, new: true }
  );

  return content;
}
