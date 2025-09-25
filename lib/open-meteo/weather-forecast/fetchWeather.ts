import { fetchWeatherApi } from 'openmeteo';

export async function getWeatherForecast(lat: number, lon: number, units: { temperatureUnit: string; windSpeedUnit: string; precipitationUnit: string }) {

    const params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": ["temperature_2m", "wind_speed_10m", "relative_humidity_2m", "precipitation", "apparent_temperature", "weather_code"],
        "timezone": "auto",
        "past_days": 1,
        ...units.temperatureUnit === "fahrenheit" && { "temperature_unit": "fahrenheit" },
        ...units.windSpeedUnit === "mph" && { "windspeed_unit": "mph" },
        ...units.precipitationUnit === "in" && { "precipitation_unit": "inch" },
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];

    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    // console.log(
    //     `\nCoordinates: ${latitude}°N ${longitude}°E`,
    //     `\nElevation: ${elevation}m asl`,
    //     `\nTimezone: ${timezone} ${timezoneAbbreviation}`,
    //     `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
    // );

    const hourly = response.hourly()!;

    const weatherData = {
        hourly: {
            time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature_2m: hourly.variables(0)!.valuesArray(),
            wind_speed_10m: hourly.variables(1)!.valuesArray(),
            relative_humidity_2m: hourly.variables(2)!.valuesArray(),
            precipitation: hourly.variables(3)!.valuesArray(),
            apparent_temperature: hourly.variables(4)!.valuesArray(),
            weather_code: hourly.variables(5)!.valuesArray(),
        },
    };

    const weatherDataHourly = weatherData.hourly.time.map((j:Date, i:number) => ({
        date: j.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric",
        }),
        day: j.toLocaleDateString("en-US", {
            weekday: "short",
        }),
        dayFull: j.toLocaleDateString("en-US", {
            weekday: "long",
        }),
        hour: j.toLocaleTimeString("en-US", {
            hour: "numeric",
        }),
        timezonediff: utcOffsetSeconds,
        temperature_2m: Math.round(weatherData.hourly.temperature_2m?.[i] ?? 0),
        wind_speed_10m: Math.round(weatherData.hourly.wind_speed_10m?.[i] ?? 0),
        relative_humidity_2m: Math.round(weatherData.hourly.relative_humidity_2m?.[i] ?? 0),
        precipitation: Math.round(weatherData.hourly.precipitation?.[i] ?? 0),
        apparent_temperature: Math.round(weatherData.hourly.apparent_temperature?.[i] ?? 0),
        weather_code: weatherData.hourly.weather_code?.[i] ?? 0,
    }))

    
    type HourlyWeather = {
        hour: string;
        temperature_2m: number;
        wind_speed_10m: number;
        relative_humidity_2m: number;
        precipitation: number;
        apparent_temperature: number;
        weather_code: number;
    };

    type DailyWeather = {
        date: string;
        day: string;
        dayFull: string;
        timezonediff: number;
        maxtemp: number;
        mintemp: number;
        dayweather: number;
        hours: HourlyWeather[];
    };

    type HourlyWeatherPlus = HourlyWeather & { date: string; day: string; dayFull: string, timezonediff: number };

    const weatherDataDaily:DailyWeather[] = weatherDataHourly.reduce((acc: DailyWeather[], item: HourlyWeatherPlus) => {
        const { date, day, dayFull, timezonediff, ...hourData } = item;
        const existingDay = acc.find((day) => day.date === date); 
        if (existingDay) {
            existingDay.hours.push(hourData);
            existingDay.maxtemp = Math.max(existingDay.maxtemp, hourData.temperature_2m);
            existingDay.mintemp = Math.min(existingDay.mintemp, hourData.temperature_2m);
            existingDay.dayweather = Math.max(existingDay.dayweather, hourData.weather_code);
        } else {
            acc.push({ date: item.date, day: item.day, dayFull: item.dayFull, timezonediff: item.timezonediff, maxtemp: hourData.temperature_2m, mintemp: hourData.temperature_2m, dayweather: hourData.weather_code, hours: [hourData] });
        }
        return acc;
    }, []); 

    // console.log("\nHourly data devided", weatherDataDaily[1].hours)

    return weatherDataDaily;
}
