# CLAUDE.md

Guidance for Claude Code (and any other agent) working in this repository.
The authoritative product brief is `SPEC.md` — read it first for the *why*
if it's present locally (it's gitignored, an internal planning doc kept out
of the public repo — if you don't have it, ask the repo owner rather than
guessing its contents). This file covers the *how*: layout, conventions,
commands, and rules that keep the codebase consistent as it grows.

## What this repo is

`pk-validators-react` is a monorepo for a zero-dependency-core React
validation toolkit for Pakistani data formats (CNIC, mobile phone, passport).
The differentiator is the React UX layer (masked inputs, hooks, RHF/Zod
resolvers), not the validation regexes themselves — see SPEC.md §1-2.

Two packages, deliberately not three:

```
packages/
  react/   pk-validators-react     THE package app developers install. Hooks,
                                    controlled input components, validators
                                    (re-exported from core), and a
                                    pk-validators-react/resolvers subpath
                                    (Zod schemas + pkResolver() for RHF).
  core/    @pk-validators/core     zero-dep validation/formatting logic.
                                    Published standalone for non-React/
                                    backend use (per SPEC.md §1/§3), but is
                                    a regular `dependency` of react, so app
                                    developers never install it by hand.
```

This started as three packages (core/react/resolvers, mirroring SPEC.md
§3's original proposal) but was collapsed to two after user feedback that
three separate `npm install`s for one form field was bad DX. The resolution
keeps SPEC.md's real goal (a zero-dep package usable without React) while
giving React consumers exactly one required install:
`pk-validators-react`'s `dependencies` field pulls in `@pk-validators/core`
transitively, and `src/index.ts` re-exports core's validators explicitly
(not just relying on transitive/phantom resolution) so
`import { validateCnic } from 'pk-validators-react'` works without a
second install. The old standalone `@pk-validators/resolvers` package was
deleted and its code moved to `pk-validators-react/resolvers` (a second
tsup entry point + `exports` subpath) — `zod`/`react-hook-form` remain
optional peer dependencies, only required if that subpath is imported.

**Don't re-split this** (e.g. re-extracting resolvers back into its own
package, or making react's dependency on core a peerDependency instead)
without the user asking — that was the specific DX problem this structure
was built to solve.

## Hard rules

1. **`core` stays zero-dependency.** Never add a runtime `dependency` to
   `packages/core/package.json` — that package's entire value proposition is
   being usable outside React, even server-side, with nothing else in the
   tree. `devDependencies` (typescript, tsup, vitest) are fine.
2. **Never fabricate authoritative data.** The CNIC province/district decode
   table and any future passport-format claims must come from a cited
   NADRA/DGIP source, not a plausible guess. Until sourced, leave these as
   documented extension points (see SPEC.md §4, §7). Don't quietly add a
   decode table "to be helpful."
3. **Distinguish incomplete from invalid, always.** Every validator returns
   an `incomplete` flag distinct from `valid`. A user who has typed 4 of 13
   CNIC digits is *incomplete*, not *invalid* — never regress this into a
   single boolean. This is the core UX differentiator called out in
   SPEC.md §2 and §4.
4. **Best-effort data stays flagged in code.** The carrier-prefix table
   (`packages/core/src/phone.ts`) and the passport regex
   (`packages/core/src/passport.ts`) carry comments noting they need
   periodic/authoritative reconfirmation. Keep those comments if you touch
   the code; don't strip them because they look like clutter.
5. **v1 scope is 3 field types, deliberately narrow.** Don't add NICOP,
   B-Form, NTN, STRN, IBAN, vehicle registration, driving license, landline,
   postal code, or EOBI validators without the user explicitly asking —
   SPEC.md §4 lists these as out-of-scope v2 candidates on purpose.

## Package conventions

- `core` builds one tsup entry (`src/index.ts`). `react` builds two —
  `src/index.ts` (main) and `src/resolvers/index.ts` (the `/resolvers`
  subpath) — see `packages/react/package.json`'s `build` script, `exports`
  map, and `typesVersions` (the latter is for consumers on older
  `moduleResolution` settings that don't read `exports`).
- Each package's `tsconfig.json` extends the root `tsconfig.base.json` — put
  shared compiler options there, not duplicated per package.
- Public API of every package/subpath is re-exported from its entry file
  only (`src/index.ts`, `src/resolvers/index.ts`). Don't deep-import
  internal files across package boundaries.
- `react` package externalizes `react` (peer dependency, not bundled).
  `zod` and `react-hook-form` are also peer dependencies of `react`
  (both marked `optional` in `peerDependenciesMeta` — only needed if the
  consumer imports `pk-validators-react/resolvers`).
- Every exported validator function returns a result object with at least
  `{ valid, incomplete, formatted }` — keep new validators (if any are ever
  added) consistent with this shape rather than inventing a new one.
- Hook return shape (see SPEC.md §5): `value, onChange, isValid, isComplete,
  formatted, <domain-specific fields>, error`. Match this across hooks.
- Components forward all standard `<input>` props, and always set
  `aria-invalid` + `aria-describedby` correctly — this isn't optional
  polish, it's the stated deliverable.

## Commands

Run from the repo root (npm workspaces):

```bash
npm install                 # installs both packages' deps
npm run build                # builds core, then react (tsup, --if-present) — core must build first
npm test                     # runs vitest in every package that has tests
npm run storybook            # Storybook dev server for packages/react, localhost:6006
npm run build-storybook      # static Storybook build → packages/react/storybook-static
```

Per-package, from inside `packages/<name>`:

```bash
npm run build      # tsup
npm test           # vitest run (core, and any package with tests)
```

## Testing

- `core` validators must have unit tests covering three states per field
  type: valid, structurally invalid, and incomplete/partial — per SPEC.md
  §6 deliverable 5. Don't merge a new validator without all three cases.
- Prefer plain vitest over adding new test-only dependencies.

## Storybook / demo site

- Storybook lives in `packages/react` (`.storybook/`, `src/**/*.stories.tsx`,
  `src/**/*.mdx`) and is the interactive docs + demo site, built as a static
  site for deployment (see `vercel.json` at repo root: build command
  `npm install && npm run build-storybook`, output
  `packages/react/storybook-static`).
- `src/stories/Introduction.mdx` is the sidebar's first page (ordering is
  pinned via `storySort` in `.storybook/preview.ts`) — narrative
  install/quick-start docs for components, hooks, plain validators, and
  resolvers. Keep it in sync when the public API changes; it's the first
  thing a visitor reads, not an afterthought next to the interactive
  stories.
- Every new public component or hook should get a stories file with at
  least: empty, while-typing/partial, valid, invalid, and both locales
  (`en`/`ur`) — mirror the existing `CnicInput.stories.tsx` /
  `PhoneInput.stories.tsx` pattern.
- Storybook is a client-rendered SPA, which is inherently weak for organic
  SEO (crawlers see little pre-rendered content). SEO work here
  (`.storybook/manager-head.html`, `preview-head.html`, `public/robots.txt`,
  `public/sitemap.xml`) is a pragmatic ceiling, not a substitute for a real
  static docs site. If SEO becomes a priority beyond link-preview/meta-tag
  correctness, that's a separate scoping conversation (e.g. a dedicated
  Next.js/Astro docs site), not something to silently bolt on here.

## Publishing (not automated — do not run without explicit user request)

Packages are publish-ready (`files: ["dist"]`, correct `main`/`module`/
`types`) but this repo does not publish or deploy on its own. When the user
asks to actually publish/deploy:

```bash
cd packages/core && npm publish --access public   # publish first — react depends on it
cd packages/react && npm publish --access public   # publishes as "pk-validators-react"
```

`pk-validators-react` (unscoped) and the `@pk-validators` scope (for
`core`) were both verified free on npm as of the initial build, but the
`@pk-validators` org still needs to be created on npm before the `core`
publish will succeed — that's a one-time manual step for the repo owner,
not something to script around.

### Vercel deploy

This repo includes a `vercel.json` pointing at the Storybook build output.

1. Push this repo to GitHub.
2. In Vercel: **New Project → Import this repo**.
3. Vercel reads `vercel.json` automatically — build command
   `npm install && npm run build-storybook`, output directory
   `packages/react/storybook-static`.
4. Deploy. The resulting URL is the combined docs + interactive demo site.

(Netlify/Cloudflare Pages work the same way — same build command and
output directory, set manually in their dashboard instead of
`vercel.json`.)

Once a real URL exists, update the placeholder
`pk-validators-react.vercel.app` domain in `packages/react/public/
robots.txt` and `sitemap.xml` (both currently have a `TODO` comment marking
this).

## Open items inherited from SPEC.md §8 — do not treat as resolved

- Passport number format (`[A-Z]{2}[0-9]{7}`) is community-sourced, not
  confirmed against DGIP/NADRA documentation.
- CNIC province/district decode table is intentionally not implemented.
- Carrier prefix ranges are best-effort and need periodic review.
