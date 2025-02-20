import { DateTime } from "luxon";

const API_KEY = "9f28b9baf81fbbc23e886d9e7d92829c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&exclude=current,minutely,hourly,alerts&appid=1fa9ff4126d95b8db54f3897a208e91c&units=metric
// https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&exclude=current,minutely,hourly,alerts&appid=9f28b9baf81fbbc23e886d9e7d92829c&units=metric

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url).then((res) => res.json());
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
    timezone
  };
};

const formatForecastWeather = (secs, offset, data) => {
  
  const hourly = data
  .filter((f) => f.dt > secs)
  .slice(0, 5).map((d) => {
    return {
      title: formatToLocalTime(d.dt, offset, "hh:mm a"),
      temp: d.main.temp,
      icon: d.weather[0].icon,
      date: d.dt_txt
    };
  });
   const daily = data
   .filter((f) => f.dt_txt.slice(-8) === "00:00:00")
   .map((f) => ({
    temp: f.main.temp,
    title: formatToLocalTime(f.dt, offset, "ccc"),
    icon: f.weather[0].icon,
    date: f.dt_txt
   }));
  return { hourly, daily };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  const { lat, lon, dt, timezone } = formattedCurrentWeather;

  const formattedForecastWeather = await getWeatherData("forecast", {
    lat,
    lon,
    exclude: "current,minutely,alerts",
    units: searchParams.units,
  }).then((d) => formatForecastWeather(dt, timezone, d.list));

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs + zone, {zone: "utc"}).toFormat(format);

//DateTime.fromSeconds(secs).setZone(zone).toFormat(format)
//DateTime.fromSeconds(secs + zone, {zone: "utc"}).toFormat(format)

const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode };
