import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const root = process.cwd();
const privateKeyFile = join(root, ".private", "brand-signing-private.pem");
const publicKeyFile = join(root, "brand-provenance", "fries-global-public-key.pem");
const manifestFile = join(root, "public", "brand-provenance.json");
const provenanceId = "FG-ORIGIN-2026-6C4E93D2B718";

function filesUnder(directory) {
  const files = [];
  for (const name of readdirSync(directory)) {
    const absolute = join(directory, name);
    if (absolute === manifestFile) continue;
    const info = statSync(absolute);
    if (info.isDirectory()) files.push(...filesUnder(absolute));
    else files.push(absolute);
  }
  return files;
}

mkdirSync(dirname(privateKeyFile), { recursive: true });
mkdirSync(dirname(publicKeyFile), { recursive: true });

if (!existsSync(privateKeyFile)) {
  const pair = generateKeyPairSync("ed25519", {
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
    publicKeyEncoding: { type: "spki", format: "pem" },
  });
  writeFileSync(privateKeyFile, pair.privateKey, { encoding: "utf8", mode: 0o600, flag: "wx" });
  writeFileSync(publicKeyFile, pair.publicKey, { encoding: "utf8", mode: 0o644, flag: "wx" });
}

if (!existsSync(publicKeyFile)) throw new Error("The public verification key is missing.");
const publicKey = readFileSync(publicKeyFile, "utf8");
const protectedFiles = [
  ...filesUnder(join(root, "public")),
  join(root, "components", "brand-mark.tsx"),
  join(root, "lib", "site-content.ts"),
  join(root, "app", "globals.css"),
].sort();
const assets = Object.fromEntries(protectedFiles.map((absolute) => [
  relative(root, absolute).replaceAll("\\", "/"),
  createHash("sha256").update(readFileSync(absolute)).digest("hex"),
]));
const payload = {
  version: 1,
  provenanceId,
  owner: "薯条出海 · FRIES GLOBAL",
  copyright: "Copyright © 2026 Fries Global. All Rights Reserved.",
  purpose: "Verifiable provenance for original Fries Global website and brand assets.",
  signedAt: new Date().toISOString(),
  publicKeyFingerprint: createHash("sha256").update(publicKey).digest("hex"),
  assets,
};
const canonical = JSON.stringify(payload);
const signature = sign(null, Buffer.from(canonical), readFileSync(privateKeyFile, "utf8")).toString("base64url");
writeFileSync(manifestFile, `${JSON.stringify({ payload, algorithm: "Ed25519", signature }, null, 2)}\n`, { encoding: "utf8" });
process.stdout.write(`Signed ${Object.keys(assets).length} brand assets. Private key remains local.\n`);
