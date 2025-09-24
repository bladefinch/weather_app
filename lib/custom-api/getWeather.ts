
export async function getWeather(cityLatitude: number, cityLongitude: number, tempUnit: string, windUnit: string, precipUnit: string) {
  const response = await fetch(`/api/weather?cityLatitude=${cityLatitude}&cityLongitude=${cityLongitude}&temp=${tempUnit}&wind=${windUnit}&precip=${precipUnit}`);
  const data = await response.json();
  return data;
}