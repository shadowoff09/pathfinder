/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

export async function getWeather(longitude: number, latitude: number) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lon=${longitude}&lat=${latitude}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`)
  const data = await response.json()
  return data
}

export async function searchLocations(searchTerm: string) {
  const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${searchTerm}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`);
  const data = await response.json();
  return data.features.map((feature: any) => ({
    id: feature.id,
    place_name: feature.properties.full_address,
    center: [feature.properties.coordinates.longitude, feature.properties.coordinates.latitude],
  }));
}
