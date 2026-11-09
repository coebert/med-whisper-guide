import { createFileRoute, Link } from "@tanstack/react-router";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";

export const Route = createFileRoute("/ios-privacy")({
  head: () => ({
    meta: [
      { title: "iOS App Privacy Policy — Anaesthesia Drug Guide" },
      {
        name: "description",
        content:
          "Privacy policy for Anaesthesia Drug Guide, the native offline iOS drug reference app: no login, no patient data entry, no analytics, advertising or tracking SDKs, and no network requests.",
      },
      {
        property: "og:title",
        content: "iOS App Privacy Policy — Anaesthesia Drug Guide",
      },
      {
        property: "og:description",
        content:
          "How Anaesthesia Drug Guide, the native offline iOS drug reference app, handles data: favourites stay on your device.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: IosPrivacyPage,
});

function IosPrivacyPage() {
  return (
    <ReferenceAppLayout>
      <main className="mx-auto max-w-3xl px-4 py-8 text-sm leading-relaxed text-muted-foreground sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">iOS app privacy policy</h1>
        <p className="mt-3 rounded-md border border-border bg-muted/40 p-3 text-foreground">
          This policy applies to the forthcoming <strong>native, offline iOS app</strong>{" "}
          Anaesthesia Drug Guide. It does not describe this website.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">What the app does not do</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>No account or login.</li>
            <li>No entry of patient information, and no dose or infusion calculators.</li>
            <li>
              No analytics, advertising or tracking SDKs, and no tracking across apps or websites.
            </li>
            <li>
              No network requests: all reference content is bundled in the app and works offline.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">Data stored on your device</h2>
          <p>
            Favourites you mark are stored locally on your device only. They are not sent to us and
            are removed when you delete the app.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">Links that leave the app</h2>
          <p>
            Optional links to external sources (for example guideline or product-information
            websites) and to support open outside the app, in your browser or mail app. Those
            websites and your email provider have their own privacy policies, which apply once you
            leave the app.
          </p>
          <p>
            If you email support, we receive only the information you choose to include, such as
            your email address and message. Do not include identifiable patient information.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">Apple</h2>
          <p>
            Purchases are processed by Apple. Any optional crash or diagnostic data you choose to
            share with developers through your device settings is collected by Apple and subject to
            Apple&apos;s privacy policy and the controls in your device settings.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">Contact</h2>
          <p>
            Questions about this policy:{" "}
            <a href="mailto:support@anaesthesiacore.app" className="text-primary underline">
              support@anaesthesiacore.app
            </a>
            . See also{" "}
            <Link to="/support" className="text-primary underline">
              Support
            </Link>
            .
          </p>
        </section>
      </main>
    </ReferenceAppLayout>
  );
}
