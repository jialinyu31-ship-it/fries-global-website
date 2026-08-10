import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { getAnalyticsSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  if (!verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) return new NextResponse("Unauthorized", { status: 401 });
  return NextResponse.json(getAnalyticsSummary(), { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
