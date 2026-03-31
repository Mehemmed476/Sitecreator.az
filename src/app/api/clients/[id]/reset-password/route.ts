import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth-guards";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { generateTemporaryPassword, hashPassword } from "@/lib/password";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "Client hesabı tapılmadı." }, { status: 404 });
    }

    const temporaryPassword = generateTemporaryPassword();
    user.passwordHash = hashPassword(temporaryPassword);
    user.portalEnabled = true;
    await user.save();

    return NextResponse.json({
      message: "Yeni müvəqqəti şifrə yaradıldı.",
      client: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      temporaryPassword,
    });
  } catch {
    return NextResponse.json(
      { error: "Şifrə yenilənmədi." },
      { status: 500 }
    );
  }
}
