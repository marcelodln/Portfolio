import React from "react";
import { projects } from "../data/projects.js";
import ProjectCard from "./ProjectCard.jsx";

export default function Projects() {
  return (
    <section id="projects">
      {projects.map((project, idx) => (
        <ProjectCard key={idx} project={project} />
      ))}
    </section>
  );
}