# OLAMOSES — The 40th Frame

Frontend foundation for a cinematic, editorial birthday website.

## Stack

- React 19 + TypeScript + Vite
- Plain CSS with custom properties (no Tailwind)
- Cormorant Garamond (display) and Manrope (body) via Google Fonts
- GSAP and Lenis (installed, Lenis wired up for smooth scrolling)

## Structure

```
src/
  components/
    layout/       Layout shell, Container, Section, Footer
    navigation/   Fixed responsive Navigation (+ mobile menu)
    sections/     Hero, Story, Frames, Milestones
  constants/      Section/nav link definitions (single source of truth)
  hooks/          useSmoothScroll (Lenis)
  styles/         Lenis base styles
  index.css       Design tokens, reset, base typography, shared primitives
```

## Conventions

- All colours, type, spacing, layout and motion values are tokens in `src/index.css`.
  Use the tokens rather than hard-coded values.
- Section anchors (`#story`, `#frames`, …) are defined in `src/constants/sections.ts`
  and must match the `id` passed to `Section`.
- Each component keeps its own stylesheet next to it.
- Layout is mobile-first; breakpoints are declared with `min-width` media queries.

## Status

Foundation only. Section designs, content, imagery and any backend
integration (Supabase) are intentionally not implemented yet.

## Scripts

```bash
npm run dev      # dev server
npm run build    # type-check + production build
npm run lint     # eslint
```
