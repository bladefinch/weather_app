export default function weatherCodeMap(weather_code: number) {
    if (weather_code === 0) {
        return { label: "Clear sky", icon: "/svg/icon-sunny.webp" };
    } else if (weather_code === 1 || weather_code === 2) {
        return { label: "Partly cloudy", icon: "/svg/icon-partly-cloudy.webp" };
    } else if (weather_code >= 3 && weather_code <= 44) {
        return { label: "Overcast", icon: "/svg/icon-overcast.webp" };
    } else if (weather_code >= 45 && weather_code <= 50) {
        return { label: "Fog", icon: "/svg/icon-fog.webp" };
    } else if (weather_code >= 51 && weather_code <= 60) {
        return { label: "Drizzle", icon: "/svg/icon-drizzle.webp" };
    } else if (weather_code >= 61 && weather_code <= 70) {
        return { label: "Rain", icon: "/svg/icon-rain.webp" };
    } else if (weather_code >= 71 && weather_code <= 80) {
        return { label: "Snow", icon: "/svg/icon-snow.webp" };
    } else if (weather_code >= 81 && weather_code <= 99) {
        return { label: "Storm", icon: "/svg/icon-storm.webp" };
    }

    return { label: "Clear sky", icon: "/svg/icon-sunny.webp" };
}