import React from "react";
import {
  UilTemperature,
  UilTear,
  UilWind,
} from "@iconscout/react-unicons";
import { formatToLocalTime, iconUrlFromCode } from "../services/weatherService";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

function TemperatureAndDetails({
  weather: {
    details,
    icon,
    temp,
    temp_min,
    temp_max,
    sunrise,
    sunset,
    speed,
    humidity,
    feels_like,
    timezone,
  },
  units
}) {
  const verticalDetails = [
    {
      id: 1,
      Icon: UilTemperature,
      title: 'Feels Like:',
      value: `${feels_like.toFixed()}°`
    },
    {
      id: 2,
      Icon: UilTear,
      title: 'Humidity:',
      value: `${humidity.toFixed()}%`
    },
    {
      id: 3,
      Icon: UilWind,
      title: 'Wind:',
      value: `${speed.toFixed()} ${units === 'metric' ? 'km/hr' : 'm/s'}`
    }
  ];
  const horizontalDetails = [
    {
      id: 1,
      value: formatToLocalTime(sunrise, timezone, "hh:mm a"),
      title: 'Rise:',
      Icon: GiSunrise,
    },
    {
      id: 2,
      value: formatToLocalTime(sunset, timezone, "hh:mm a"),
      title: 'Set:',
      Icon: GiSunset,
    },
    {
      id: 3,
      value: `${temp_max.toFixed()}°`,
      title: 'High:',
      Icon: MdKeyboardArrowUp,
    },
    {
      id: 4,
      value: `${temp_min.toFixed()}°`,
      title: 'Low:',
      Icon: MdKeyboardArrowDown,
    }
  ]
  return (
    <div>
      <div className="flex items-center justify-center py-6 text-3xl text-cyan-300">
        <p>{details}</p>
      </div>

      <div className="flex flex-row items-center justify-between text-white py-3">
        <img src={iconUrlFromCode(icon)} alt="" className="w-20" />
        <p className="text-5xl">{`${temp.toFixed()}°`}</p>
        <div className="flex flex-col space-y-2">
          {verticalDetails.map(({ id, title, Icon, value }) => (
            <div
              key={id}
              className="flex font-light text-sm items-center justify-center"
            >
              <Icon size={18} className="mr-1" />
              {title}
              <span className="font-medium ml-1">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row items-center justify-center space-x-5 text-white text-sm py-3">
        {horizontalDetails.map(({ id, title, value, Icon }) => (
          <div key={id} className="flex flex-row items-center">
            <Icon size={30}/>
            <p className="font-light ml-1">
              {`${title} `}
              <span className="font-medium ml-1">
                {value}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemperatureAndDetails;
