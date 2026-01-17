# Repository Guidelines

## Project Structure & Module Organization
- `src/` is the main Vue 3 app (Pinia store, Vue Router, views, components, utils).
- `src/views/` contains page-level modules (feature pages under `src/views/tk_custom/` and `src/views/system/`).
- `src/api/` centralizes API clients by domain (e.g., `src/api/system/`, `src/api/tk_custom/`).
- `src/assets/` holds styles, images, and SVG icons; global styles live in `src/assets/styles/`.
- `public/` is for static assets copied as-is to the build output.
- `vite/` contains Vite plugin configuration; `vite.config.js` defines aliases and dev proxy.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the Vite dev server (default `http://localhost:80`) with proxy `/dev-api` -> `http://127.0.0.1:8180`.
- `npm run build:prod`: production build via Vite.
- `npm run build:stage`: staging build (`--mode staging`).
- `npm run preview`: preview a production build locally.
- Windows helpers exist in `bin/` (e.g., `bin/run-web.bat`, `bin/build.bat`).

## Coding Style & Naming Conventions
- Indentation: 2 spaces in JS/Vue/SCSS, matching existing files like `src/main.js`.
- Prefer single quotes in JS/TS; follow local file conventions when editing.
- Vue SFCs use PascalCase component filenames (e.g., `Pagination/index.vue`) and kebab-case for route paths.
- Keep API modules grouped by domain under `src/api/` and export functions per endpoint.

## Testing Guidelines
- No test runner is currently configured in `package.json`.
- If you add tests, include the framework, add `npm` scripts, and document how to run them in this file.

## Commit & Pull Request Guidelines
- Commit messages follow a simple type prefix, e.g., `feat:`, `bug:`, `build:` (see recent Git history).
- PRs should include: a short summary, screenshots for UI changes, and any relevant API or config notes.
- Link related issues or backend changes when applicable.

## Configuration & Environment
- Vite env vars are loaded via `loadEnv`; use `VITE_*` keys.
- Update `vite.config.js` proxy settings if backend ports or paths change.
