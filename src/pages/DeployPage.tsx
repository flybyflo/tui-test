import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useEffect, useMemo, useState } from "react";
import { TAB_META } from "./pageTypes";

const SOFTWARE_COMPONENTS = ["Frontend", "Backend", "Realtime"];
const VERSION_OPTIONS = ["v1", "v1.2", "v2"];

type DeploySelection = Record<string, string | null>;

export function DeployPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selection, setSelection] = useState<DeploySelection>(() =>
    Object.fromEntries(SOFTWARE_COMPONENTS.map((name) => [name, null]))
  );

  useKeyboard((key) => {
    if (key.name === "left") {
      setActiveStep((prev) => Math.max(0, prev - 1));
    }
    if (key.name === "right") {
      setActiveStep((prev) => Math.min(MULTISTEP_STEPS.length - 1, prev + 1));
    }
  });

  return (
    <box flexDirection="column" flexGrow={1}>
      <MultiStepSetup accent={TAB_META.Deploy.accent} activeStep={activeStep} />
      <StepContent
        activeStep={activeStep}
        accent={TAB_META.Deploy.accent}
        selection={selection}
        onSelectionChange={(component, version) =>
          setSelection((prev) => ({ ...prev, [component]: version }))
        }
      />
    </box>
  );
}

const MULTISTEP_STEPS = ["Step 1", "Step 2", "Step 3", "Step 4"];

function MultiStepSetup({ accent, activeStep }: { accent: string; activeStep: number }) {
  return (
    <box
      style={{
        padding: 1,
        margin: 2,
        marginBottom: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <box style={{ flexDirection: "row", alignItems: "baseline" }}>
        <text content="Deploy setup" attributes={TextAttributes.BOLD} fg={accent} />
        <text content="· Use ← / →" attributes={TextAttributes.DIM} style={{ marginLeft: 1 }} />
      </box>
      <box style={{ flexDirection: "row", marginTop: 0 }}>
        {MULTISTEP_STEPS.map((label, idx) => (
          <box
            key={label}
            style={{
              paddingLeft: 2,
              paddingRight: 2,
              border: true,
              borderColor: idx === activeStep ? accent : "#424651",
              marginRight: idx < MULTISTEP_STEPS.length - 1 ? 1 : 0,
            }}
          >
            <text content={label} attributes={idx === activeStep ? TextAttributes.BOLD : undefined} fg={idx === activeStep ? accent : "#a1a5b4"} />
          </box>
        ))}
      </box>
    </box>
  );
}

const STEP_CONTENT = ["Step 1", "Step 2", "Step 3", "Step 4"];

function StepContent({
  activeStep,
  accent,
  selection,
  onSelectionChange,
}: {
  activeStep: number;
  accent: string;
  selection: DeploySelection;
  onSelectionChange: (component: string, version: string | null) => void;
}) {
  if (activeStep === 0) {
    return (
      <StepOneSelector
        accent={accent}
        isActive={activeStep === 0}
        selection={selection}
        onSelectionChange={onSelectionChange}
      />
    );
  }

  if (activeStep === 1) {
    return <StepTwoSummary selection={selection} accent={accent} />;
  }

  if (activeStep === 2) {
    return <StepThreeJson accent={accent} />;
  }

  if (activeStep === 3) {
    return <StepFourOverview selection={selection} accent={accent} />;
  }

  return (
    <box style={{ padding: 2, marginTop: 1, border: true, borderColor: "#1c2028", backgroundColor: "#0b0d12" }}>
      <text content={STEP_CONTENT[activeStep] ?? ""} attributes={TextAttributes.BOLD} fg={accent} />
    </box>
  );
}

function StepThreeJson({ accent }: { accent: string }) {
  const jsonContent = JSON.stringify(
    {
      deployment: {
        id: "dep_123456789",
        status: "pending",
        region: "us-east-1",
        resources: {
          cpu: "2 vCPU",
          memory: "4 GB",
          storage: "100 GB SSD",
        },
        env: {
          NODE_ENV: "production",
          API_KEY: "****",
        },
      },
    },
    null,
    2
  );

  return (
    <box style={{ padding: 2, marginTop: 1, border: true, borderColor: "#1c2028", backgroundColor: "#0b0d12", flexDirection: "column", height: 15 }}>
      <text content="Deployment Configuration" attributes={TextAttributes.BOLD} fg={accent} />
      <text content={jsonContent} style={{ marginTop: 1 }} />
    </box>
  );
}

function StepOneSelector({
  accent,
  isActive,
  selection,
  onSelectionChange,
}: {
  accent: string;
  isActive: boolean;
  selection: DeploySelection;
  onSelectionChange: (component: string, version: string | null) => void;
}) {
  const [componentIndex, setComponentIndex] = useState(0);
  const [versionIndex, setVersionIndex] = useState(0);
  const [focusArea, setFocusArea] = useState<"components" | "versions">("components");

  const componentSummary = useMemo(() => SOFTWARE_COMPONENTS[componentIndex] ?? "", [componentIndex]);
  const versionSummary = useMemo(() => VERSION_OPTIONS[versionIndex] ?? "", [versionIndex]);

  useEffect(() => {
    const currentVersion = selection[componentSummary];
    if (!currentVersion) {
      setVersionIndex(0);
      return;
    }
    const idx = VERSION_OPTIONS.indexOf(currentVersion);
    setVersionIndex(idx >= 0 ? idx : 0);
  }, [componentSummary, selection]);

  useKeyboard((key) => {
    if (!isActive) return;

    if (focusArea === "components") {
      if (key.name === "up") {
        setComponentIndex((prev) => Math.max(0, prev - 1));
      }
      if (key.name === "down") {
        setComponentIndex((prev) => Math.min(SOFTWARE_COMPONENTS.length - 1, prev + 1));
      }
      if (key.name === "return" || key.name === "enter") {
        onSelectionChange(componentSummary, selection[componentSummary] ?? null);
        setFocusArea("versions");
      }
    } else {
      if (key.name === "up") {
        setVersionIndex((prev) => Math.max(0, prev - 1));
      }
      if (key.name === "down") {
        setVersionIndex((prev) => Math.min(VERSION_OPTIONS.length - 1, prev + 1));
      }
      if (key.name === "return" || key.name === "enter") {
        onSelectionChange(componentSummary, versionSummary);
        setFocusArea("components");
      }
      if (key.name === "left") {
        setFocusArea("components");
      }
    }
  });

  return (
    <box style={{ padding: 2, marginTop: 1, border: true, borderColor: "#1c2028", backgroundColor: "#0b0d12", flexDirection: "column" }}>
      <text content="Pick component + version" attributes={TextAttributes.BOLD} fg={accent} />
      <text content="↑/↓ to move · Enter to toggle pane · ← to go back" attributes={TextAttributes.DIM} style={{ marginTop: 0.5 }} />
      <box style={{ flexDirection: "row", marginTop: 1 }}>
        <box
          style={{
            flexDirection: "column",
            border: true,
            borderColor: focusArea === "components" ? accent : "#2a2f3a",
            width: 20,
            padding: 1,
          }}
        >
          {SOFTWARE_COMPONENTS.map((label, idx) => (
            <text
              key={label}
              content={`${idx === componentIndex ? "▶ " : "  "}${label}`}
              attributes={idx === componentIndex ? TextAttributes.BOLD : undefined}
              fg={idx === componentIndex ? accent : "#c0c4d0"}
            />
          ))}
        </box>
        <box style={{ width: 2 }} />
        <box
          style={{
            flexDirection: "column",
            border: true,
            borderColor: focusArea === "versions" ? accent : "#2a2f3a",
            padding: 1,
            width: 16,
          }}
        >
          {VERSION_OPTIONS.map((label, idx) => (
            <text
              key={label}
              content={`${idx === versionIndex ? "▶ " : "  "}${label}`}
              attributes={idx === versionIndex ? TextAttributes.BOLD : undefined}
              fg={idx === versionIndex ? accent : "#c0c4d0"}
            />
          ))}
        </box>
      </box>
      <box style={{ marginTop: 1 }}>
        <text content="Selection:" attributes={TextAttributes.BOLD} fg={accent} />
        <box style={{ flexDirection: "column", marginLeft: 1 }}>
          {SOFTWARE_COMPONENTS.map((component) => (
            <text
              key={component}
              content={`${component}: ${selection[component] ?? "—"}`}
              fg={selection[component] ? accent : "#9ea3b5"}
            />
          ))}
        </box>
      </box>
    </box>
  );
}

function StepTwoSummary({ selection, accent }: { selection: DeploySelection; accent: string }) {
  const entries = SOFTWARE_COMPONENTS.map((component) => ({
    component,
    version: selection[component],
  }));

  return (
    <box style={{ padding: 2, marginTop: 1, border: true, borderColor: "#1c2028", backgroundColor: "#0b0d12", flexDirection: "column" }}>
      <text content="Review all components" attributes={TextAttributes.BOLD} fg={accent} />
      {entries.map(({ component, version }) => (
        <text key={component} content={`${component}: ${version ?? "Not selected"}`} style={{ marginTop: 1 }} />
      ))}
    </box>
  );
}

function StepFourOverview({ selection, accent }: { selection: DeploySelection; accent: string }) {
  const selectedCount = Object.values(selection).filter((v) => v !== null).length;
  const totalCount = SOFTWARE_COMPONENTS.length;
  const allSelected = selectedCount === totalCount;

  return (
    <box style={{ padding: 2, marginTop: 1, border: true, borderColor: "#1c2028", backgroundColor: "#0b0d12", flexDirection: "column", height: 15 }}>
      <text content="Deployment Overview" attributes={TextAttributes.BOLD} fg={accent} />
      <text content={`Ready to deploy ${selectedCount} of ${totalCount} components`} style={{ marginTop: 1 }} />
      
      <box style={{ marginTop: 2, flexDirection: "column" }}>
        <text content="Selected Components:" attributes={TextAttributes.BOLD} style={{ marginBottom: 0.5 }} />
        {SOFTWARE_COMPONENTS.map((component) => {
          const version = selection[component];
          return (
            <text
              key={component}
              content={`  ${version ? "✓" : "✗"} ${component}: ${version ?? "Not selected"}`}
              fg={version ? "#50fa7b" : "#ff5555"}
              style={{ marginTop: 0.3 }}
            />
          );
        })}
      </box>

      <box style={{ marginTop: 2, border: true, borderColor: allSelected ? accent : "#424651", padding: 1 }}>
        <text
          content={allSelected ? "✓ All components ready for deployment" : "⚠ Some components not selected"}
          attributes={TextAttributes.BOLD}
          fg={allSelected ? "#50fa7b" : "#ffb86c"}
        />
      </box>
    </box>
  );
}
