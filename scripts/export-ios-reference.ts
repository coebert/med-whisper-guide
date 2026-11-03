// Regenerates public/ios-reference-pages.json from the app's static source data.
// Run: bun scripts/export-ios-reference.ts
import { writeFileSync } from "node:fs";
import { buildIosReferencePages } from "../src/features/drugReference/iosExport";

writeFileSync("public/ios-reference-pages.json", JSON.stringify(buildIosReferencePages(), null, 2) + "\n");
