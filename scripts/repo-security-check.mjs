import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const normalize = (value) => value.replaceAll("\\", "/").replace(/^\.\//, "");

const forbiddenPaths = [
  /^\.private(?:\/|$)/i,
  /^ADMIN_ACCESS\.txt$/i,
  /^PUBLIC_PREVIEW_URL\.txt$/i,
  /^\.playwright-cli(?:\/|$)/i,
  /^output(?:\/|$)/i,
  /^logs(?:\/|$)/i,
  /^tmp(?:\/|$)/i,
  /^tools\/cloudflared\.exe$/i,
  /(?:^|\/)brand-signing-private\.pem$/i,
  /(?:^|\/)preview-stopped\.marker$/i,
  /\.log$/i,
  /^\.env(?:\.|$)/i,
];

const fallbackIgnored = ["node_modules/", ".next/", ".git/", ".private/", ".playwright-cli/", "output/", "logs/", "tmp/"];

function isFallbackIgnored(path) {
  if (fallbackIgnored.some((prefix) => `${path}/`.startsWith(prefix))) return true;
  if (["ADMIN_ACCESS.txt", "PUBLIC_PREVIEW_URL.txt", "tools/cloudflared.exe"].includes(path)) return true;
  if (/^\.env(?:\.|$)/i.test(path) && path !== ".env.example") return true;
  if (/\.(?:log|key|p12|pfx)$/i.test(path)) return true;
  if (/\.pem$/i.test(path) && path !== "brand-provenance/fries-global-public-key.pem") return true;
  return false;
}

function allFiles(directory) {
  const result = [];
  for (const name of readdirSync(directory)) {
    const absolute = resolve(directory, name);
    const path = normalize(relative(root, absolute));
    if (isFallbackIgnored(path)) continue;
    const info = statSync(absolute);
    if (info.isDirectory()) result.push(...allFiles(absolute));
    else result.push(path);
  }
  return result;
}

function repositoryFiles() {
  const inside = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd: root, encoding: "utf8" });
  if (inside.status === 0) {
    const listed = spawnSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" });
    const files = listed.stdout.split("\0").filter(Boolean).map(normalize);
    if (files.length) return files;
  }
  return allFiles(root);
}

const textExtensions = /\.(?:c?js|mjs|ts|tsx|json|md|txt|ya?ml|toml|css|html|xml|svg|env|example)$/i;
const secretPatterns = [
  { name: "private key", test: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: "GitHub token", test: /(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{40,})/ },
  { name: "AWS access key", test: /AKIA[0-9A-Z]{16}/ },
  { name: "Cloudflare tunnel token", test: /(?:CLOUDFLARE|TUNNEL)_TOKEN\s*=\s*[^\s#]{20,}/i },
  { name: "generated admin password", test: /Password:\s*FG-[A-Za-z0-9_-]{12,}/i },
  { name: "hard-coded session secret", test: /(?:sessionSecret|analyticsSecret)\s*[:=]\s*["'][A-Za-z0-9_-]{32,}["']/ },
  { name: "admin session cookie", test: /fries_admin_session=[A-Za-z0-9._-]{20,}/ },
];

function isPublicIpv4(ip) {
  const parts = ip.split(".").map(Number);
  if (parts.some((part) => part > 255)) return false;
  if (parts[0] === 10 || parts[0] === 127 || parts[0] === 0) return false;
  if (parts[0] === 192 && parts[1] === 168) return false;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;
  if (parts[0] === 169 && parts[1] === 254) return false;
  if (parts[0] === 192 && parts[1] === 0 && parts[2] === 2) return false;
  if (parts[0] === 198 && parts[1] === 51 && parts[2] === 100) return false;
  if (parts[0] === 203 && parts[1] === 0 && parts[2] === 113) return false;
  return true;
}

const files = repositoryFiles();
const failures = [];
for (const file of files) {
  if (file === ".env.example") continue;
  if (forbiddenPaths.some((pattern) => pattern.test(file))) failures.push(`${file}: forbidden path`);
  if (!textExtensions.test(file) || file === "scripts/repo-security-check.mjs") continue;
  const absolute = resolve(root, file);
  if (statSync(absolute).size > 2_000_000) continue;
  const text = readFileSync(absolute, "utf8");
  for (const pattern of secretPatterns) {
    if (pattern.test.test(text)) failures.push(`${file}: possible ${pattern.name}`);
  }
  const addresses = text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [];
  for (const address of new Set(addresses)) {
    if (isPublicIpv4(address)) failures.push(`${file}: possible public IP address ${address}`);
  }
}

if (failures.length) {
  process.stderr.write(`Repository safety check failed:\n- ${failures.join("\n- ")}\n`);
  process.exit(1);
}

process.stdout.write(`Repository safety check passed (${files.length} publishable files inspected).\n`);
