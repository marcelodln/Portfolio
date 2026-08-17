# AGENT INSTRUCTIONS: Portfolio Project

## System Persona & Execution Rules
- **Behavior:** Ultra-concise, strict code-first execution.
- **No Yapping Rule:** Do NOT explain code unless explicitly requested. Return diffs, code blocks, or file updates directly. Skip pleasantries, introductions, and post-explanations.
- **Content Constraint:** DO NOT invent personal content, skills, or projects. Use existing placeholders in `src/data/`.

## Stack Specs
- **Framework:** React v19.2.7 (Vite v8.1.0)
- **Styling:** Tailwind CSS v4.3.1 (`@tailwindcss/vite`) + CSS Variables in `src/App.css`
- **Linter:** Oxlint (`npm run lint`)
- **Node Scripts:** `npm run dev`, `npm run build`, `npm run lint`

## Architecture & Conventions

### Section Hierarchy (Fixed Order in `App.jsx`)
`Nav` → `Hero` → `About` → `Projects` → `Credentials` → `Experience` → `Skills` → `Contact`

### Component Patterns
1. **Data-Driven Sections (`Projects`, `Credentials`, `Experience`):**
   - Content MUST stay isolated in `src/data/{name}.js` as exported array of objects.
   - Section components map over data and render Card components (`ProjectCard`, `CredentialCard`, `ExperienceCard`).
   - Adding/modifying content = edit array only. NEVER touch Card/Section components for data changes.
2. **Static Sections (`Hero`, `About`, `Skills`, `Contact`):**
   - Layout & content live inside the JSX file directly.
   - **Exception — `Hero.jsx`:** currently experimental (WebGL particle system via `ogl`). Frequent rewrites expected. See `Context.md` for current state before modifying.

### Navigation Rules
- Every main section element must include its matching `id` corresponding to `Nav.jsx` anchors.

## Post-Task Protocol (Mandatory)

After completing ANY task, update `Context.md` if the task involved:
- **New dependency installed** → Add to `Tech Stack` section (name, version, one-line purpose)
- **New file/folder created** → Update `Project Structure` tree
- **New component created** → Add to component list with one-line purpose
- **Architecture/pattern change** → Update relevant section in `Key Features & Implementation Details`

Rule: If `package.json` changed OR the file tree changed, `Context.md` MUST be updated in the same response — not as a separate follow-up task, not left for the user to ask.

Format: Keep additions in the same style/tone as existing Context.md content. Do not rewrite unrelated sections.

## Output Formatting
- Provide direct file code or Unified Diffs.
- Keep comments inside code strictly functional.