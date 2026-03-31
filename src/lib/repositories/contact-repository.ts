import { Contact, type IContact } from "@/lib/models/Contact";

export function listLeads() {
  return Contact.find().sort({ createdAt: -1 }).lean();
}

export function createLead(data: Partial<IContact>) {
  return Contact.create(data);
}

export function findLeadById(id: string) {
  return Contact.findById(id);
}

export function deleteLeadById(id: string) {
  return Contact.findByIdAndDelete(id);
}
