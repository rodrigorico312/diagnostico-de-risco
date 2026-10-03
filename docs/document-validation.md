# Document validation

The `/validar-documento` route is independent of the marketing app. It does not load
third-party analytics, fonts, or pixels. Its QR codes identify private office records,
not government registrations or verified digital signatures.

## Registry

Production uses the sensitive Vercel variable `DOCUMENT_VALIDATION_RECORDS_V1`.
It is a JSON object keyed by a random 128-bit code in the form `GL-<32 hex digits>`.
No real record, access code, PDF, client CPF, or secret belongs in this public repository.
The API returns one whitelisted record only after a complete matching code is supplied.
It offers no list endpoint. Keep records out of public assets and sitemaps.

Required record fields: `status` (`active` or `revoked`), `title`, `issuer` (name, cnpj),
`accountant` (name, crc), `subject` (name, cnpj), `period`, `nature`, `issuedOn` (ISO date),
`registeredAt` (ISO timestamp), `revision`, `signatureStatus` (`pending` or `provided`),
`filename`, `byteLength`, and `sha256` (lowercase hex, entire final PDF).

The code grants access to the limited registration metadata. Share it only with intended
document recipients. Random codes and noindex prevent enumeration and indexing, but
are not a login system. The PDF itself is never served by this feature.

## Issuing a version

1. Generate a fresh random code for a new revision and insert its URL into the PDF QR.
2. Finalize the PDF, including any signatures, before calculating SHA-256 over all bytes.
3. Add its record to the registry without deleting prior records. Preserve previous versions.
4. Publish a production deployment with the updated registry and test both matching and
   modified files. Updating an environment variable alone does not update an existing deployment.

Changes, re-exports, and signatures alter the byte-level digest. Register each new final
PDF as a new revision and code. Do not silently replace the digest of an already issued
version. Mark a revoked record with `status: revoked`; its digest is no longer returned.
`signatureStatus: provided` records an issuer assertion only; the page does not validate
signature certificates or accounting data.

## Verification

`node --test tests/document-validation.test.mjs` checks API failure states, whitelisting,
revocation, code parsing, PDF limits, and SHA-256 calculations. The browser computes
the selected file's digest locally via Web Crypto; its bytes are not uploaded.
