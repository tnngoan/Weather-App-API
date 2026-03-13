import React, { useState, useEffect } from "react";

const WEATHER_ICONS = ["\u2600\uFE0F", "\u26C5", "\uD83C\uDF27\uFE0F", "\u2744\uFE0F", "\u26C8\uFE0F"];

export default function LoadingSpinner() {
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % WEATHER_ICONS.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <div className="weather-spinner">
        <div className="spinner-orbit"></div>
        <span className="weather-spinner-icon">{WEATHER_ICONS[iconIndex]}</span>
      </div>
      <p className="loading-text">Fetching weather data...</p>
    </div>
  );
}
