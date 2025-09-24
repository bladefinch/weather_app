'use client';

import Weather from "./components/weather";

import { useState } from "react";

import { setTemperatureUnit, setWindSpeedUnit, setPrecipitationUnit, setImperialUnits } from "@/lib/features/weather/weatherUnitsSet.slice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { TemperatureUnit, WindSpeedUnit, PrecipitationUnit } from "@/lib/features/weather/weatherUnitsSet.slice";
export default function Home() {
  const [activeUnits, setActiveUnits] = useState<boolean>(false);

  const dispatch = useDispatch();
  const units = useSelector((state: RootState) => state.weatherUnitsSet); 

  const handleTemperatureUnit = (unit: TemperatureUnit) => dispatch(setTemperatureUnit(unit));
  const handleWindSpeedUnit = (unit: WindSpeedUnit) => dispatch(setWindSpeedUnit(unit));
  const handlePrecipitationUnit = (unit: PrecipitationUnit) => dispatch(setPrecipitationUnit(unit));

  const handleImperialUnits = () => dispatch(setImperialUnits());

  return (
    <div className="px-5 bg-[hsl(243,96%,9%)]">
      <div className="max-w-[1256px] px-[20px] max-[769px]:px-0 mx-auto pt-[49px] max-[426px]:pt-[17px] pb-[100px] max-[426px]:pb-[50px] text-center text-white">
        <div className="flex items-center justify-between relative">
          <img className="max-[426px]:w-[135px]" src="/svg/logo.svg" alt="Weather Now" />
          <div onClick={() => setActiveUnits(!activeUnits)} className="flex items-center justify-between bg-[hsl(243,27%,20%)] py-3 px-4 max-[426px]:px-2 max-[426px]:py-2 rounded-[10px] max-[426px]:rounded-[6px] w-[120px] max-[426px]:w-[90px] cursor-pointer"> 
            <img src="/svg/icon-units.svg" />
            <p className="text-[16px] max-[426px]:text-[14px] font-[300]">Units</p>
            <img className="max-[426px]:w-[10px]" src="/svg/icon-dropdown.svg" />
          </div>
          <div className={`absolute top-[52px] right-0 text-left bg-[hsl(243,27%,20%)] w-[215px] overflow-hidden px-1.5 py-1.5 rounded-[10px] 
          border border-[hsl(243,27%,30%)] text-[16px] shadow-[0px_0px_10px_10px_rgba(0,0,0,0.25)] z-20 ${activeUnits ? "block" : "hidden"}`}>
            <button onClick={handleImperialUnits} className="font-[300] tracking-[0.3px] p-2.5 w-[100%] text-left rounded-[10px] cursor-pointer focus:outline-1 focus:outline-[hsl(250,6%,84%)]">Switch to Imperial</button>
            <div className="grid gap-2.5 mt-2.5">
              <div className="gap-2">
                <div className="text-[16px]"> 
                  <p className="text-[14px] text-[hsl(240,6%,70%)] px-2.5 mb-2.5">Temperature</p>  
                  <div className="grid gap-1">
                    <button onClick={() => handleTemperatureUnit("celsius")} className={`p-2.5 text-left rounded-[10px] cursor-pointer focus:outline-1 focus:outline-[hsl(250,6%,84%)] ${units.temperatureUnit === "celsius" ? "bg-[hsl(243,27%,24%)]" : ""}`}>Celsius (°C)</button>
                    <button onClick={() => handleTemperatureUnit("fahrenheit")} className={`p-2.5 text-left rounded-[10px] cursor-pointer focus:outline-1 focus:outline-[hsl(250,6%,84%)] ${units.temperatureUnit === "fahrenheit" ? "bg-[hsl(243,27%,24%)]" : ""}`}>Fahrenheit (°F)</button>
                  </div>
                </div>
                <hr className="text-[hsl(243,27%,30%)] mt-1"/>
              </div>  
              <div className="gap-2">
                <div className="text-[16px]">
                  <p className="text-[14px] text-[hsl(240,6%,70%)] px-2.5 mb-2.5">Wind Speed</p>  
                  <div className="grid gap-1">
                    <button  onClick={() => handleWindSpeedUnit("km/h")} className={`p-2.5 text-left rounded-[10px] cursor-pointer focus:outline-1 focus:outline-[hsl(250,6%,84%)] ${units.windSpeedUnit === "km/h" ? "bg-[hsl(243,27%,24%)]" : ""}`}>km/h</button>
                    <button onClick={() => handleWindSpeedUnit("mph")} className={`p-2.5 text-left rounded-[10px] cursor-pointer focus:outline-1 focus:outline-[hsl(250,6%,84%)] ${units.windSpeedUnit === "mph" ? "bg-[hsl(243,27%,24%)]" : ""}`}>mph</button>
                  </div>
                </div>
                <hr className="text-[hsl(243,27%,30%)] mt-1"/>
              </div>  
              <div className="gap-2">
                <div className="text-[16px]">
                  <p className="text-[14px] text-[hsl(240,6%,70%)] px-2.5 mb-2.5">Precipitaion</p>  
                  <div className="grid gap-1">
                    <button onClick={() => handlePrecipitationUnit("mm")} className={`p-2.5 text-left rounded-[10px] cursor-pointer focus:outline-1 focus:outline-[hsl(250,6%,84%)] ${units.precipitationUnit === "mm" ? "bg-[hsl(243,27%,24%)]" : ""}`}>Millimeters (mm)</button>
                    <button onClick={() => handlePrecipitationUnit("in")} className={`p-2.5 text-left rounded-[10px] cursor-pointer focus:outline-1 focus:outline-[hsl(250,6%,84%)] ${units.precipitationUnit === "in" ? "bg-[hsl(243,27%,24%)]" : ""}`}>Inches (in)</button>
                  </div>
                </div>
              </div>  
            </div>
          </div>
        </div>
        <Weather></Weather>
      </div>
    </div>
  );
}
