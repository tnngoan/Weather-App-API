import React, { useCallback } from "react";

const CITIES = [
  "Moscow", "London", "Paris", "Ha noi", "Sydney",
  "Beijing", "Miami", "Tokyo", "New York", "Vancouver", "San Francisco",
];

export default function CityButtons({ onCitySelect, activeCity }) {
  const handleClick = useCallback((e, city) => {
    // Ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    onCitySelect(city);
  }, [onCitySelect]);

  return (
    <div className="city-buttons-container">
      {CITIES.map((city) => (
        <button
          key={city}
          onClick={(e) => handleClick(e, city)}
          className={`city-btn ${activeCity === city ? "active" : ""}`}
        >
          {city === "Ha noi" ? "Hanoi" : city}
        </button>
      ))}
    </div>
  );
}
