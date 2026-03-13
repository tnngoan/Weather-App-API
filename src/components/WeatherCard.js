import React, { useState, useEffect, useRef } from "react";
import { toFahrenheit, getIconUrl } from "../services/weatherApi";

export default function WeatherCard({ weather }) {
  const { name, main, weather: conditions } = weather;
  const description = conditions && conditions[0] ? conditions[0].description : "";
  const iconCode = conditions && conditions[0] ? conditions[0].icon : null;

  const [displayTemp, setDisplayTemp] = useState(Math.round(main.temp));
  const [rolling, setRolling] = useState(false);
  const [animClass, setAnimClass] = useState("weather-card-enter");
  const prevName = useRef(name);

  // Temperature counter roll-up
  useEffect(() => {
    const target = Math.round(main.temp);
    if (displayTemp === target) return;

    setRolling(true);
    const step = target > displayTemp ? 1 : -1;
    const interval = setInterval(() => {
      setDisplayTemp((prev) => {
        if (prev === target) {
          clearInterval(interval);
          setRolling(false);
          return prev;
        }
        return prev + step;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [main.temp]); // eslint-disable-line react-hooks/exhaustive-deps

  // Card flip on same-city refresh vs slide-up on new city
  useEffect(() => {
    if (prevName.current === name) {
      setAnimClass("weather-card-flip");
    } else {
      setAnimClass("weather-card-enter");
    }
    prevName.current = name;
    const timer = setTimeout(() => setAnimClass(""), 700);
    return () => clearTimeout(timer);
  }, [name, main.temp]);

  return (
    <div className={`weather-card mb-4 mt-4 ${animClass}`}>
      <h2 className="city-name">{name}</h2>

      {iconCode && (
        <img
          className="weather-icon"
          src={getIconUrl(iconCode)}
          alt={description}
        />
      )}

      <h3 className="temp-display">
        <span className={`temp-value ${rolling ? "rolling" : ""}`}>
          {displayTemp}
        </span>
        °C / {toFahrenheit(main.temp)}°F
      </h3>
      <h4 className="feels-like">Feels like {main.feels_like}°C</h4>
      <h5 className="weather-description">{description}</h5>

      <div className="weather-details">
        <span className="detail-badge">Humidity: {main.humidity}%</span>
        <span className="detail-badge">Min: {main.temp_min}°C</span>
        <span className="detail-badge">Max: {main.temp_max}°C</span>
      </div>
    </div>
  );
}
