import { NextRequest, NextResponse } from "next/server";
import { EstimatorInputSchema } from "@/lib/validators";
import { calculateEstimate } from "@/lib/pricing-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = EstimatorInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = calculateEstimate(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Estimate calculation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
