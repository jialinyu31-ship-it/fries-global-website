import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { analyticsCsv } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  if (!verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) return new NextResponse("Unauthorized", { status: 401 });
  const day = new Date().toISOString().slice(0, 10);
  return new NextResponse(analyticsCsv(), {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Disposition": `attachment; filename="fries-global-analytics-${day}.csv"`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}
