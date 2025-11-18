import { TextAttributes, createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";
import { useMemo, useState } from "react";

import { BuildPage } from "./pages/BuildPage";
import { DebugPage } from "./pages/DebugPage";
import { DeployPage } from "./pages/DeployPage";
import { TAB_META, TAB_ORDER } from "./pages/pageTypes";
import type { Page } from "./pages/pageTypes";

function LandingSelect({
  value,
  onPreviewChange,
  onSubmit,
}: {
  value: Page;
  onPreviewChange: (page: Page) => void;
  onSubmit: (page: Page) => void;
}) {
  const options = useMemo(
    () =>
      TAB_ORDER.map((id) => ({
        name: TAB_META[id].label,
        description: TAB_META[id].helper,
        value: id,
      })),
    []
  );

  const selectedIndex = TAB_ORDER.indexOf(value);

  return (
    <box
      flexGrow={1}
      style={{
        padding: 3,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#050608",
        border: true,
        borderColor: "#161921",
      }}
    >
      <ascii-font text="tool" font="block" style={{ alignSelf: "flex-start", marginBottom: 1 }} />
      <text content="Choose a workspace mode" attributes={TextAttributes.BOLD} fg="#f7f9ff" style={{ marginTop: 1 }} />
      <text content="Enter to open · Esc to return" attributes={TextAttributes.DIM} style={{ marginTop: 0.5 }} />
      <box style={{ marginTop: 2, border: true, borderColor: "#1f232c", padding: 1, height: 10 }}>
        <select
          focused
          showScrollIndicator
          options={options}
          selectedIndex={selectedIndex < 0 ? 0 : selectedIndex}
          style={{ flexGrow: 1 }}
          onChange={(_, option) => {
            if (option?.value) {
              onPreviewChange(option.value as Page);
            }
          }}
          onSelect={(_, option) => {
            if (option?.value) {
              onSubmit(option.value as Page);
            }
          }}
        />
      </box>
      <text content={TAB_META[value].helper} style={{ marginTop: 1 }} fg={TAB_META[value].accent} />
    </box>
  );
}

function PageContent({ page }: { page: Page }) {
  switch (page) {
    case "Deploy":
      return <DeployPage />;
    case "Build":
      return <BuildPage />;
    case "Debug":
      return <DebugPage />;
    default:
      return null;
  }
}

function App() {
  const [landingSelection, setLandingSelection] = useState<Page>("Deploy");
  const [activePage, setActivePage] = useState<Page | null>(null);

  useKeyboard((key) => {
    if (key.name === "escape" && activePage !== null) {
      setActivePage(null);
    }
  });

  const isLanding = activePage === null;

  return (
    <box flexDirection="column" flexGrow={1} style={{ backgroundColor: "#0b0c10" }}>
      {isLanding ? (
        <LandingSelect
          value={landingSelection}
          onPreviewChange={(page) => setLandingSelection(page)}
          onSubmit={(page) => setActivePage(page)}
        />
      ) : (
        <PageContent page={activePage ?? landingSelection} />
      )}
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
