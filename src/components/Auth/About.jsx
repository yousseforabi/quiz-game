import React from "react";
import "../../index.css";

function About() {
  const teamMembers = [
    {
      name: "Youssef Orabi",
      role: "Frontend Developer",
      description:
        "Youssef is a passionate developer with expertise in React and frontend technologies.",
    },
    {
      name: "Jacob Reevcrona",
      role: "Game Logic & API Integration",
      description:
        "Jacob worked on the game page, including the game logic, API integration, and visual design.",
    },
    {
      name: "Merve Erez",
      role: "Backend Developer",
      description:
        "Merv is responsible for building and maintaining scalable backend systems.",
    },
  ];

  return (
    <div className="about-container">
      <h1 className="about-title">About Our Team</h1>
      <div className="about-grid">
        {teamMembers.map((member, index) => (
          <section key={index} className="team-card">
            <h2 className="team-name">{member.name}</h2>
            <h3 className="team-role">{member.role}</h3>
            <p className="team-description">{member.description}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

export default About;
