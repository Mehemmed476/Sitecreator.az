import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth-guards";
import {
  loadPriceCalculatorConfig,
  savePriceCalculatorConfig,
} from "@/lib/price-calculator-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const config = await loadPriceCalculatorConfig();
    return NextResponse.json(config, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch price calculator config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const config = await savePriceCalculatorConfig(body);
    return NextResponse.json(config);
  } catch {
    return NextResponse.json(
      { error: "Failed to update price calculator config" },
      { status: 500 }
    );
  }
}
