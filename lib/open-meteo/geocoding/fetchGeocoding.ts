
export async function getCityList(city:string) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`);
    const dataGeo = await response.json();

    return dataGeo
}