import { Project, type IProject } from "@/lib/models/Project";
import type { Types } from "mongoose";

export function findProjectById(id: string | Types.ObjectId) {
  return Project.findById(id);
}

export function findProjectByIdLean(id: string | Types.ObjectId) {
  return Project.findById(id).populate("proposalId").lean();
}

export function findProjectForClient(clientId: Types.ObjectId, projectId: Types.ObjectId) {
  return Project.findOne({ _id: projectId, clientId }).populate("proposalId").lean();
}

export function findProjectsForClient(clientId: Types.ObjectId) {
  return Project.find({ clientId }).sort({ createdAt: -1 }).lean();
}

export function createProject(data: Partial<IProject>) {
  return Project.create(data);
}

export function listProjectsWithClients() {
  return Project.find().sort({ updatedAt: -1 }).populate("clientId").lean();
}

export function countProjectsForClient(clientId: string | Types.ObjectId) {
  return Project.countDocuments({ clientId });
}

export function deleteProjectById(id: string | Types.ObjectId) {
  return Project.findByIdAndDelete(id);
}
