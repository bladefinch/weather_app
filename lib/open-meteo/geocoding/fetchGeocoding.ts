import { City } from "@/app/types/types";

export async function getCityList(city:string) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`);
    const dataGeoAll = await response.json();
    const dataGeo = dataGeoAll.results.map((city: City) => ({ name: city.name, latitude: city.latitude, longitude: city.longitude, country: city.country }));

    return dataGeo
}