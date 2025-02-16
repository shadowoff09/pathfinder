'use server'

export async function getWeather(longitude: number, latitude: number) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lon=${longitude}&lat=${latitude}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`)
  const data = await response.json()
  console.log(data)
  return data
}
