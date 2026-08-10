import { NextRequest, NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/lib/analytics";

type WindowCounter = {
  minuteStartedAt: number;
  minuteCount: number;
  burstStartedAt: number;
  burstCount: number;
  blockedUntil: number;
};

type SecurityState = {
  clients: Map<string, WindowCounter>;
  global: WindowCounter;
  requestsSinceCleanup: number;
};

const MINUTE_MS = 60_000;
const BURST_MS = 10_000;
const CLIENT_MINUTE_LIMIT = 180;
const CLIENT_BURST_LIMIT = 45;
const GLOBAL_MINUTE_LIMIT = 3_000;
const GLOBAL_BURST_LIMIT = 600;
const BLOCK_MS = 5 * 60_000;
const MAX_TRACKED_CLIENTS = 5_000;
const MAX_URL_LENGTH = 2_048;

const globalWithSecurity = globalThis as typeof globalThis & { __friesSecurityState?: SecurityState };
const now = Date.now();
const securityState = globalWithSecurity.__friesSecurityState ?? {
  clients: new Map<string, WindowCounter>(),
  global: {
    minuteStartedAt: now,
    minuteCount: 0,
    burstStartedAt: now,
    burstCount: 0,
    blockedUntil: 0,
  },
  requestsSinceCleanup: 0,
};
globalWithSecurity.__friesSecurityState = securityState;

const blockedPathPatterns = [
  /(?:^|\/)\.(?:env|git|svn|hg)(?:\/|$)/i,
  /(?:^|\/)\.private(?:\/|$)/i,
  /\/(?:admin_access|public_preview_url)\.txt$/i,
  /\/(?:wp-admin|wp-login\.php|phpmyadmin|adminer|xmlrpc\.php)(?:\/|$)/i,
  /\/(?:vendor|cgi-bin|actuator|server-status)(?:\/|$)/i,
  /(?:\.php|\.asp|\.aspx|\.jsp)(?:\/|$)/i,
];

function freshCounter(timestamp: number): WindowCounter {
  return {
    minuteStartedAt: timestamp,
    minuteCount: 0,
    burstStartedAt: timestamp,
    burstCount: 0,
    blockedUntil: 0,
  };
}

function consume(counter: WindowCounter, timestamp: number, minuteLimit: number, burstLimit: number) {
  if (counter.blockedUntil > timestamp) {
    return { allowed: false, retryAfter: Math.ceil((counter.blockedUntil - timestamp) / 1000), remaining: 0 };
  }
  if (timestamp - counter.minuteStartedAt >= MINUTE_MS) {
    counter.minuteStartedAt = timestamp;
    counter.minuteCount = 0;
  }
  if (timestamp - counter.burstStartedAt >= BURST_MS) {
    counter.burstStartedAt = timestamp;
    counter.burstCount = 0;
  }

  counter.minuteCount += 1;
  counter.burstCount += 1;
  if (counter.minuteCount > minuteLimit || counter.burstCount > burstLimit) {
    counter.blockedUntil = timestamp + BLOCK_MS;
    return { allowed: false, retryAfter: Math.ceil(BLOCK_MS / 1000), remaining: 0 };
  }

  return { allowed: true, retryAfter: 0, remaining: Math.max(0, minuteLimit - counter.minuteCount) };
}

function clientKey(request: NextRequest) {
  // The production server is bound to 127.0.0.1, so public traffic can only
  // arrive through Cloudflare Tunnel, which overwrites CF-Connecting-IP.
  return request.headers.get("cf-connecting-ip")?.trim() || "local-origin";
}

function rateLimit(request: NextRequest) {
  const timestamp = Date.now();
  securityState.requestsSinceCleanup += 1;
  if (securityState.requestsSinceCleanup >= 500) {
    securityState.requestsSinceCleanup = 0;
    for (const [key, counter] of securityState.clients) {
      if (timestamp - counter.minuteStartedAt > BLOCK_MS && counter.blockedUntil <= timestamp) {
        securityState.clients.delete(key);
      }
    }
  }

  const globalResult = consume(securityState.global, timestamp, GLOBAL_MINUTE_LIMIT, GLOBAL_BURST_LIMIT);
  if (!globalResult.allowed) return globalResult;

  const key = clientKey(request);
  let counter = securityState.clients.get(key);
  if (!counter) {
    if (securityState.clients.size >= MAX_TRACKED_CLIENTS) {
      return { allowed: true, retryAfter: 0, remaining: CLIENT_MINUTE_LIMIT };
    }
    counter = freshCounter(timestamp);
    securityState.clients.set(key, counter);
  }
  return consume(counter, timestamp, CLIENT_MINUTE_LIMIT, CLIENT_BURST_LIMIT);
}

function allowedHost(request: NextRequest) {
  const hostname = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  if (hostname === "localhost" || hostname === "127.0.0.1") return true;
  if (hostname.endsWith(".trycloudflare.com")) return true;
  const configured = (process.env.ALLOWED_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  return configured.includes(hostname);
}

function plain(status: number, message: string, extraHeaders?: HeadersInit) {
  return new NextResponse(message, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "text/plain; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function applySecurityHeaders(response: NextResponse, csp: string, isHttps: boolean) {
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Origin-Agent-Cluster", "?1");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()");
  response.headers.set("Accept-CH", "Sec-CH-UA-Model, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Full-Version-List, Sec-CH-UA-Mobile");
  if (isHttps) response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  return response;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isStaticAsset = pathname.startsWith("/_next/static/") || /\.(?:png|jpe?g|gif|webp|avif|ico|svg|css|js|woff2?)$/i.test(pathname);
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isPresenceRoute = pathname === "/api/presence";
  const isAllowedAdminPost = request.method === "POST" && (pathname === "/admin/api/login" || pathname === "/admin/api/logout");

  const reject = (status: number, message: string, reason: string, extraHeaders?: HeadersInit) => {
    recordAnalyticsEvent({ headers: request.headers, path: pathname, query: request.nextUrl.search, method: request.method, status, kind: "security", reason });
    return plain(status, message, extraHeaders);
  };

  if (!allowedHost(request)) return reject(421, "Misdirected request.", "Invalid host header");
  if (request.url.length > MAX_URL_LENGTH) return reject(414, "Request URI is too long.", "Oversized request URI");
  if (request.method !== "GET" && request.method !== "HEAD" && !isAllowedAdminPost) {
    return reject(405, "Method not allowed.", "Disallowed HTTP method", { Allow: "GET, HEAD" });
  }
  if (pathname === "/_next/image" || blockedPathPatterns.some((pattern) => pattern.test(pathname))) {
    return reject(404, "Not found.", "Known scanner or sensitive path");
  }

  if (!isStaticAsset) {
    const limit = rateLimit(request);
    if (!limit.allowed) {
      return reject(429, "Too many requests.", "Rate limit exceeded", {
        "Retry-After": String(limit.retryAfter),
        "RateLimit-Limit": String(CLIENT_MINUTE_LIMIT),
        "RateLimit-Remaining": "0",
      });
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const isHttps = forwardedProto === "https" || request.nextUrl.protocol === "https:";
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self' data:;
    connect-src 'self';
    media-src 'self';
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    manifest-src 'self';
    ${isHttps ? "upgrade-insecure-requests;" : ""}
  `.replace(/\s{2,}/g, " ").trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-middleware-subrequest");
  requestHeaders.delete("x-invoke-path");
  requestHeaders.delete("x-invoke-query");
  requestHeaders.delete("x-now-route-matches");
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  if (isPresenceRoute && request.method === "GET") {
    const requestedPage = request.nextUrl.searchParams.get("page") || "/";
    const reportedPath = requestedPage.startsWith("/") ? requestedPage : "/";
    const isInitialProfile = request.nextUrl.searchParams.get("profile") === "1";
    recordAnalyticsEvent({
      headers: request.headers,
      path: reportedPath,
      method: request.method,
      status: 204,
      kind: "presence",
      captureForensics: isInitialProfile ? "visit" : undefined,
      reason: isInitialProfile ? "Active device profile" : undefined,
    });
  } else if (!isStaticAsset && !isAdminRoute && request.method === "GET" && pathname !== "/") {
    recordAnalyticsEvent({ headers: request.headers, path: pathname, query: request.nextUrl.search, method: request.method, status: 200 });
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (isAdminRoute) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return applySecurityHeaders(response, csp, isHttps);
}

export const config = { matcher: "/:path*" };
