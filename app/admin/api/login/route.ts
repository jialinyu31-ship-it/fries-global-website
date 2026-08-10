import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, createAdminSession, requestIsHttps, validSameOriginRequest, verifyCredentials } from "@/lib/admin-auth";
import { recordAnalyticsEvent } from "@/lib/analytics";

type LoginState = { startedAt: number; failures: number; blockedUntil: number };
const globalLoginState = globalThis as typeof globalThis & { __friesLoginAttempts?: Map<string, LoginState> };
const loginAttempts = globalLoginState.__friesLoginAttempts ?? new Map<string, LoginState>();
globalLoginState.__friesLoginAttempts = loginAttempts;
const WINDOW_MS = 15 * 60_000;
const BLOCK_MS = 30 * 60_000;
const MAX_FAILURES = 5;

function clientKey(request: NextRequest) {
  return request.headers.get("cf-connecting-ip")?.trim() || "local-origin";
}

function loginRedirect(target: string) {
  const response = new NextResponse(null, { status: 303, headers: { Location: target } });
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

export async function POST(request: NextRequest) {
  if (!validSameOriginRequest(request) || Number(request.headers.get("content-length") || 0) > 2_048) {
    recordAnalyticsEvent({ headers: request.headers, path: "/admin/api/login", method: "POST", status: 403, kind: "security", reason: "Rejected cross-site or oversized admin login" });
    return new NextResponse("Forbidden", { status: 403, headers: { "Cache-Control": "no-store" } });
  }

  const now = Date.now();
  const key = clientKey(request);
  let state = loginAttempts.get(key) || { startedAt: now, failures: 0, blockedUntil: 0 };
  if (now - state.startedAt > WINDOW_MS) state = { startedAt: now, failures: 0, blockedUntil: 0 };
  if (state.blockedUntil > now) {
    recordAnalyticsEvent({ headers: request.headers, path: "/admin/api/login", method: "POST", status: 429, kind: "security", reason: "Admin login temporarily blocked" });
    return new NextResponse("Too many login attempts", { status: 429, headers: { "Retry-After": String(Math.ceil((state.blockedUntil - now) / 1000)), "Cache-Control": "no-store" } });
  }

  const form = await request.formData();
  const username = String(form.get("username") || "");
  const password = String(form.get("password") || "");
  const honeypot = String(form.get("website") || "");
  if (honeypot || !verifyCredentials(username, password)) {
    state.failures += 1;
    if (state.failures >= MAX_FAILURES) state.blockedUntil = now + BLOCK_MS;
    loginAttempts.set(key, state);
    recordAnalyticsEvent({ headers: request.headers, path: "/admin/api/login", method: "POST", status: 401, kind: "security", reason: honeypot ? "Admin login honeypot triggered" : "Invalid admin credentials" });
    return loginRedirect("/admin/login?error=1");
  }

  loginAttempts.delete(key);
  const response = loginRedirect("/admin");
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), {
    httpOnly: true,
    secure: requestIsHttps(request),
    sameSite: "strict",
    path: "/admin",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  return response;
}
