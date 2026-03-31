import { Proposal, type IProposal } from "@/lib/models/Proposal";
import type { Types } from "mongoose";

export function findProposalById(id: string | Types.ObjectId) {
  return Proposal.findById(id);
}

export function findProposalByIdLean(id: string | Types.ObjectId) {
  return Proposal.findById(id).populate("projectId").lean();
}

export function findProposalForClient(clientId: Types.ObjectId, proposalId: Types.ObjectId) {
  return Proposal.findOne({ _id: proposalId, clientId }).populate("projectId").lean();
}

export function findProposalsForClient(clientId: Types.ObjectId) {
  return Proposal.find({ clientId }).sort({ createdAt: -1 }).lean();
}

export function createProposal(data: Partial<IProposal>) {
  return Proposal.create(data);
}
