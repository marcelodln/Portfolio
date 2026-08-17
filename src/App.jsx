import React from "react";
import Nav from "./components/Page/Nav.jsx";
import Hero from "./components/Page/Hero.jsx";
import About from "./components/Page/About.jsx";
import Projects from "./components/Page/Projects.jsx";
import Credentials from "./components/Page/Credentials.jsx";
import Experience from "./components/Page/Experience.jsx";
import Skills from "./components/Page/Skills.jsx";
import Contact from "./components/Page/Contact.jsx";

// ...el resto del archivo queda igual, solo cambian los imports de arriba

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Credentials />
      <Experience />
      <Skills />
      <Contact />
    </>
  );
}
