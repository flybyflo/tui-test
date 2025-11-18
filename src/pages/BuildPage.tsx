import { PageDetails, PageDetailsLayout } from "./PageDetailsLayout";
import { TAB_META } from "./pageTypes";

const DETAILS: PageDetails = {
  title: "Build Pipeline",
  description: "Use Bun's watcher to iterate quickly and gate merges on simple preview builds.",
  steps: [
    "bun run dev keeps the renderer hot-reloading.",
    "For deterministic bundles, run bun run src/index.tsx with CI-friendly flags.",
    "Reference examples/react/animation.tsx when animating stats in build dashboards.",
  ],
  highlightLabel: "Watch command",
  command: "bun run --watch src/index.tsx",
  tip: "tsconfig.json already sets jsxImportSource to @opentui/react, so no React import is needed.",
};

export function BuildPage() {
  return <PageDetailsLayout details={DETAILS} accent={TAB_META.Build.accent} />;
}
