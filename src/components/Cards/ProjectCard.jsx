import React from "react";

export default function ProjectCard({ project }) {
  const { title, description, stack, link } = project;
  return (
    <div>
      <p>{title}</p>
      <p>{description}</p>
      <p>{stack}</p>
      <p>{link}</p>
    </div>
  );
}