// src/components/MetricCards.jsx
import React from "react";
import "./MetricCards.css";

const MetricCards = ({ metrics }) => {
  return (
    <div className="metrics-container">
      {metrics.map((metric, index) => (
        <div className="metric-card" key={index}>
          <h4>{metric.label}</h4>
          <p>{metric.value}</p>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
