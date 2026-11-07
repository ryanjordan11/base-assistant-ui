# Project Context

This file is a compact handoff reference for future coding tasks. Read this
instead of replaying the entire conversation whenever possible.

## App

- Repository: `base-assistant-ui`
- Framework: Next.js 16, React 19, TypeScript
- Styling: Tailwind CSS v4 with existing utility classes
- Root route: `app/page.tsx`
- Main shell: `components/examples/base.tsx`
- Production build: `npm run build`
- Development server: `npm run dev`

## Important Files

- `app/page.tsx`
  - Renders the full-screen app shell.
- `app/layout.tsx`
  - Global metadata, dark mode, and global CSS.
- `components/examples/base.tsx`
  - Client-side assistant shell and local navigation.
  - Contains Home, Projects, Resume, Proof, About, Contact, and chat views.
  - Projects currently renders as an integrated view, not a separate URL route.
- `components/projects/glass-folder.tsx`
  - Self-contained interactive folder component.
  - Includes generated artwork, hover/open animation, file fan, menus,
    floating file cards, keyboard behavior, and reduced-motion handling.
- `app/globals.css`
  - Global styling and Tailwind setup.

## Projects Behavior

The Projects view is in `components/examples/base.tsx` as `ProjectsView`.

Current behavior:

- Project folders render in a responsive grid.
- Hovering a folder lifts and fans its file cards.
- Clicking the folder front opens the folder.
- The back panel has a `View all` control.
- `View all` opens an animated floating-file browser panel.
- Selecting a YouTube file opens an embedded muted YouTube player.
- Selecting an iframe file opens a full-width, tall embedded live app preview.
- Opening a live app hides the Projects intro and uses the center pane.
- Closing a preview returns to the folder layout.
- Opening `View all` from a lower row smoothly scrolls the Projects pane to top.

## Folder File Data

`FolderFile` is defined in `components/projects/glass-folder.tsx`.

Supported fields:

```ts
type FolderFile = {
  name: string;
  meta?: string;
  art?: ArtPreset | ArtRecipe;
  image?: string;
  href?: string;
  youtubeUrl?: string;
  iframeUrl?: string;
};
```

Use these fields as follows:

- `youtubeUrl`: opens in the in-app YouTube player.
- `iframeUrl`: opens in the full-pane live app preview.
- `href`: opens an external link in a new tab.
- `art`: gives a file card generated artwork.
- `image`: gives a file card custom image artwork.

## Current Projects

- Ubiquitous
  - Live app: `https://www.ubiquitousai.dev/`
  - Video: `https://youtu.be/GkYeDjyNt-g`
- The Rock
  - Repository: `https://github.com/ryanjordan11/the-rock-benchmark`
  - Video is still a placeholder and needs a real URL if available.
- Continuum
  - Video: `https://youtu.be/mOdne7SbrPw`
  - Video: `https://youtu.be/sk7_5sTGyAU`
- OneHub
  - Live app: `https://onehub.design`
- Mycontent.dev
  - Live app: `https://mycontent.dev`
- Command OS
  - Live app: `https://onecommand.dev`
- Screen Studio Hub
  - Live app: `https://screenstudiohub.vercel.app/`
- Carousel Template Engine
  - Live app: `https://www.mycontent.dev/template_engine`
- 000 Labs
  - Live app: `https://www.000labs.xyz/`

## Adding A Project

Add a `GlassFolder` inside the Projects grid in `ProjectsView`.

Minimum live-app example:

```tsx
<GlassFolder
  label="Project name"
  meta="Short project description"
  tone="dark"
  art="aurora"
  action="more"
  files={[
    {
      name: "Open project",
      meta: "Live application",
      iframeUrl: "https://example.com",
    },
    {
      name: "Project notes",
      meta: "Description",
      art: "ember",
    },
  ]}
  onFileSelect={selectFile}
  onViewAll={() =>
    selectFolder("Project name", [
      {
        name: "Open project",
        meta: "Live application",
        iframeUrl: "https://example.com",
      },
      {
        name: "Project notes",
        meta: "Description",
        art: "ember",
      },
    ])
  }
/>
```

Keep the same file entries in both `files` and `onViewAll` until project data
is extracted into a manifest.

## Recommended Refactor

The current `base.tsx` is too large. Future cleanup should split it into:

- `components/projects/projects-view.tsx`
  - Projects state, preview panels, and folder grid.
- `components/projects/project-data.ts`
  - Project metadata, URLs, folder files, and artwork choices.
- `components/projects/project-preview.tsx`
  - Shared animated iframe and YouTube preview panel.
- `components/projects/project-file-browser.tsx`
  - Animated `View all` floating-file panel.
- `components/projects/glass-folder.tsx`
  - Keep the reusable folder component isolated.

After that refactor, `base.tsx` should import `ProjectsView` rather than
containing all project data and preview logic.

## Design Rules

- Preserve the existing dark glass visual language.
- Keep the folder cards rounded; artwork must not bleed as square corners.
- Keep live app previews full-width within the Projects pane.
- Keep YouTube previews muted by default.
- Use animated layout transitions instead of instant conditional swaps.
- Keep `View all` files visually consistent with the file cards inside folders.
- Maintain keyboard focus and Escape behavior.
- Respect `prefers-reduced-motion` in the folder component.
- Avoid adding dependencies unless required.

## Validation

Run this after code changes:

```bash
npm run build
```

The build must pass TypeScript checking and Next.js static generation.

## Reusable Handoff Prompt

Use this compact prompt when starting a future task:

```text
This is a Next.js 16 / React 19 / TypeScript app.

Read PROJECT_CONTEXT.md first. The main shell is in
components/examples/base.tsx. The reusable interactive folder component is
components/projects/glass-folder.tsx. Projects currently render as an
integrated view inside the shell, not a separate route.

Folder files support href, youtubeUrl, and iframeUrl. YouTube previews render
muted in-app. iframeUrl projects render as full-width live previews. The
Projects pane uses animated layout transitions, floating file cards, and
smooth scroll-to-top when View all is opened.

Make the smallest compatible change, preserve the dark glass design, and run
npm run build after editing.
```
