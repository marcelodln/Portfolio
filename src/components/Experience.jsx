import React from "react";
import { experience } from "../data/experience.js";
import ExperienceCard from "./ExperienceCard.jsx";

export default function Experience() {
  return (
    <section id="experience">
      {experience.map((exp, idx) => (
        <ExperienceCard key={idx} experience={exp} />
      ))}
    </section>
  );
}