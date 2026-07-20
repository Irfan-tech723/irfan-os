# Muhammed Irfan K M — Portfolio ("IRFAN OS")

A Next.js + TypeScript + React Three Fiber + GSAP + Tailwind portfolio, styled
as a private R&D terminal (dark, minimal, no Batman references — the aesthetic
lives in the materials and lighting language, not iconography).

## Important — before you run anything

This project was written in an environment with **no network access**, so it
has **not been installed or built**. Given how much was added in this pass —
10 features across ~45 files — there is a real chance you'll hit a handful of
small issues on first `npm install`/`npm run dev` (a typo, a missing await, a
type mismatch). Treat this as a strong, complete-feeling draft that needs one
real build-and-fix pass on your machine, not a guaranteed zero-error build.
If something doesn't compile, paste me the error and I'll fix it directly.

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Contact info & resume

Real details are wired in throughout: email, phone, GitHub, and LinkedIn
(`https://www.linkedin.com/in/muhammed-irfan-k-m-16513a293/`) live in
`lib/data.ts` and `lib/commands.ts`. Your resume is at `public/resume.pdf` —
the "View Resume" button, the terminal's `resume` command, and IRFAN AI's
"download resume" all open it in a new tab.

## Everything currently in the build

### Core site
Boot sequence, hero with a Three.js "AI core" neural-network visualization,
scroll-triggered reveals, console-dock navigation, About/Skills/Projects/
Education & Record/Contact sections, in-page + secret (`` ` ``) terminal,
Konami code, double-click-the-clock diagnostics, generated UI sound effects,
voice commands with spoken confirmation.

### Achievement System
Session-only (sessionStorage) unlock tracking with a notification queue.
`useAchievements()` exposes `unlock(id)`. All 8 from the brief are wired:
Booted IRFAN OS, Opened Secret Terminal, Played First Game, Visited Every
Project, Downloaded Resume, Activated Matrix Mode, Used Voice Commands,
Found Developer Mode.

### Game Center (hidden)
Terminal-only: `games`/`play` opens the launcher, `play tictactoe` /
`play snake` / `play pong` / `play memory` launches directly. Tic-Tac-Toe
(minimax, unbeatable), Snake (canvas, arrows/WASD), Pong (canvas, vs. a
lagged tracking AI, first to 5), Memory (4×4, uses the site's own tech-stack
terms as card faces). Shared `GameShell` chrome: pause/restart/exit, game
over screens. First launch fires the achievement.

### IRFAN AI
Click "IRFAN AI" in the top bar. A closed-domain assistant
(`lib/ai-responses.ts`) that only answers from `lib/data.ts` — projects,
skills, education, contact — nothing else. Try the suggestion chips or type
your own question. Actions like "download resume" / "contact Irfan" actually
trigger the resume open / scroll-to-contact.

### Matrix Mode
Terminal command `matrix` — the whole site shifts to a green monochrome
palette via a CSS filter (not a full re-theme, but real and site-wide),
digital rain plays on a canvas overlay, a CRT vignette darkens the edges,
and keystrokes make a soft typing tick. Type `exit` to return to normal.
Fires the achievement on activation.

### Developer Mode
`Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac) opens a debug panel: live FPS,
JS heap usage (Chrome only — `performance.memory` isn't standard), viewport/
DPR, a mock "scene hierarchy" of the page's section ids, and a wireframes
toggle that outlines every DOM element. Fires the achievement on first open.

### Desktop Mode
"DESKTOP MODE" button in the top bar swaps the whole page for a fullscreen
desktop with icons (Projects, Resume, Terminal, GitHub, LinkedIn, Contact,
Diagnostics). Double-click an icon to open a real window: draggable by its
title bar, resizable from the bottom-right corner, with working close/
minimize (drops to a taskbar at the bottom)/maximize buttons. "WEBSITE MODE"
returns you to the normal site.

### Interactive Globe
In the About section: a small Three.js globe (lat/long wireframe, no texture
assets since none were supplied) with a glowing, pulsing pin at Mangaluru's
real coordinates, plus "Open to Opportunities" / "Open to Relocation" tags.

### Live GitHub
Bottom of the Skills section: real data from the public, unauthenticated
GitHub REST API (`api.github.com`) — public repo count, followers, and your
6 most recently updated repos with language/stars, each linking out. **Not
included**: the contribution calendar — that data is only exposed via
GitHub's authenticated GraphQL API, and shipping a personal token client-side
isn't safe to do, so it's intentionally left out with an honest note in the
UI. Subject to GitHub's anonymous rate limit (60 requests/hour/IP).

### Interactive Project Demos
Expand any project dossier and click "Launch Demo ↗": Expense Splitter runs
Fake Login → Dashboard → Add Expense; the Microplastic project runs Upload →
Prediction; Smart Health ID runs Scan QR → Record; IRFAN OS shows a one-step
workspace note (since you're already using it). These are small interactive
mockups, not screenshots or embedded iframes — see
`components/project-demos/DemoStepView.tsx` to extend them.

### Knowledge Books
"Field Notes" shelf at the bottom of the Education & Record section — 4
book spines (Resume, Education, Projects, Certifications). Click one for a
paged modal with a lightweight page-turn transition. Content is pulled
straight from `lib/data.ts`, so it can't drift out of sync with the rest of
the site.

## Project structure

```
app/
  layout.tsx, page.tsx (composes everything + every provider), globals.css
components/
  Boot/nav/hero/section components (unchanged from earlier passes)
  achievement-system/   — notification queue UI
  game-center/           — launcher + GameShell + games/
  matrix-mode/            — rain canvas + CSS-filter wrapper
  developer-mode/          — debug overlay
  irfan-ai/                 — chat console
  desktop-mode/               — Desktop, DesktopIcon, Window, WindowContent, WindowManagerHost
  globe/                       — Three.js globe
  github/                       — live GitHub panel
  project-demos/                 — demo modal + per-step mockups
  knowledge-books/                 — bookshelf + flip modal
context/
  AchievementContext, GameCenterContext, MatrixModeContext, DevModeContext,
  IrfanAIContext, DesktopModeContext — one per feature, all composed in
  app/page.tsx
hooks/
  useKonami, useVoiceConsole, useSound, useGameLoop, useDraggable, useGithubData
lib/
  data.ts, commands.ts, achievements.ts, games.ts, ai-responses.ts,
  project-demos.ts, books.ts
public/
  resume.pdf
```

## Terminal commands (complete list)

`help` · `whoami` · `projects` · `skills` · `education` · `achievements` ·
`contact` · `github` · `linkedin` · `resume` · `games` / `play` /
`play <tictactoe|snake|pong|memory>` · `matrix` · `exit` · `mission` ·
`sudo hire irfan` · `clear`

## Deploying

Stock Next.js app — push to GitHub, import on
[Vercel](https://vercel.com/new). No special config needed.

## Extending

- Add a 5th game: one entry in `lib/games.ts`, one component in
  `components/game-center/games/`, one line in `GameCenterHost.tsx`'s
  `GAME_COMPONENTS` map.
- Add a project demo: one entry in `lib/project-demos.ts` keyed by the
  project's `index`, plus any new step `kind`s in `DemoStepView.tsx`.
- Swap the wireframe hero core or the globe for real `.glb` models via
  `@react-three/drei`'s `useGLTF` if you want more literal 3D objects later.
