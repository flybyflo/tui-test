# Copilot / AI Assistant instructions for this repo

This file contains concise guidance for AI coding agents working on this repository. The goal is to enable quick, safe changes and to follow existing patterns so suggestions are viable and easy to test.

## Quick summary (big picture)
- This repository contains a small OpenTUI-based React app and examples demonstrating how to use `@opentui/core` and `@opentui/react`.
- Architecture: user code (React components in `src` and `examples/react/*`) -> `@opentui/react` (React reconciler & hooks) -> `@opentui/core` (CLI renderer & renderables) -> native platform runtime (via Bun or node).
- The examples aim to be runnable as standalone entrypoints (they each create a renderer and call `createRoot(renderer).render(<App />)`).

## Run & dev workflow
- Preferred developer runtime: Bun. Common commands:
  - Install deps: `bun install`
  - Run the main app: `bun run src/index.tsx` (or package script: `bun run dev` to watch the entrypoint)
  - Run an example: `bun examples/react/basic.tsx` (run from the repo root)
- If you cannot use Bun, run examples via `tsx`/`ts-node` with the equivalent flags; however, this repo is configured specifically for Bun and its lockfile.

## Entrypoints & patterns to follow
- Each example and the `src/index.tsx` create a renderer using `await createCliRenderer()` and then call `createRoot(renderer).render(<App />)`.
- Keep top-level files simple—setup the renderer, create root, then render a single top-level component.
- Use hooks provided by `@opentui/react` for cross-cutting concerns:
  - `useKeyboard` — for keyboard events
  - `useRenderer` — to access the renderer & debug console
  - `useTimeline` — for animation-driven updates

## UI component & props conventions
- Components are lower-case tags (e.g., `<box>`, `<text>`, `<input>`, `<scrollbox>`, `<ascii-font>`) and follow props similar to React props.
- Styling is passed as props or via `style` object for specialized options:
  - Simple: `<text content="hi" fg="#FFFF00" />`
  - Complex (e.g., scrollbox): `style={{ rootOptions: { backgroundColor: '...' }, wrapperOptions: { ... } }}`
- Focusable controls accept a `focused` boolean prop and call lifecycle callbacks (e.g., `onInput`, `onSubmit`, `onChange` for `input`/`select`).
- Use `TextAttributes` bitmask or helper functions (`bold`, `italic`, `fg`) from `@opentui/core` for styled text.

## Extendable renderable pattern
- To add new components that render to the terminal:
  1. Extend `BoxRenderable` or other `@opentui/core` renderable class.
  2. Implement or override `renderSelf` and other lifecycle methods, and call `requestRender()` when state changes.
  3. Use `extend()` and a TypeScript module augmentation so `@opentui/react` recognizes your new component as a proper type.
- See `examples/react/extend-example.tsx` for a complete example of custom renderable + augmentation.

## Debugging & developer tooling
- Example `basic.tsx` toggles debugging overlay and console via `renderer?.toggleDebugOverlay()` and `renderer?.console.toggle()` (the keyboard event is `ctrl+k` there). Use these in code to quickly see debug overlays.
- The `createCliRenderer()` returns a renderer instance that can be used for debugging, toggling overlays, and inspecting console output.
- Use `bun run --watch src/index.tsx` for rapid development iteration (watch mode).

## TypeScript & Build details
- Primary tsconfig is at `tsconfig.json`.
  - JSX runtime is configured to `jsxImportSource: "@opentui/react"` and `jsx` = `react-jsx` — this enables automatic JSX runtime and eliminates the need to import React explicitly.
  - `target` is ESNext; `moduleResolution` is `bundler`.
- Keep the `module` field in `package.json` pointing to the TypeScript entry (`src/index.tsx`). The repo is `type: module`.

## Conventions & PR guidance
- When suggesting code:
  - Prefer adding examples under `examples/react/` demonstrating changes (new components, UI patterns, or prop updates).
  - If you add a new example, add a single file that creates a renderer and calls `createRoot(renderer).render(<YourExample />)`; run the example with `bun` to validate.
  - For component library work (extending Renderable), follow `extend` pattern and add TS module augmentation.
- For styling / color values, use hex color strings (e.g., `#ffffff`). For text attributes, use `TextAttributes` or helpers (`bold`, `italic`, `fg`).

## Files to inspect for context
- `package.json` — entrypoint and dev script
- `tsconfig.json` — TS and JSX runtime behavior
- `src/index.tsx` — primary entry and typical usage
- `examples/react/*` — canonical examples of patterns and APIs
- `EXAMPLES.md` & `examples/react/README.md` — how to run examples

## Known limitations & guidelines
- This repository is primarily example/demo code (no unit tests). Verify behavior by manually running samples.
- Platform-specific `@opentui/core` native bindings are controlled by Bun optional dependencies (see `bun.lock`). Expect platform-specific behavior on some environments.

## Quick code examples (copy/paste ready)
- Minimal entry:

```tsx
const renderer = await createCliRenderer()
createRoot(renderer).render(<App />)
```

- Basic keyboard handling and debug toggle:

```tsx
useKeyboard((key) => {
  if (key.ctrl && key.name === "k") {
     renderer?.toggleDebugOverlay()
     renderer?.console.toggle()
  }
})
```

- Extending components (pattern): `examples/react/extend-example.tsx` demonstrates the full pattern.

---

If anything in this guidance is unclear, or there are other parts of the repository you want the AI to prioritize (e.g., documenting a component design or converting examples to tests), tell me where to focus next. 
