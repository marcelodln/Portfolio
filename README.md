# Portafolio Personal

Este es mi portafolio personal, construido como parte de mi proceso de aprendizaje en desarrollo web. **El proyecto está en construcción**, así que algunas secciones aún tienen contenido de prueba o están sin terminar.

## Sobre este proyecto

Lo estoy usando para aprender React, Vite y Tailwind CSS de forma práctica: entender cómo se estructura un proyecto, cómo se separan componentes y datos, y cómo se integran dependencias. Algunas partes del código (como las animaciones del hero) fueron generadas con apoyo de un asistente de IA; mi trabajo en esos casos ha sido identificar componentes y dependencias, e ir ajustando parámetros visuales (color, tamaño, cantidad de elementos, posición) para entender su efecto.

## Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (animaciones)
- [Oxlint](https://oxlint.dev/) (linting)

## Estructura

El proyecto sigue un patrón de secciones (Nav, Hero, About, Projects, Credentials, Experience, Skills, Contact), donde el contenido dinámico (proyectos, credenciales, experiencia) vive separado en `src/data/` y se renderiza mediante componentes tipo "Card".

## Cómo correrlo localmente

```bash
npm install
npm run dev
```

Otros comandos disponibles:

```bash
npm run build     # build de producción
npm run lint      # linting con Oxlint
npm run preview   # previsualizar el build de producción
```

## Estado actual

- [x] Estructura base y navegación por anclas
- [x] Componentización de secciones con datos separados
- [ ] Dirección visual definitiva para todas las secciones
- [ ] Animaciones con Framer Motion en el resto del sitio
- [ ] Revisión responsiva completa (móvil / tablet / desktop)
- [ ] Contenido real (proyectos, experiencia, about) — actualmente hay placeholders
- [ ] Despliegue en Vercel

## Nota

Este repositorio es parte de mi proceso de aprendizaje, no un producto terminado. Si algo se ve incompleto o inconsistente, es porque todavía está en desarrollo.