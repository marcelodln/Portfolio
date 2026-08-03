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

### Navigation Rules
- Every main section element must include its matching `id` corresponding to `Nav.jsx` anchors.

## Roadmap & Current State
- **Current Phase:** Phase 2 (Componentization) → Moving to Phase 2.5 (Visual Direction).
- **Rule:** Do not jump to Phase 4 (Framer Motion) or fill real content until Phase 2 & 3 are complete.

## Output Formatting
- Provide direct file code or Unified Diffs.
- Keep comments inside code strictly functional.