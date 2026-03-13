import React from "react";
import { toFahrenheit, getIconUrl } from "../services/weatherApi";

export default function ForecastCard({ forecast }) {
  if (!forecast || !forecast.list) return null;

  // Group by day — pick one entry per day
  const daily = [];
  const seen = new Set();
  for (const entry of forecast.list) {
    const date = entry.dt_txt.split(" ")[0];
    if (!seen.has(date)) {
      seen.add(date);
      daily.push(entry);
    }
  }
  // Skip today, show next 4 days
  const upcoming = daily.slice(1, 5);

  if (upcoming.length === 0) return null;

  return (
    <div className="forecast-container mt-4">
      <h5 className="forecast-title text-center mb-3">Upcoming Forecast</h5>
      <div className="forecast-grid">
        {upcoming.map((entry) => {
          const date = new Date(entry.dt * 1000);
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
          const iconCode = entry.weather[0]?.icon;
          return (
            <div key={entry.dt} className="forecast-day">
              <p className="forecast-day-name">{dayName}</p>
              {iconCode && (
                <img src={getIconUrl(iconCode)} alt="" className="forecast-icon" />
              )}
              <p className="forecast-temp">
                {Math.round(entry.main.temp)}°C / {toFahrenheit(entry.main.temp)}°F
              </p>
              <p className="forecast-desc text-capitalize">
                {entry.weather[0]?.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
