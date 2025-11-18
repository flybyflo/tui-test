import { TextAttributes } from "@opentui/core";

export type PageDetails = {
  title: string;
  description: string;
  steps: string[];
  highlightLabel: string;
  command: string;
  tip: string;
};

export function PageDetailsLayout({ details, accent }: { details: PageDetails; accent: string }) {
  return (
    <box flexGrow={1} style={{ padding: 2, flexDirection: "column" }}>
      <box style={{ border: true, padding: 2, backgroundColor: "#101216" }}>
        <text content={details.title} attributes={TextAttributes.BOLD} fg={accent} />
        <text content={details.description} style={{ marginTop: 1 }} />
      </box>

      <box style={{ marginTop: 1, border: true, padding: 1 }}>
        {details.steps.map((step, idx) => (
          <text key={step} content={`${idx + 1}. ${step}`} />
        ))}
      </box>

      <box style={{ marginTop: 1, border: true, padding: 1, backgroundColor: "#0f1014" }}>
        <text content={details.highlightLabel} fg={accent} attributes={TextAttributes.BOLD} />
        <text content={details.command} style={{ marginTop: 0.5 }} />
      </box>

      <text content={details.tip} attributes={TextAttributes.DIM} style={{ marginTop: 1 }} />
    </box>
  );
}
