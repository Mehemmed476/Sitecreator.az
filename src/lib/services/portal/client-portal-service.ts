import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { findProjectByIdLean, findProjectForClient, findProjectsForClient } from "@/lib/repositories/project-repository";
import { findProposalByIdLean, findProposalForClient, findProposalsForClient } from "@/lib/repositories/proposal-repository";
import { findUserById } from "@/lib/repositories/user-repository";

function normalizeId(value: string) {
  if (!Types.ObjectId.isValid(value)) {
    return null;
  }

  return new Types.ObjectId(value);
}

export async function getClientPortalOverview(userId: string) {
  await connectDB();
  const clientId = normalizeId(userId);

  if (!clientId) {
    return null;
  }

  const [client, proposals, projects] = await Promise.all([
    findUserById(clientId.toString()),
    findProposalsForClient(clientId),
    findProjectsForClient(clientId),
  ]);

  if (!client) {
    return null;
  }

  return { client, proposals, projects };
}

export async function getClientProjectDetail(userId: string, projectId: string) {
  await connectDB();
  const clientId = normalizeId(userId);
  const projectObjectId = normalizeId(projectId);

  if (!clientId || !projectObjectId) {
    return null;
  }

  return findProjectForClient(clientId, projectObjectId);
}

export async function getClientProposalDetail(userId: string, proposalId: string) {
  await connectDB();
  const clientId = normalizeId(userId);
  const proposalObjectId = normalizeId(proposalId);

  if (!clientId || !proposalObjectId) {
    return null;
  }

  return findProposalForClient(clientId, proposalObjectId);
}

export async function getAdminProjectDetail(projectId: string) {
  await connectDB();
  const projectObjectId = normalizeId(projectId);

  if (!projectObjectId) {
    return null;
  }

  return findProjectByIdLean(projectObjectId);
}

export async function getAdminProposalDetail(proposalId: string) {
  await connectDB();
  const proposalObjectId = normalizeId(proposalId);

  if (!proposalObjectId) {
    return null;
  }

  return findProposalByIdLean(proposalObjectId);
}
