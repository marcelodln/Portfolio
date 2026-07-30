import React from "react";

export default function ExperienceCard({ experience }) {
  const { role, company, period, description } = experience;
  return (
    <div>
      <p>{role}</p>
      <p>{company}</p>
      <p>{period}</p>
      <p>{description}</p>
    </div>
  );
}