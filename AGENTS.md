<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The app performs no patient-specific dose, weight or pump-rate arithmetic; infusion recipes are static display data only (App Store medical-calculator risk).
- Bump the localStorage cache prefix in cache.ts and add the old one to LEGACY_PREFIXES whenever clinical content is corrected, so stale copies are purged.
- Adult-only scope lives in src/features/drugReference/scope.ts (excluded slugs, paediatric-source filter); every drugs query and cached read must apply it.
- Inline citations for revised static facts come from src/features/drugReference/citations.ts; search links are marked lookup and never presented as evidence.
- Clinical rule tests: bunx vitest run src/features/drugReference/__tests__
- public/ios-reference-pages.json is generated from the app's static data via `bun scripts/export-ios-reference.ts` (builder: src/features/drugReference/iosExport.ts); a test fails if the file drifts from source, so regenerate after any static clinical edit.
- Premedication content lives in src/features/drugReference/premedication.ts and the page only renders it, so web and iOS export share one source.
