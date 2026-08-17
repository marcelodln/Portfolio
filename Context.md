# Project Context: Portfolio

## Overview
This project is a modern, responsive landing page built using **React** and **Vite**. It serves as a portfolio website, built on top of the Vite React template with a clean design and interactive elements.

## Tech Stack
- **Framework:** [React](https://react.dev/) (v19.2.7)
- **Build Tool:** [Vite](https://vitejs.dev/) (v8.1.0)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4.3.1) via `@tailwindcss/vite`
- **Animations:** [Framer Motion](https://www.framer.com/motion/) (v12.43.0) — used for scroll-in and hover animations
- **3D/Graphics:** [ogl](https://github.com/oframe/ogl) (check `package.json` for exact version) — lightweight WebGL library, used in Hero for a particle system background
- **Fonts:** [Poppins](https://fonts.google.com/specimen/Poppins) (400/500/600) — loaded via Google Fonts in `index.html`, exposed as Tailwind theme token `--font-poppins` in `src/index.css` (class `font-poppins`)
- **Linting:** [Oxlint](https://oxlint.dev/)

## Project Structure
```
Portfolio/
├── .gitignore
├── .oxlintrc.json
├── Context.md
├── index.html              # Main entry point HTML
├── package-lock.json
├── package.json            # Dependencies & scripts
├── README.md
├── vite.config.js          # Vite + React + Tailwind config
├── public/
│   ├── favicon.svg
│   └── icons.svg           # SVG sprite for social/documentation icons
└── src/
    ├── App.css             # Component styles (CSS variables & nesting)
    ├── App.jsx             # Main React component
    ├── index.css           # Global styles (Tailwind import)
    ├── main.jsx            # React entry point (mounts App)
    ├── assets/
    │   ├── hero.png        # Hero background image
    │   ├── react.svg       # React logo
    │   └── vite.svg        # Vite logo
    ├── components/
    │   ├── Nav.jsx
    │   ├── Hero.jsx         # WIP — see Experimental / WIP Components below
    │   ├── About.jsx
    │   ├── Projects.jsx
    │   ├── Credentials.jsx
    │   ├── Experience.jsx
    │   ├── Skills.jsx
    │   ├── Contact.jsx
    │   ├── ProjectCard.jsx
    │   ├── CredentialCard.jsx
    │   └── ExperienceCard.jsx
    └── data/
        ├── projects.js      # placeholder array of project objects
        ├── credentials.js   # placeholder array of credential objects
        └── experience.js    # placeholder array of experience objects
```

## Portfolio Architecture

### Section Order
`Nav` → `Hero` → `About` → `Projects` → `Credentials` → `Experience` → `Skills` → `Contact`

Each main section element includes its matching `id` corresponding to `Nav.jsx` anchors. `App.jsx` imports and renders all eight sections in this fixed order.

### Data-Driven Sections Pattern
`Projects`, `Credentials`, and `Experience` follow a component + data separation pattern:
- Data lives in `src/data/` as exported arrays (`projects.js`, `credentials.js`, `experience.js`)
- Each array item is an object with fixed fields (e.g. project: `{ title, description, stack, link }`)
- The section component (e.g. `Projects.jsx`) imports its array and maps over it, rendering a corresponding Card component (`ProjectCard.jsx`, `CredentialCard.jsx`, `ExperienceCard.jsx`)
- To add new content, only the data array needs a new object — no component changes required

### Static Content Sections
`Hero`, `About`, `Skills`, and `Contact` contain fixed text (not iterable data), so they don't follow the array/data pattern above.

### Experimental / WIP Components
- **Hero.jsx:** Currently a visual lab — testing particle animation (WebGL via `ogl`), typography, and color direction. Not final. Buttons are non-functional placeholders. Expect frequent rewrites here; do not treat current implementation as a pattern to replicate elsewhere.

## Key Implementation Details
- **Responsive Design:** The layout uses CSS media queries and Tailwind CSS to adapt to different screen sizes (e.g., switching from row to column layouts on smaller screens).
- **Modern CSS:** Utilizes CSS variables (e.g., `--accent`, `--border`) and nesting for organized styling.
- **Asset Management:** Uses SVG icons and PNG images integrated directly into the React component tree.

## Development Workflow
- **Development:** `npm run dev` starts the Vite development server.
- **Build:** `npm run build` creates an optimized production build.
- **Linting:** `npm run lint` uses Oxlint for fast linting.
- **Preview:** `npm run preview` allows testing the production build locally.

## Notes
- Real content (actual projects, credentials, experience, about-me text) will be filled in last, once structure and visuals are finalized.
- Placeholder content is intentionally empty/generic — do not invent real content when generating code.