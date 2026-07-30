# Project Context: Portfolio

## Overview
This project is a modern, responsive landing page built using **React** and **Vite**. It serves as a boilerplate or a starting point for web applications, featuring a clean design with interactive elements.

## Tech Stack
- **Framework:** [React](https://react.dev/) (v19.2.7)
- **Build Tool:** [Vite](https://vitejs.dev/) (v8.1.0)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4.3.1) via `@tailwindcss/vite`
- **Animations:** [Framer Motion](https://www.framer.com/motion/) (v12.42.0)
- **Linting:** [Oxlint](https://oxlint.dev/)

## Project Structure
- `index.html`: The main entry point for the application.
- `package.json`: Defines project dependencies, scripts, and metadata.
- `src/`: Contains the application source code.
  - `main.jsx`: The React entry point that mounts the `App` component to the DOM.
  - `App.jsx`: The main component containing the landing page layout and logic.
  - `App.css`: Component-specific styles (using CSS nesting and variables).
  - `index.css`: Global styles, currently importing Tailwind CSS.
  - `assets/`: Contains static assets like images and icons.
- `public/`: Contains static files like `favicon.svg` and `icons.svg`.

## Key Features & Implementation Details
- **Responsive Design:** The layout uses CSS media queries and Tailwind CSS to adapt to different screen sizes (e.g., switching from row to column layouts on smaller screens).
- **Modern CSS:** Utilizes CSS variables (e.g., `--accent`, `--border`) and nesting for organized styling.
- **Interactive Elements:** Includes a counter component in `App.jsx` to demonstrate state management with `useState`.
- **Asset Management:** Uses SVG icons and PNG images integrated directly into the React component tree.

## Development Workflow
- **Development:** `npm run dev` starts the Vite development server.
- **Build:** `npm run build` creates an optimized production build.
- **Linting:** `npm run lint` uses Oxlint for fast linting.
- **Preview:** `npm run preview` allows testing the production build locally.