import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import { days, months, bgImage } from "./data";

import Form from "./Form";
import classes from "./App.module.css";

const date = new Date();

function App() {
  const [location, setLocation] = useState("");
  const [alertActive, setAlertActive] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [data, setData] = useState({});
  const [backImg, setBackImg] = useState(
    "https://images.unsplash.com/photo-1454789476662-53eb23ba5907?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=752&q=80"
  );

  useEffect(() => {
    if (navigator.geolocation && !localStorage.getItem("weatherData")) {
      navigator.geolocation.getCurrentPosition((position) => {
        getWeatherLtLn(position.coords.latitude, position.coords.longitude);
      });
    }

    setLocation(() => "");
  }, []);

  useEffect(() => {
    if (localStorage.getItem("weatherData") === null) {
      setData(() => {});
      alert("Turn on device location to see results.");
    }
    if (localStorage.getItem("weatherData") !== null) {
      const weather = JSON.parse(localStorage.getItem("weatherData"));
      setData(() => weather);
      setBackImg(() => bgImage[`${weather["weather"][0].icon}`]);
      setIsloading(() => false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("weatherData", JSON.stringify(data));
  }, [data]);

  const getWeatherLtLn = async (lat, lng) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=39a9a737b07b4b703e3d1cd1e231eedc`
    );

    if (res.ok === false) return;
    setIsloading(() => true);

    const climate = await res.json();

    setData(() => climate);
    setBackImg(() => bgImage[`${climate["weather"][0].icon}`]);
    setIsloading(() => false);
  };

  const getWeatherCity = async (city) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=39a9a737b07b4b703e3d1cd1e231eedc`
    );
    // console.log(res.ok);
    if (res.ok === false) {
      setAlertActive(() => true);

      alert("City not found.");
      setTimeout(() => setAlertActive(() => false), 3000);
      return;
    }
    setIsloading(() => true);

    setLocation(() => "");
    setData(() => {});
    const climate = await res.json();

    setData(() => climate);
    setBackImg(() => bgImage[`${climate["weather"][0].icon}`]);
    setIsloading(() => false);
  };

  const convertToCelcius = (temp) => {
    return Math.floor(+temp) - 273;
  };

  return (
    <div
      className="section"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url("${backImg}")`,
      }}
    >
      <div className={classes.container}>
        {isLoading && (
          <div className={classes["loading-spinner"]}>
            <img
              src="https://forums.synfig.org/uploads/default/original/2X/3/31d749625faa93271be23874d416f9be755b7cb9.gif"
              alt="spinner"
              className={classes["spinner"]}
            />
            <p className={classes["loading-text"]}>Loading...</p>
          </div>
        )}
        {!isLoading && data && (
          <>
            <header className={classes.header}>
              <h2>Weather in</h2>
              <h1>{data.name}</h1>
            </header>

            <Form
              location={location}
              setLocation={setLocation}
              getWeatherCity={getWeatherCity}
            />

            <div className={classes.climate}>
              <div className={classes["climate__details"]}>
                <p className={classes.date}>
                  {days[date.getDay()]}, {date.getDate()}{" "}
                  {months[date.getMonth()]}
                </p>

                <div className={classes["min-max-humid"]}>
                  <p className={classes["min-max"]}>
                    Day {convertToCelcius(data["main"].temp_max)}°&#8593; Night{" "}
                    {convertToCelcius(data["main"].temp_min)}
                    °&#8595;
                  </p>
                  <p className={classes.humidity}>
                    Humidity {data["main"].humidity}%
                  </p>
                </div>

                <div className={classes["climate__icon"]}>
                  <p className={classes.temp}>
                    {convertToCelcius(data["main"].temp)}
                    <span className={classes["temp__unit"]}>°C</span>
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${data["weather"][0].icon}@2x.png`}
                    alt="icon"
                    className={classes["climate__icon--img"]}
                  />
                </div>
                <div className={classes["climate__description"]}>
                  <p className={classes.feels}>
                    Feels like {convertToCelcius(data["main"]["feels_like"])}°C
                  </p>
                  <p className={classes.description}>
                    {data["weather"][0].description}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={
                alertActive === false
                  ? classes.alert
                  : `${classes.alert} ${classes.active}`
              }
            >
              <p>City not found.</p>
            </div>
          </>
        )}
        {!data && !isLoading && (
          <div>
            <p>Error 404 - Page not found.</p>
            <p>Please refresh.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
