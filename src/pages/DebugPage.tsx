import { PageDetails, PageDetailsLayout } from "./PageDetailsLayout";
import { TAB_META } from "./pageTypes";

const DETAILS: PageDetails = {
  title: "Debug Surface",
  description: "Lean on renderer hooks to surface state and console output right from the terminal UI.",
  steps: [
    "renderer.console.toggle() gives you structured logs inline.",
    "Timeline-driven repros live in examples/react/animation.tsx for reference.",
    "Extend renderables (see examples/react/extend-example.tsx) to log internal props.",
  ],
  highlightLabel: "Console toggle",
  command: "Press Ctrl+K while running the app",
  tip: "Attach useKeyboard in any component to add hotkeys without drilling props.",
};

export function DebugPage() {
  return <PageDetailsLayout details={DETAILS} accent={TAB_META.Debug.accent} />;
}
