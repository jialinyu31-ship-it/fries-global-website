# 薯条出海 · FRIES GLOBAL

Fries Global connects overseas buyers with suitable Chinese manufacturers and
coordinates sourcing, quality control and export execution.

> **Proprietary source-available repository.** Public visibility is required
> for deployment and review; it does not grant permission to copy, rebrand,
> resell or create a competing commercial website. See [LICENSE](./LICENSE).

Brand provenance ID: `FG-ORIGIN-2026-6C4E93D2B718`

## Technology

- Next.js 16, React 19 and TypeScript
- GSAP motion with reduced-motion support
- Strict CSP and hardened security headers
- Rate limiting, attack-path blocking and origin isolation
- Authenticated analytics and encrypted forensic evidence

## Local development

```powershell
npm install
npm run admin:init
npm run dev
```

`npm run admin:init` generates credentials and encryption material only in
ignored local files. Never copy those files into GitHub Actions or the public
repository.

## Required checks before pushing

```powershell
npm run security:repo
npm run lint
npm run build
npm audit --omit=dev
```

## Repository safety

The following must stay local and are blocked by the repository safety check:

- admin credentials and cryptographic keys;
- `.private/` analytics and forensic evidence;
- public preview URLs and tunnel logs;
- Playwright recordings and admin screenshots containing complete IPs;
- local Cloudflare binaries and temporary files.

See [SECURITY.md](./SECURITY.md) for private vulnerability reporting.
