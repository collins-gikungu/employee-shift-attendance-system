// src/components/WelcomeCard.jsx
import React from "react";
import "./WelcomeCard.css";

const WelcomeCard = ({ userName }) => {
  return (
    <div className="welcome-card">
      <h2>Welcome back, {userName}!</h2>
      <p>Here’s your overview for the day at Maendeleo Care Hospital.</p>
    </div>
  );
};

export default WelcomeCard;
