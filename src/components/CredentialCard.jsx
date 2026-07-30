import React from "react";

export default function CredentialCard({ credential }) {
  const { title, issuer, date, link } = credential;
  return (
    <div>
      <p>{title}</p>
      <p>{issuer}</p>
      <p>{date}</p>
      <p>{link}</p>
    </div>
  );
}