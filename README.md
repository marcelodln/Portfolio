# Personal Portfolio

This is my personal portfolio, built as part of my learning process in web development. **The project is a work in progress**, so some sections still have placeholder content or are unfinished.

## About this project

I'm using this to learn React, Vite, and Tailwind CSS in a hands-on way: understanding how a project is structured, how components and data are separated, and how dependencies are integrated. Some parts of the code (like the hero animation) were generated with the help of an AI assistant; my work in those cases has been identifying components and dependencies, and adjusting visual parameters (color, size, number of elements, position) to understand their effect.

## Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (animations)
- [Oxlint](https://oxlint.dev/) (linting)

## Structure

The project follows a section-based pattern (Nav, Hero, About, Projects, Credentials, Experience, Skills, Contact), where dynamic content (projects, credentials, experience) lives separately in `src/data/` and is rendered through "Card" components.

## Running it locally

```bash
npm install
npm run dev
```

Other available commands:

```bash
npm run build     # production build
npm run lint      # linting with Oxlint
npm run preview   # preview the production build
```

## Current status

- [x] Base structure and anchor navigation
- [x] Section componentization with separated data
- [ ] Final visual direction for all sections
- [ ] Framer Motion animations across the rest of the site
- [ ] Full responsive review (mobile / tablet / desktop)
- [ ] Real content (projects, experience, about) — currently placeholders
- [ ] Deployment to Vercel

## Note

This repository is part of my learning process, not a finished product. If something looks incomplete or inconsistent, it's because it's still under development.