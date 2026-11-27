# Anaesthesia Drug Guide — legacy compatibility server

The canonical public reference is [Anaesthesia Drug Guide on Base44](https://migrated-from-lovable-0aa80275.base44.app/), app `6ab1024647cd8f8d0aa80275`.

This repository retains the former application and the compatibility server at `https://med-whisper-guide.lovable.app`. Supported public GET/HEAD routes hand off to Base44, preserving monograph/topic slugs, supported comparison/search parameters and the offline-restore hint. The former hostname remains necessary for old links; it is not the preferred development platform.

The canonical Base44 source is separate. Its active public clinical data is `src/reviewed/data/monographs.json` and reviewed static modules: 212 preserved source records, 210 adult in-scope records. The former Supabase database and the earlier Base44 Drug entity do not automatically update that snapshot. Preserve adult scope, clinical content, citations and cache invalidation rules when making any future content correction.

## Development

Develop canonical features in the identified Base44 app using an isolated branch and its own setup instructions. Review and obtain approval before publishing. Editing this compatibility repository does not update the canonical reader or an installed App Store binary.

For this legacy server/fallback application, use a separate branch and the checked-in Bun lockfile:

```sh
bun install --frozen-lockfile
node --test tests/reference-forwarding.test.mjs
bunx vitest run src/features/drugReference/__tests__
bun run build
```

The Supabase SDK remains used by fallback queries and auth middleware; `@lovable.dev/vite-tanstack-config` is directly imported by the legacy build configuration. Keep them while building/supporting this fallback. Historical Drizzle migrations do not prove a current database dependency. No environment values or secrets should be committed or logged.

The compatibility implementation lives in `src/lib/reference-forwarding.mjs` and is called before the fallback handler in `src/server.ts`. It must only execute for the exact public legacy hostname; local, Base44 and preview hosts use their normal application handler. Its fixed destination must not become caller-controlled.

## Offline and retirement

See [the audit and retirement gates](docs/independence-audit-2026-11-27.md). The old v9 cache cannot be read across origins. Its bridge sends a restore flag only; Base44 reconstructs a local copy from canonical content. Complete the online transition and verify both monographs and shell before relying on offline reopening. Preserve browser caches; physical iPhone/iPad/Mac cold-offline and installed-binary checks remain outstanding.

Do not merge, publish, disable services/jobs or delete data without explicit owner approval. Do not rewrite published git history. Removing the old hostname check would break the compatibility handoff. Retain historical-origin hosting until equivalent link service and rollback are demonstrated.
