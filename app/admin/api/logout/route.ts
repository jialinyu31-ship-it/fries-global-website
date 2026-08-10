import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, validSameOriginRequest } from "@/lib/admin-auth";
import { recordAnalyticsEvent } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  if (!validSameOriginRequest(request)) {
    recordAnalyticsEvent({ headers: request.headers, path: "/admin/api/logout", method: "POST", status: 403, kind: "security", reason: "Rejected cross-site admin logout" });
    return new NextResponse("Forbidden", { status: 403 });
  }
  const response = new NextResponse(null, { status: 303, headers: { Location: "/admin/login?signedout=1" } });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "strict", path: "/admin", maxAge: 0 });
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}
