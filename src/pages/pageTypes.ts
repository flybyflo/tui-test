export type Page = "Deploy" | "Build" | "Debug";

export const TAB_ORDER: Page[] = ["Deploy", "Build", "Debug"];

export const TAB_META: Record<Page, { label: string; helper: string; accent: string }> = {
  Deploy: { label: "Deploy", helper: "Ship to users", accent: "#6ac3ff" },
  Build: { label: "Build", helper: "Tighten the pipeline", accent: "#ffb347" },
  Debug: { label: "Debug", helper: "Trace issues", accent: "#9d7bff" },
};
