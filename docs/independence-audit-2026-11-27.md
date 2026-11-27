# BJA Ed Navigator and Anaesthesia Drug Guide: independence audit

Audit date: 27 November 2026 (GMT). Verdict: canonical public paths have independent Base44 implementations; complete legacy-service retirement is **not yet cleared**. No service was disabled, no data deleted, and no change merged or deployed during this audit.

## Deployment and ownership map

| Surface | Current destination / identity | Evidence and status |
| --- | --- | --- |
| BJA canonical reader | https://bja-ed-navigator-7caf0bd2.base44.app ; app `6b08747dc89dad217caf0bd2` | Base44 published-URL API; public browser displays 589 articles. Base44 metadata records latest deployment 26 Nov 18:22:41 UTC. |
| BJA historical entry | https://bja-learn-find.lovable.app | GitHub main `cd1d162455e1f33bcae08978ba7900efe5fa709f`, `index.html`, is a JavaScript handoff. Browser verified `/article/42924199` arrives at the same PMID on Base44 and displays “Point-of-care ultrasound in shock.” |
| BJA separate import | app `6afe18cc8e8dde1aad31be15`, named bja-learn-find | Published-URL API returned `app_not_published`; no workflows or custom domains returned. This is not the canonical reader. It was left untouched; contents and external consumers were not exhaustively audited. |
| Drug Guide canonical public reference | https://migrated-from-lovable-0aa80275.base44.app ; app `6ab1024647cd8f8d0aa80275` | Base44 published-URL API; browser verified public propofol page and offline download. The historical word “lovable” in this Base44 slug is a name, not evidence of a Lovable request. |
| Drug Guide historical entry | https://med-whisper-guide.lovable.app | GitHub main `a49385c42299e9f4cc1276e6d52dbd1edc7cb559`, `src/server.ts`, returns handoff HTML before loading the fallback server. Browser verified `/drugs/propofol` arrives at the same Base44 monograph. |
| Custom domains | Both canonical apps | Base44 custom-domain API returned empty lists. No user-owned redirect domain is established by this audit. |

These are two separate source systems: the GitHub repositories contain the former applications and compatibility entrypoints; the canonical Base44 apps have their own code. Changing a legacy README or package manifest does not update the canonical app. Base44 file reads reflect current editor source, which can include unpublished edits; public browser checks establish only the deployed paths actually exercised.

## Dependency trace and classification

| Component | Classification | Required action |
| --- | --- | --- |
| BJA legacy `index.html` | Active compatibility code: fixed Base44 destination, numeric 1–10 digit PMID preservation; arbitrary query strings are not forwarded. No React/Supabase entry script remains in this document. | Retain historical-origin hosting while bookmarks depend on it. |
| BJA GitHub `src/pages/Index.tsx`, Supabase client and edge sync | Former implementation, disconnected from the current redirect document. Supabase calls remain real if that original application is restored. | Preserve for rollback; do not confuse archive source with canonical runtime. |
| BJA `lovable-tagger` | Imported by legacy Vite config and used in development mode. Not a canonical Base44 runtime dependency. | Retain for reproducible fallback development until a separately tested build simplification is approved. |
| BJA canonical archive | `archive-server.js` reads Base44 `Article` and `IndexSync`; `JournalIndexer` uses Base44 `Article`, `IndexSync`, `IndexLease` and fixed NCBI PubMed endpoints. | Keep Base44 data, actor and workflow. `src` scan found no Lovable/Supabase strings or service-worker/cache API registration. |
| Drug Guide GitHub Supabase SDK | Real dependency of fallback reference queries and auth middleware; standard public legacy GET/HEAD handoffs bypass the fallback handler. Local/preview/non-handoff routes can still execute it. | Keep until fallback is deliberately replaced or retired. Removing only the manifest dependency would break that build. |
| Drug Guide `@lovable.dev/vite-tanstack-config` | Direct import in legacy `vite.config.ts`; genuine legacy build dependency. | Retain for the bridge/fallback build pending an approved independent replacement. |
| Drug Guide Drizzle/Postgres packages | Legacy scaffolding: inspected `drizzle/schema.ts` is blank, with historical migration files present. No canonical public reference query uses them. | Do not infer a live database or permission to drop one from package names. Check hosting configuration and database inventory first. |
| Drug Guide canonical reference | `App.jsx` routes to `src/reviewed`; `reference-store.js` imports bundled `data/monographs.json`, exposing local query methods without a network/database call. | This JSON and reviewed static modules are the active clinical source. Changes to the former Supabase database or the earlier Base44 Drug entity do not automatically update it. |
| Earlier Base44 Drug entity / native pages | Retained historical dataset and unrouted implementation, distinct from the reviewed public reference. Migration notes describe 213 preserved rows. SDK/auth still serves Base44 app state. | Do not delete these records. Inventory any external clients before eventual archival. |
| Drug Guide legacy hostname recognition | Active compatibility gate, not a call back from Base44. | Preserve the gate. Proposed branch narrows it from all `.lovable.app` hosts to the actual public hostname. |
| Old READMEs | Incorrect current-development guidance and “live app” labels. | Replace with canonical URLs, compatibility responsibilities, correct development separation and retirement gates. |

## Data and content preservation

Read-only hash verification inside the Drug Guide Base44 app confirmed both `migration/source-drugs.json` and active `src/reviewed/data/monographs.json` contain 212 unique slugs and have identical SHA-256:

`c6d21accfc19a9753e03485d8be5783bae730259da4c9dff3d1f0750fb8ebb4b`

The existing adult-scope filter excludes `caffeine-citrate` and `inhaled-nitric-oxide`, leaving 210 in-scope records. No clinical text, calculations, scope rules, citations, snapshots or database records were changed. The 26 November reconciliation against the then-live source is reported by PR #1; this audit did not obtain a fresh source-database export to exclude later deltas. The 577 BJA imported articles and 14 historical synchronisation records are reported by its merged PR; this audit independently observed the current 589-article reader, rather than repeating that whole migration reconciliation.

## Scheduled jobs

BJA Base44 workflow `6b0876ab60ef1f862628df44` (“Monthly PubMed index”) is active, with `0 3 1 * *`, timezone UTC: next expected trigger **1 December 2026 at 03:00 GMT**. Its definition invokes `/api/sync-articles`; that route requires an authenticated administrator, then calls `JournalIndexer('bja').refresh({scheduled:true})`. The actor has lease/cooldown logic and accesses Base44 entities and NCBI, not Supabase.

Run history contains three completed manual test runs and two earlier failed manual tests (HTTP 502). Latest completed test: 26 Nov 18:22:44–18:22:48 UTC. All five are `is_test_run:true`; workflow total-run counters are zero. Therefore **a successful scheduled execution has not yet been demonstrated**. Require a real scheduled success and resulting `IndexSync` evidence, including successful authentication, before retiring the former scheduler.

Drug Guide returned no Base44 workflows. Its public reference is a versioned snapshot, not a scheduled replica. Legacy BJA SQL enables `pg_cron` and `pg_net` but does not itself establish current job names, commands or enabled state. The connected Supabase account returns an empty project list; legacy cron tables, edge-function invocations, traffic, backups and shared consumers are inaccessible. No jobs were run, paused or altered for this audit.

## Offline and link behaviour

Drug Guide uses `drugref:v9:` localStorage entries with 30-day read expiry and older-prefix purging. `reference-sw.js` caches a public shell plus same-origin JS/CSS/font assets; API requests are excluded. The shell cache is versioned `drugref-shell-c6d21acc-v1`. The old bridge checks for at least 210 v9 monograph keys and passes only `#restore-offline-reference`; Base44 then rebuilds its local cache from its own snapshot. It does not transfer old monographs, account sessions or browsing records. Key count is only a restore hint, not proof of valid/unexpired cached contents.

Browser verification on 27 November: the canonical offline page showed 210 saved monographs; “Update saved copy” completed with “Everything is saved on this device” and “App shell saved for offline reopening on this device.” This is **not** a new cold-offline or physical-device certification. The migration notes and merged PR report prior disconnected Chromium acceptance. Physical iPhone/iPad/Mac restart, airplane-mode, first deep-link, storage-pressure, cache-expiry and upgrade checks remain required. An offline browser cannot fetch the former site's handoff or the new origin for the first time. Keep existing cached copies and provide an online transition before expecting offline Base44 use.

BJA has a saved server-side archive and in-session query state, but no dedicated offline shell was found in the inspected source. Saved server data is not device-offline access. Do not promise offline publisher PDFs: publisher and institutional access remain external dependencies.

Historical article PMIDs and drug/topic paths are preserved. Drug comparison `a,b` and search `q,class,tdm,infusion` parameters are allowlisted. Both bridges require JavaScript for automatic navigation and serve HTTP 200 HTML, not HTTP 301/308. BJA's no-script link goes to the archive root; neither bridge guarantees original in-page fragment preservation. These limitations remain documented rather than silently broadening the handoff during this audit.

## Development workflows and published links

Canonical changes belong in the identified Base44 apps, with isolated branch/review and an explicitly approved publish. Their own READMEs describe Base44 development; the legacy READMEs currently recommend Lovable and pushing main. The proposed replacements clearly label these repositories as compatibility/fallback source and direct canonical edits to the correct Base44 app.

Known published legacy links include the old README live-app URLs, existing browser bookmarks and potentially App Store support/privacy links or native app endpoints. Public source and browser checks do not establish the installed App Store binary's endpoint or bundled-data version. No App Store Connect/build-record access was established here. Inventory every store listing, QR code, portfolio page, share link, native wrapper, support/privacy URL and external integration; update only after approval, and retain redirects for links that cannot be replaced. A Base44 web publish does not prove a native binary update.

## Proposed isolated changes

1. Both repositories: replace misleading README guidance; add this evidence-based audit and a retirement checklist.
2. BJA: add two dependency-free Node tests proving numeric PMID retention and fixed-origin handling. Existing redirect and clinical content are unchanged.
3. Drug Guide: move the unchanged handoff implementation into `src/lib/reference-forwarding.mjs`, import it from `src/server.ts`, and restrict execution to `med-whisper-guide.lovable.app`. Preserve supported paths, query allowlist, offline hint, HEAD behaviour and response headers. Add six dependency-free Node tests for these contracts, hostile/overlong queries, non-public hosts and non-read methods.

Validation: all eight new contract tests pass locally on Node 24. Full legacy app builds were not run; authenticated git cloning was unavailable and the connector supplied targeted source snapshots. An attempted existing BJA canonical test run lacked `esbuild` in the local snapshot and is not counted as passing. Branch review must include normal dependency installation and full build in an isolated checkout before approval. No package or lockfile removal is proposed without that evidence. Reverting the proposed commit restores the prior code and README; no data migration or configuration rollback is required.

## Exact retirement gates

| Service or resource | Required evidence before an explicit retirement approval |
| --- | --- |
| Legacy BJA scheduled refresh | Inspect current `cron.job` and edge-function inventory; record job IDs/schedules/auth without exposing secrets; verify Base44 scheduled run succeeds at the expected time and updates the intended archive; capture reversible disable/re-enable instructions. |
| Legacy Supabase projects | Obtain authorised read access; inventory all tables/auth/storage/functions/jobs and other apps sharing the project; take encrypted, restorable backups; reconcile final content and historical IDs/timestamps; observe no required traffic over an agreed window covering the monthly job and native clients; verify rollback restore. Empty connector visibility is not proof of no projects. |
| Legacy Lovable hosting | Preserve each exact historical hostname, TLS and deep paths through an equivalent reachable bridge, or retain hosting. These are provider-owned subdomains; this audit establishes no ability to move their DNS. Updating links alone does not preserve old bookmarks. Obtain provider evidence about hosting retention before cancelling any plan/project. |
| Legacy Drug Guide fallback/build | Demonstrate bridge-only hosting that preserves every supported route/query/offline hint and support/privacy page, plus approved rollback; or retain current build dependencies. Validate production and preview separately. |
| Offline caches/native distribution | Physical Apple-device cold-offline and cache-update acceptance; verified native bundle/endpoints/version and store links; no legacy-only asset or database reliance in supported installed versions. |
| Historical snapshots, duplicate app, old entities | Inventory external consumers; retain export and restoration path; obtain separate approval for any eventual archival/deletion. They are not retirement targets merely because the canonical reader no longer uses them. |

No retirement gate authorises deletion. Service disabling, merging and deployment remain separate decisions requiring the user's explicit approval after reviewing exact changes.

## Primary evidence

- https://github.com/coebert/bja-learn-find/pull/1
- https://github.com/coebert/med-whisper-guide/pull/1
- https://github.com/coebert/bja-learn-find/blob/cd1d162455e1f33bcae08978ba7900efe5fa709f/index.html
- https://github.com/coebert/med-whisper-guide/blob/a49385c42299e9f4cc1276e6d52dbd1edc7cb559/src/server.ts
- Repository package manifests, Vite configurations, Supabase clients, BJA migration SQL and Drug Guide reference/cache modules at those main commits.
- Authenticated Base44 published URLs, custom-domain inventories, canonical source reads, workflow definition/run history and read-only snapshot hashes.
- Direct public browser deep-link and offline-save observations on 27 November 2026. HTTP fetch alone returned 403 for BJA from the executor; the separate public browser successfully rendered the archive and article.
