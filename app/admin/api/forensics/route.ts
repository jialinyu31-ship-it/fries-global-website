import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { forensicEvidenceExport } from "@/lib/forensics";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  if (!verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) return new NextResponse("Unauthorized", { status: 401 });
  const day = new Date().toISOString().slice(0, 10);
  return NextResponse.json(forensicEvidenceExport(), {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Disposition": `attachment; filename="fries-global-forensics-${day}.json"`,
    },
  });
}
