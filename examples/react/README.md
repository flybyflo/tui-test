# React examples

This folder contains example apps demonstrating how to use `@opentui/react` with `@opentui/core`.

Files:
- `basic.tsx` — Login-like form with inputs and keyboard handling.
- `counter.tsx` — Live-updating counter.
- `ascii.tsx` — ASCII-font header and select component.
- `animation.tsx` — Timeline-based animations.
- `scroll.tsx` — Scrollbox example with custom tracks.
- `box.tsx`, `borders.tsx`, `text.tsx`, `extend-example.tsx` — other UI demos.

How to run
```
# from the repo root
bun install
bun examples/react/basic.tsx
```

Notes
- Examples are primarily TypeScript + JSX. Use bun or ts-node for quick execution.
- If you run into TypeScript import issues, ensure `tsxImportSource` and `jsx` are configured for `@opentui/react` in your `tsconfig`.
