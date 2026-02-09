# Security Policy

## Supported versions
This project ships as a static site without versioned release branches.
Security fixes are applied to the default branch and shipped as soon as practical.

## Reporting a vulnerability
If you discover a potential security issue:

1. Prefer opening a **private security advisory** on GitHub (if available).
2. If advisories are unavailable, open an issue with minimal sensitive detail and mark it clearly as security-related.
3. Include:
   - Reproduction steps
   - Impact assessment
   - Browser/runtime details

## Response expectations
- We aim to acknowledge reports promptly.
- We will validate, triage severity, and prepare a fix or mitigation.
- We may request a coordinated disclosure window before public details are shared.

## Project-specific security notes
- No server-side user accounts or backend data storage.
- Primary risk surface is client-side behavior and third-party/browser APIs.
- Review dependency/vendor updates (`vendor/html-to-image.js`) carefully.
- Treat URL/query-param handling as untrusted input and preserve sanitization patterns.
