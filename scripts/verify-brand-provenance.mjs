import { createHash, verify } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const publicKeyFile = join(root, "brand-provenance", "fries-global-public-key.pem");
const manifestFile = join(root, "public", "brand-provenance.json");
if (!existsSync(publicKeyFile) || !existsSync(manifestFile)) throw new Error("Brand provenance files are missing.");

const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
if (manifest.algorithm !== "Ed25519") throw new Error("Unsupported provenance signature algorithm.");
const canonical = JSON.stringify(manifest.payload);
const validSignature = verify(null, Buffer.from(canonical), readFileSync(publicKeyFile, "utf8"), Buffer.from(manifest.signature, "base64url"));
if (!validSignature) throw new Error("Brand provenance signature is invalid.");

const mismatches = [];
for (const [path, expected] of Object.entries(manifest.payload.assets)) {
  const absolute = join(root, path);
  if (!existsSync(absolute)) { mismatches.push(`${path}: missing`); continue; }
  const actual = createHash("sha256").update(readFileSync(absolute)).digest("hex");
  if (actual !== expected) mismatches.push(`${path}: hash mismatch`);
}
if (mismatches.length) throw new Error(`Brand provenance verification failed:\n${mismatches.join("\n")}`);
process.stdout.write(`Brand provenance verified (${Object.keys(manifest.payload.assets).length} signed assets).\n`);
