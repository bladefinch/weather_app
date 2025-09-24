import { getWeatherForecast } from "@/lib/open-meteo/weather-forecast/fetchWeather";
// import { getCitylocation } from "@/lib/open-meteo/geocoding/fetchGeocoding";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    // const city = searchParams.get("city") || "Tokyo";
    const cityLatitude = Number(searchParams.get("cityLatitude"));
    const cityLongitude = Number(searchParams.get("cityLongitude"));
    const tempUnit = searchParams.get("temp") || "celsius";
    const windUnit = searchParams.get("wind") || "km/h";
    const precipUnit = searchParams.get("precip") || "mm";




    // const cityData = await getCitylocation(city);
    const weather = await getWeatherForecast(cityLatitude, cityLongitude, { temperatureUnit: tempUnit, windSpeedUnit: windUnit, precipitationUnit: precipUnit });

  return NextResponse.json(weather);
}