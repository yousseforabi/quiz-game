import React, { useState } from "react";

function About() {
    function About() {
        const teamMembers = [
          {
            name: "Youssef",
            role: "",
            description: "."
          },
          {
            name: "Joab",
            role: "",
            description: ""
          },
          {
            name: "Merv",
            role: "",
            description: ""
          }
        ];
      
        return (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">About Our Team</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <section key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-2">{member.name}</h2>
                  <h3 className="text-lg text-gray-600 mb-4">{member.role}</h3>
                  <p className="text-gray-700">{member.description}</p>
                </section>
              ))}
            </div>
          </div>
        );
    }
}

export default About;
