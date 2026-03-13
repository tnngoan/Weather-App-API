import React, { useState, useEffect, useCallback } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import WeatherCard from "./components/WeatherCard";
import CityButtons from "./components/CityButtons";
import ForecastCard from "./components/ForecastCard";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";

import {
  fetchWeatherByCoords,
  fetchWeatherByCity,
  fetchForecastByCity,
  fetchForecastByCoords,
  cacheWeather,
  getCachedWeather,
  getWeatherBackground,
} from "./services/weatherApi";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCity, setActiveCity] = useState(null);
  const [bgClass, setBgClass] = useState("bg-default");

  const loadWeatherByCoords = useCallback(async (lon, lat) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherByCoords(lon, lat),
        fetchForecastByCoords(lon, lat),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      setActiveCity(null);
      setBgClass(getWeatherBackground(weatherData));
      cacheWeather({ weather: weatherData, forecast: forecastData });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWeatherByCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeatherByCity(city),
        fetchForecastByCity(city),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      setActiveCity(city);
      setBgClass(getWeatherBackground(weatherData));
      cacheWeather({ weather: weatherData, forecast: forecastData });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Dynamic background
  useEffect(() => {
    document.body.className = bgClass;
  }, [bgClass]);

  useEffect(() => {
    // Try cache first for instant display
    const cached = getCachedWeather();
    if (cached) {
      setWeather(cached.weather);
      setForecast(cached.forecast);
      setLoading(false);
    }

    // Then fetch fresh data via geolocation
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => loadWeatherByCoords(pos.coords.longitude, pos.coords.latitude),
      () => {
        if (!cached) {
          setError("Unable to retrieve your location. Search for a city instead.");
          setLoading(false);
        }
      }
    );
  }, [loadWeatherByCoords]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      loadWeatherByCity(trimmed);
      setSearchQuery("");
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeatherByCoords(pos.coords.longitude, pos.coords.latitude),
        () => setError("Unable to retrieve your location.")
      );
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="app-title text-center">
        An's wholesome Weather
      </h1>

      <CityButtons onCitySelect={loadWeatherByCity} activeCity={activeCity} />

      <div className="search-container">
        <Form onSubmit={handleSearch}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search any city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputGroup.Append>
              <Button type="submit" variant="success">
                Search
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      </div>

      <div className="content-container">
        {loading && !weather && <LoadingSpinner />}
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}
        {weather && <WeatherCard weather={weather} />}
        {forecast && <ForecastCard forecast={forecast} />}
      </div>
    </div>
  );
}
