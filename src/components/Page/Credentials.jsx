import React from "react";
import { credentials } from "../../data/credentials.js";
import CredentialCard from "../Cards/CredentialCard.jsx";

export default function Credentials() {
  return (
    <section id="credentials">
      {credentials.map((cred, idx) => (
        <CredentialCard key={idx} credential={cred} />
      ))}
    </section>
  );
}