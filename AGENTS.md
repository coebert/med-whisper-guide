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
