const apiKey = process.env.REACT_APP_APIKEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function fetchWeatherByCoords(lon, lat) {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch weather data.");
  return response.json();
}

export async function fetchWeatherByCity(city) {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not find weather for "${city}".`);
  return response.json();
}

export async function fetchForecastByCity(city) {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&cnt=40`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch forecast data.");
  return response.json();
}

export async function fetchForecastByCoords(lon, lat) {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=40`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch forecast data.");
  return response.json();
}

export function toFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

export function getIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function cacheWeather(data) {
  try {
    localStorage.setItem("cachedWeather", JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    // localStorage unavailable
  }
}

export function getCachedWeather(maxAgeMs = 10 * 60 * 1000) {
  try {
    const cached = JSON.parse(localStorage.getItem("cachedWeather"));
    if (cached && Date.now() - cached.timestamp < maxAgeMs) {
      return cached.data;
    }
  } catch (e) {
    // localStorage unavailable or corrupt
  }
  return null;
}

export function getWeatherBackground(weather) {
  if (!weather || !weather.weather || !weather.weather[0]) return "bg-default";

  const main = weather.weather[0].main.toLowerCase();
  const icon = weather.weather[0].icon || "";
  const isNight = icon.endsWith("n");
  const temp = weather.main?.temp;

  if (main === "thunderstorm") return "bg-thunderstorm";
  if (main === "rain" || main === "drizzle") return "bg-rain";
  if (main === "snow") return "bg-snow";
  if (main === "mist" || main === "fog" || main === "haze" || main === "smoke") return "bg-mist";
  if (main === "clouds") return "bg-clouds";
  if (main === "clear" && isNight) return "bg-clear-night";
  if (main === "clear") return "bg-clear-day";
  if (temp !== undefined && temp < 5) return "bg-cold";

  return "bg-default";
}
