import { createFileRoute, redirect } from "@tanstack/react-router";

// Retired: the app no longer provides patient-specific calculators.
// Old bookmarks go to the static infusion recipes; no calculation is performed.
export const Route = createFileRoute("/calculator")({
  beforeLoad: () => {
    throw redirect({ to: "/infusions", replace: true });
  },
});
