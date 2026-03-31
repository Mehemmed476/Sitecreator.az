import { User, type IUser } from "@/lib/models/User";

export function findUserById(id: string) {
  return User.findById(id).lean();
}

export function findUserDocumentById(id: string) {
  return User.findById(id);
}

export function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export function createUser(data: Partial<IUser>) {
  return User.create(data);
}

export function countClientUsers() {
  return User.countDocuments({ role: "client" });
}
