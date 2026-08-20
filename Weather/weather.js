const readline = require("readline/promises");
const { stdin, stdout } = require("process");

require("dotenv").config();

const rl = readline.createInterface({
    input: stdin,
    output: stdout
});

async function getWeather() {

    const city = await rl.question("Enter city: ");

    const url = `https://api.weatherstack.com/current?access_key=${process.env.API_KEY}&query=${encodeURIComponent(city)}`;

    const response = await fetch(url);

    const data = await response.json();

    console.log(`Here is the weather information for ${city}, ${data.location.country}`);
    console.log(`Current temperature in ${data.location.name} : ${data.current.temperature} deg Cel`);
    console.log(`Weather : ${data.current.weather_descriptions[0]}`);
    console.log(`Humidity : ${data.current.humidity}%`);
    console.log(`Wind Speed : ${data.current.wind_speed}km/hr`);
    rl.close();
}

getWeather();

export default getWeather;