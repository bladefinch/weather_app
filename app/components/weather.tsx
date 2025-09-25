'use client';
import { getWeather } from "@/lib/custom-api/getWeather";
// import { getCitylocation } from "@/lib/open-meteo/geocoding/fetchGeocoding";
import { getCityList } from "@/lib/open-meteo/geocoding/fetchGeocoding";
import weatherCodeMap from "@/lib/open-meteo/weather-forecast/weatherUtils";

import {use, useEffect, useRef, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { setChoosenCity } from "@/lib/features/chooseCity/chooseCity.slice";

import { WeekWeather } from "../types/types";
import { DailyWeather } from "../types/types";
import { HourlyWeather } from "../types/types";
import { CityList } from "../types/types";
import { City } from "../types/types";

export default function Weather() {

  const [weather, setWeather] = useState<WeekWeather>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openSearch, setOpenSearch] = useState(false);

  const dropdown = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdown.current && !dropdown.current.contains(event.target as Node)) {
        setOpenSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [])
  
  const [city, setCity] = useState<string>(""); 
  const [cityInput, setCityInput] = useState<string>("");
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityInput(e.target.value);
  };

  const [cityList, setCityList] = useState<CityList>([]);
  const [cityListLoading, setCityListLoading] = useState(true);
  const [cityListError, setCityListError] = useState<string | null>(null);

  useEffect(() => {
    if (city.length < 2) return;

    setCityListLoading(true);
    getCityList(city).then((data) => setCityList(data)).catch((err) => setCityListError(err)).finally(() => setCityListLoading(false));
  }, [city]);

  const choosenCity = useSelector((state: RootState) => state.choosenCity);

  const dispatch = useDispatch();
  const handleChooseCity = (name: string, latitude: number, longitude: number, country: string) => {
    dispatch(setChoosenCity({name, latitude, longitude, country})); 
  }

  const units = useSelector((state: RootState) => state.weatherUnitsSet);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getWeather(choosenCity.latitude, choosenCity.longitude, units.temperatureUnit, units.windSpeedUnit, units.precipitationUnit).then((data) => setWeather(data)).catch((err) => setError(err)).finally(() => setLoading(false));
  }, [choosenCity, units]);

  const [currentHour, setCurrentHour] = useState<number | null>(null);

  useEffect(() => {
    if (weather && weather.length > 0 && weather[1].timezonediff !== undefined) {
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
      const cityTime = new Date(utcTime + weather[1].timezonediff * 1000);
      setCurrentHour(cityTime.getHours());
    }
    
  }, [weather])

  console.log(currentHour);

  const [hourlyActive, setHourlyActive] = useState<boolean>(false);
  const [choosenWeekday, setChoosenWeekday] = useState<{dayFull: string; date: string} | null>(null);

  useEffect(() => {
    if (weather && weather.length > 0) {
      setChoosenWeekday({
        dayFull: weather[1].dayFull,
        date: weather[1].date
      });
    }
  }, [weather])

  const [choosenWeekdayIndex, setChoosenWeekdayIndex] = useState<number>(0);

  useEffect(() => {
    if (choosenWeekday && weather) {
      const index = weather.findIndex((day: DailyWeather) => day.dayFull === choosenWeekday.dayFull && day.date === choosenWeekday.date);
      setChoosenWeekdayIndex(index);
    }
  }, [choosenWeekday])

  if (loading || currentHour === null) return(
    <div>
      <h1 className="text-[52px] mt-[66px] max-[426px]:mt-[50px]">How&apos;s the sky looking today?</h1>
      <div className="flex max-[426px]:flex-col gap-4 max-w-[655px] justify-items-center mx-auto mt-[65px] max-[426px]:mt-[52px] relative">
        <div className="relative w-[100%]">
          <img className="absolute top-[16px] left-[24px]" src="/svg/icon-search.svg" />
          <input className="bg-[hsl(243,27%,20%)] p-[17px] pl-[60px] rounded-[10px] w-[100%] placeholder:text-[20px] z-10" type="text" name="" id="" placeholder="Search for a place..." />
        </div>
        <button className="bg-[hsl(233,67%,56%)] p-[17px] rounded-[10px] ml-4 w-[133px] max-[426px]:w-[100%] tracking-[0.05em]">Search</button>
      </div>
      <div className="mt-[48px] max-[426px]:mt-[32px] w-[100%]">
        <div className="flex gap-8 max-[1150px]:flex-col">
          <div className="w-[67.5%] max-[1150px]:w-[100%]">
            <div className="w-[100%] h-[285px] bg-[hsl(243,27%,20%)] p-6 rounded-[20px] 
            max-[769px]:flex-col max-[769px]:py-[40px] max-[769px]:px-[10px] relative">
              <div className="flex flex-col items-center gap-2 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <img className="w-[50px] animate-spin" src="/svg/icon-loading.svg" />
                <p className="font-[300]">Loading...</p>
              </div>
            </div>
            <div className="grid grid-cols-4 max-[769px]:grid-cols-2 gap-[25px] mt-[32px] max-[426px]:mt-[20px] max-[426px]:gap-[15px]">
              <div className="text-left min-h-[120px] bg-[hsl(243,27%,20%)] p-5 pb-4 rounded-[10px] border border-[hsl(243,27%,30%)]">
                <div className="relative h-[100%]">
                  <p className="font-[300] tracking-[0.025em] absolute top-0 left-0">Feels Like</p>
                  <p className="text-[32px] font-[300] tracking-[0.01em] absolute bottom-0 left-0">&ndash;</p>
                </div>
              </div>
              <div className="text-left min-h-[120px] bg-[hsl(243,27%,20%)] p-5 pb-4 rounded-[10px] border border-[hsl(243,27%,30%)]">
                <div className="relative h-[100%]">
                  <p className="font-[300] tracking-[0.025em] absolute top-0 left-0">Humidity</p>
                  <p className="text-[32px] font-[300] tracking-[0.01em] absolute bottom-0 left-0">&ndash;</p>
                </div>
              </div>
              <div className="text-left min-h-[120px] bg-[hsl(243,27%,20%)] p-5 pb-4 rounded-[10px] border border-[hsl(243,27%,30%)]">
                <div className="relative h-[100%]">
                  <p className="font-[300] tracking-[0.025em] absolute top-0 left-0">Wind</p>
                  <p className="text-[32px] font-[300] tracking-[0.01em] absolute bottom-0 left-0">&ndash;</p>
                </div>
              </div>
              <div className="text-left min-h-[120px] bg-[hsl(243,27%,20%)] p-5 pb-4 rounded-[10px] border border-[hsl(243,27%,30%)]">
                <div className="relative h-[100%]">
                  <p className="font-[300] tracking-[0.025em] absolute top-0 left-0">Precipitation</p>
                  <p className="text-[32px] font-[300] tracking-[0.01em] absolute bottom-0 left-0">&ndash;</p>
                </div>
              </div>
            </div>
            <p className="text-[20px] mt-[48px] max-[426px]:mt-[30px] tracking-[0.01em] text-left">Daily forecast</p>
            <div className="grid grid-cols-7 max-[769px]:grid-cols-4 max-[480px]:grid-cols-3 gap-[15px] mt-[20px]">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="min-h-[165px] bg-[hsl(243,27%,20%)] px-2.5 py-4 rounded-[10px] border border-[hsl(243,27%,30%)]"></div>
              ))}
            </div>
          </div>
          <div className="bg-[hsl(243,27%,20%)] w-[32.5%] max-[1150px]:w-[100%] h-[692px] rounded-[20px] flex flex-col gap-[16px]">
            <div className="flex items-center justify-between p-6 max-[426px]:px-3 pb-0 relative">
              <p className="text-[20px] tracking-[0.025em]">Hourly forecast</p>
              <button className="flex items-center justify-between bg-[hsl(243,27%,30%)] py-2.5 px-4 gap-[12px] rounded-[10px] ">
                <p className="text-[16px] font-[300]">&ndash;</p>
                <img src="/svg/icon-dropdown.svg" />
              </button>
            </div>
            <div className="grid gap-[16px] pr-5 pl-6 max-[426px]:pr-2 max-[426px]:pl-3 mb-5 overflow-y-auto custom-scroll">
              {Array.from({ length: 24 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between bg-[hsl(243,27%,24%)] border border-[hsl(243,27%,30%)] h-[60px] p-3 pr-4 rounded-[10px]"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  if (error) return (
    <div className="h-[100vh] px-[10px]">
      <div className="flex flex-col items-center mt-[110px] text-[16px]">
        <img className="w-[42px]" src="/svg/icon-error.svg" alt="error" />
        <h1 className="text-[52px] mt-[30px]">Something went wrong</h1>
        <h2 className="text-[20px] mt-[25px] mb-[25px] max-w-[550px]">We couldn&apos;t connect to the server (API error). Please try again in a few moments.</h2>
        <button onClick={() => window.location.reload()} className="flex items-center justify-center gap-[10px] font-[300] bg-[hsl(243,27%,20%)] py-3 w-[100px] mx-auto rounded-[8px] cursor-pointer">
          <img src="/svg/icon-retry.svg" alt="" />
          <p>Retry</p>
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-[52px] mt-[66px] max-[426px]:mt-[50px]">How&apos;s the sky looking today?</h1>
      <div  className="flex max-[426px]:flex-col gap-4 max-w-[655px] justify-items-center mx-auto mt-[65px] max-[426px]:mt-[52px] relative">
        <div className="relative w-[100%]">
          <img className="absolute top-[16px] left-[24px]" src="/svg/icon-search.svg" />
          <input onChange={handleCityChange} onFocus={() => setOpenSearch(true)} onKeyDown={(e) => e.key === "Enter" && [setOpenSearch(true), setCity(cityInput)]} className="bg-[hsl(243,27%,20%)] p-[17px] pl-[60px] rounded-[10px] w-[100%] placeholder:text-[20px] z-10" type="text" name="" id="" placeholder="Search for a place..." />
          <div className={`absolute top-[65px] bg-[hsl(243,27%,20%)] text-[16px] p-[8px] rounded-[10px] w-[100%] grid gap-1.5 z-10 ${openSearch && city? "block" : "hidden"}`}>
            {city.length < 2 ? (
              <div className="text-[16px] font-[300] py-[10px] px-[8px] rounded-[8px]">Please, enter at least 2 characters</div>
            ) : cityListLoading ? (
              <div className="text-[16px] font-[300] py-[10px] px-[8px] rounded-[8px] flex items-center gap-2.5">
                <img className="animate-spin" src="/svg/icon-loading.svg" />
                <p className="tracking-[0.015em]">Search in progress</p>
              </div>
            ) : !cityList ? (
              <div className="text-[16px] font-[300] py-[10px] px-[8px] rounded-[8px]">No search results found!</div>
            ) : (
              cityList?.map((city: City, index: number) => index >= 10 ? null : (
              <button key={index} onMouseDown={() => [handleChooseCity(city.name, city.latitude, city.longitude, city.country), setOpenSearch(false)]} 
                onKeyDown={(e) => e.key === "Enter" && [handleChooseCity(city.name, city.latitude, city.longitude, city.country), setOpenSearch(false)]} className={`font-[300] text-left py-[10px] px-[8px] rounded-[8px] ${city.latitude === choosenCity.latitude && city.longitude === choosenCity.longitude ? "bg-[hsl(243,27%,24%)] border border-[hsl(243,27%,30%)]" : ""}`} >{city.name}, {city.country}</button>))
            )}
          </div>
        </div>
        <button onClick={() => {setOpenSearch(true), setCity(cityInput)}} className="bg-[hsl(233,67%,56%)] p-[17px] rounded-[10px] ml-4 w-[133px] max-[426px]:w-[100%] tracking-[0.05em]">Search</button>
      </div>
      <div className="mt-[48px] max-[426px]:mt-[32px] w-[100%]">
        <div className="flex gap-8 max-[1150px]:flex-col">
          <div className="w-[67.5%] max-[1150px]:w-[100%]">
            <div className="flex items-center w-[100%] h-[285px] justify-between bg-[url(/svg/bg-today-large.svg)] bg-cover bg-center p-6 rounded-[20px] 
            max-[769px]:flex-col max-[769px]:py-[40px] max-[769px]:px-[10px]">
              <div className="text-left">
                <p className="text-[28px] font-[600] mb-[12px] tracking-[0.01em]">{choosenCity.name}, {choosenCity.country}</p>
                <p className="font-[300] tracking-[0.015em]">{weather[1].date}</p>
              </div>
              <div className="flex items-center">
                <img src={weatherCodeMap(weather[1].hours[currentHour].weather_code)?.icon} alt={weatherCodeMap(weather[1].hours[currentHour].weather_code)?.label} className="w-[120px] mr-[20px]"/>
                <p className="text-[96px] italic font-[600] tracking-[-0.02em]">{weather[1].hours[currentHour].temperature_2m}°</p>
              </div>
            </div>
            <div className="grid grid-cols-4 max-[769px]:grid-cols-2 gap-[25px] mt-[32px] max-[426px]:mt-[20px] max-[426px]:gap-[15px]">
              <div className="text-left min-h-[120px] bg-[hsl(243,27%,20%)] p-5 pb-4 rounded-[10px] border border-[hsl(243,27%,30%)]">
                <div className="relative h-[100%]">
                  <p className="font-[300] tracking-[0.025em] absolute top-0 left-0">Feels Like</p>
                  <p className="text-[32px] font-[300] tracking-[0.01em] absolute bottom-0 left-0">{weather[1].hours[currentHour].apparent_temperature}°</p>
                </div>
              </div>
              <div className="text-left min-h-[120px] bg-[hsl(243,27%,20%)] p-5 pb-4 rounded-[10px] border border-[hsl(243,27%,30%)]">
                <div className="relative h-[100%]">
                  <p className="font-[300] tracking-[0.025em] absolute top-0 left-0">Humidity</p>
                  <p className="text-[32px] font-[300] tracking-[0.01em] absolute bottom-0 left-0">{weather[1].hours[currentHour].relative_humidity_2m}%</p>
                </div>
              </div>
              <div className="text-left min-h-[120px] bg-[hsl(243,27%,20%)] p-5 pb-4 rounded-[10px] border border-[hsl(243,27%,30%)]">
                <div className="relative h-[100%]">
                  <p className="font-[300] tracking-[0.025em] absolute top-0 left-0">Wind</p>
                  {units.windSpeedUnit === 'km/h' ? (
                    <p className="text-[32px] font-[300] tracking-[0.01em] absolute bottom-0 left-0">{weather[1].hours[currentHour].wind_speed_10m} km/h</p>
                  ) : (
                    <p className="text-[32px] font-[300] tracking-[0.01em] absolute bottom-0 left-0">{weather[1].hours[currentHour].wind_speed_10m} mph</p>
                  )}
                </div>
              </div>
              <div className="text-left min-h-[120px] bg-[hsl(243,27%,20%)] p-5 pb-4 rounded-[10px] border border-[hsl(243,27%,30%)]">
                <div className="relative h-[100%]">
                  <p className="font-[300] tracking-[0.025em] absolute top-0 left-0">Precipitation</p>
                  {units.precipitationUnit === 'mm' ? (
                    <p className="text-[32px] font-[300] tracking-[0.01em] absolute bottom-0 left-0">{weather[1].hours[currentHour].precipitation} mm</p>
                  ) : (
                    <p className="text-[32px] font-[300] tracking-[0.01em] absolute bottom-0 left-0">{weather[1].hours[currentHour].precipitation} in</p>
                  )}
                </div>
              </div>
            </div>
            <p className="text-[20px] mt-[48px] max-[426px]:mt-[30px] tracking-[0.01em] text-left">Daily forecast</p>
            <div className="grid grid-cols-7 max-[769px]:grid-cols-4 max-[480px]:grid-cols-3 gap-[15px] mt-[20px]">
              {weather.map((item: DailyWeather , index: number) => index === 0 ? null : (
                <div key={index} className="min-h-[165px] bg-[hsl(243,27%,20%)] px-2.5 py-4 rounded-[10px] border border-[hsl(243,27%,30%)]">
                  <div className="relative h-[100%]">
                    <p className="font-[300] tracking-[0.025em] absolute top-0 left-0 w-[100%]">{item.day}</p>
                    <img src={weatherCodeMap(item.dayweather)?.icon} alt={weatherCodeMap(item.dayweather)?.label} className="w-[60px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"/>
                    <div className="text-[16px] font-[300] flex justify-between absolute bottom-0 left-0 w-[100%]">
                      <p>{item.maxtemp}°</p>
                      <p className="text-[hsl(240,6%,70%)]">{item.mintemp}°</p>
                    </div>
                  </div>
              </div>
              ))}
            </div>
          </div>
          <div className="bg-[hsl(243,27%,20%)] w-[32.5%] max-[1150px]:w-[100%] h-[692px] rounded-[20px] flex flex-col gap-[16px]">
            <div className="flex items-center justify-between p-6 max-[426px]:px-3 pb-0 relative">
              <p className="text-[20px] tracking-[0.025em]">Hourly forecast</p>
              <button onClick={() => setHourlyActive(!hourlyActive)} className="flex items-center justify-between bg-[hsl(243,27%,30%)] py-2.5 px-4 gap-[12px] rounded-[10px] ">
                <p className="text-[16px] font-[300]">{choosenWeekday?.dayFull}</p>
                <img src="/svg/icon-dropdown.svg" />
              </button>
              <div className={`absolute grid gap-[5px] top-[70px] right-[24px] w-[215px] text-[16px] bg-[hsl(243,27%,20%)] rounded-[15px] p-2 border border-[hsl(243,27%,30%)] shadow-[0px_0px_10px_10px_rgba(0,0,0,0.25)] z-30 ${hourlyActive ? 'block' : 'hidden'}`}>
                {weather.map((item: DailyWeather , index: number) => index === 0 ? null : (
                  <button onClick={() => (setChoosenWeekday({dayFull: item.dayFull, date: item.date}), setHourlyActive(false))} key={index} className={`w-[100%] rounded-[10px] py-2.5 px-2 text-left font-[300] tracking-[0.03em] ${choosenWeekday?.date === item.date ? 'bg-[hsl(243,27%,24%)]' : ''}`}>{item.dayFull}</button>
                ))}
              </div>
            </div>
            <div className="grid gap-[16px] pr-5 pl-6 max-[426px]:pr-2 max-[426px]:pl-3 mb-5 overflow-y-auto custom-scroll">
              {weather[choosenWeekdayIndex].hours.map((item: HourlyWeather , index: number) => (
                <div key={index} className="flex items-center justify-between bg-[hsl(243,27%,24%)] border border-[hsl(243,27%,30%)] h-[60px] p-3 pr-4 rounded-[10px]">
                  <div className="flex items-center gap-[10px]">
                    <img src={weatherCodeMap(item.weather_code)?.icon} alt={weatherCodeMap(item.weather_code)?.label} className="w-[40px]"/>
                    <p className="text-[20px] font-[300]">{item.hour}</p>
                  </div>
                  <p className="text-[16px] font-[300]">{item.temperature_2m}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}