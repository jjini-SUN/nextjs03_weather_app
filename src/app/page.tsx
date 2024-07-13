"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/navbar/navbar";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import ListBox from "@/components/listbox/listbox";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import WeatherIcon from "@/components/weathericon/weathericon";
import ForecastDetail from "@/components/detail/forecast_detail";
import TodayDetail from "@/components/detail/today_detail";

// https://api.openweathermap.org/data/2.5/forecast?q=seoul&appid=e2186212357200ad48e052586bd19879&cnt=56
// https://api.openweathermap.org/data/2.5/forecast?q=seoul&appid=(키)&cnt=56

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

interface WeatherEntry {
  dt: number; // Timestamp of the data forecasted, unix, UTC
  main: {
    temp: number; // Temperature in Kelvin
    feels_like: number; // Temperature feels like in Kelvin
    temp_min: number; // Minimum temperature at the moment of calculation in Kelvin
    temp_max: number; // Maximum temperature at the moment of calculation in Kelvin
    pressure: number; // Atmospheric pressure on the sea level in hPa
    sea_level: number; // Atmospheric pressure on the sea level in hPa
    grnd_level: number; // Atmospheric pressure on the ground level in hPa
    humidity: number; // Humidity, %
    temp_kf: number; // Internal parameter
  };
  weather: {
    id: number; // Weather condition id
    main: string; // Group of weather parameters (Rain, Snow, Extreme etc.)
    description: string; // Weather condition within the group
    icon: string; // Weather icon id
  }[];
  clouds: {
    all: number; // Cloudiness, %
  };
  wind: {
    speed: number; // Wind speed in meter/sec
    deg: number; // Wind direction, degrees (meteorological)
    gust: number; // Wind gust, meter/sec
  };
  visibility: number; // Visibility, meter
  pop: number; // Probability of precipitation
  rain?: {
    "3h": number; // Rain volume for last 3 hours, mm
  };
  sys: {
    pod: string; // Part of the day (d - day, n - night)
  };
  dt_txt: string; // Forecasted date and time, UTC
}

export default function Home() {
  const [place, setPlace] = useState("seoul");
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 있는 지역인지 검사
  const location: string[] = ["", ""];

  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError("날씨 가져오기 에러");
    } finally {
      setIsLoading(false);
    }
    // console.log(result);
    // console.log(data);
  };

  //백그라운드 작업 또는 타이머는 useEffect 에서, 재실행은 place 값이 바뀔때만
  useEffect(() => {
    fetchWeatherData();
  }, [place]);
  // const { isLoading, data } = useQuery<WeatherData>("repoData", async () => {
  //   const { data } = await axios.get(
  //     `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
  //   );
  //   console.log(data);
  //   return data;
  // });
  console.log(data);

  // 0시 데이터만 추출
  const filteredList = data?.list.filter((item) =>
    item.dt_txt.endsWith("00:00:00")
  );

  let todayData = data?.list[1];
  const daysInKorea = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const today = new Date();
  const dayInKorea = daysInKorea[today.getDay()];

  // data.list[0].dt_txt ==> 2024-07-13 03:00:00
  // ==> 2024.07.13 으로 바꿔줄 거임
  function onlyDate(dateTime: string | undefined) {
    if (!dateTime) {
      return "";
    }

    const date = dateTime.split(" ")[0];
    const [year, month, day] = date.split("-");

    return `${year}.${month}.${day}`; // 2024.07.13
  }

  if (isLoading) {
    return (
      <div className={styles.homeLoadingBox}>
        <p className={styles.homeLoadingText}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.homeContainer}>
      홈페이지
      <Navbar place={place} setPlace={setPlace} location={location} />
      <main className={styles.homeMain}>
        {/* 오늘 날씨 */}
        <section className={styles.spaceY4}>
          <div className={styles.spaceY2}>
            <h2 className={styles.todayHeader}>
              <p>{dayInKorea}</p>
              <p>({onlyDate(todayData?.dt_txt)})</p>
            </h2>
            {/* 오늘 날씨 시각화 */}
            <ListBox className="box-style2">
              <div className={styles.flexColumnP4}>
                <span className={styles.fontSize48}>
                  {convertKelvinToCelsius(todayData?.main.temp ?? 298.15)}℃
                </span>
                <p className={styles.nowrapText}>
                  <span>체감온도</span>
                  <span>
                    {convertKelvinToCelsius(
                      todayData?.main.feels_like ?? 298.15
                    )}
                    ℃
                  </span>
                </p>
                <p className={styles.minmaxText}>
                  <span>
                    {convertKelvinToCelsius(todayData?.main.temp_min ?? 298.15)}
                    ℃↓
                  </span>
                  <span>
                    {convertKelvinToCelsius(todayData?.main.temp_max ?? 298.15)}
                    ℃↑
                  </span>
                </p>
              </div>
              {/* 날씨 아이콘 */}
              <div className={styles.todayInfo}>
                {data?.list.map((item, index) => {
                  return (
                    <div className={styles.todayItem} key={index}>
                      <p>{item.dt_txt}</p>
                      {/* 날씨 아이콘 */}
                      <WeatherIcon iconName={item.weather[0].icon} />
                      <p>{convertKelvinToCelsius(item?.main.temp ?? 298.15)}</p>
                    </div>
                  );
                })}
              </div>
            </ListBox>
          </div>

          <div>
            <ListBox className="box-style3">
              <p>{todayData?.weather[0].description}</p>
              <WeatherIcon iconName={todayData?.weather[0].icon ?? ""} />
            </ListBox>
            <ListBox className="box-style4">
              <TodayDetail
                visibility={todayData?.visibility}
                humidity={`${todayData?.main.humidity}`}
                windSpeed={todayData?.wind.speed}
                airPressure={todayData?.main.pressure}
                sunrise={data?.city.sunrise}
                sunset={data?.city.sunset}
              />
            </ListBox>
          </div>
        </section>

        {/* 일기예보(주간) */}
        <section className={styles.forecastSectionFlex}>
          <strong>일기예보 (자정 기준)</strong>
          {filteredList &&
            filteredList.map((item, index) => {
              return <ForecastDetail key={index} />;
            })}
        </section>
      </main>
    </div>
  );
}

// favicon.ico 삭제 -> icon.png 추가 (app 폴더)
// npm install react-icons --save
// npm install react-query axios classnames
// npm install date-fns@2.30.0
