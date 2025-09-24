export type HourlyWeather = {
    hour: string;
    temperature_2m: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
    precipitation: number;
    apparent_temperature: number;
    weather_code: number;
};

export type DailyWeather = {
    date: string;
    day: string;
    dayFull: string;
    maxtemp: number;
    mintemp: number;
    dayweather: number;
    hours: HourlyWeather[];
};

export type WeekWeather = DailyWeather[];

export type City = {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
};

export type CityList = City[];