# Security policy

## Reporting a vulnerability

Please report suspected vulnerabilities privately to `hello@friesglobal.com`.
Do not create a public issue containing credentials, complete IP addresses,
forensic exports, tunnel URLs or exploitation instructions.

Include the affected path, time, browser, expected result and a minimal proof
that does not access or modify other people's data. Do not perform denial of
service, automated credential attacks, social engineering or destructive tests.

## Secrets

The public repository must never contain `.private/`, `ADMIN_ACCESS.txt`,
`PUBLIC_PREVIEW_URL.txt`, environment secrets, logs, forensic records or admin
screenshots. Run `npm run security:repo` before every push.
