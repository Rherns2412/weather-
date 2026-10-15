
async function getWeather() {
    let city = document.getElementById("city").value.trim();
    let status = document.getElementById("status");
    let weather = document.getElementById("weather");

    if (city === "") {
        status.textContent = "Please enter a city name.";
        return;
    }

    status.textContent = "Loading weather...";
    weather.style.display = "none";

    try {
        // Find city coordinates
        let geoResponse = await fetch(
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(city) + "&count=1&language=en&format=json"
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        let geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            status.textContent = "City not found. Try another name.";
            return;
        }

        let place = geoData.results[0];
        let latitude = place.latitude;
        let longitude = place.longitude;

        // Fetch current weather
        let url = "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + latitude +
            "&longitude=" + longitude +
            "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m" +
            "&timezone=auto";

        let response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        let data = await response.json();
        let current = data.current;

        // Convert weather code to description
        let codes = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Foggy",
            48: "Rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Dense drizzle",
            61: "Light rain",
            63: "Moderate rain",
            65: "Heavy rain",
            71: "Light snowfall",
            73: "Moderate snowfall",
            75: "Heavy snowfall",
            80: "Rain showers",
            81: "Moderate rain showers",
            82: "Heavy rain showers",
            95: "Thunderstorm",
            96: "Thunderstorm with hail",
            99: "Heavy thunderstorm with hail"
        };

        document.getElementById("cityName").textContent =
            place.name + (place.country ? ", " + place.country : "");

        document.getElementById("temperature").textContent =
            current.temperature_2m + " °C";

        document.getElementById("condition").textContent =
            "Condition: " + (codes[current.weather_code] || "Unknown");

        document.getElementById("humidity").textContent =
            "Humidity: " + current.relative_humidity_2m + "%";

        document.getElementById("wind").textContent =
            "Wind Speed: " + current.wind_speed_10m + " km/h";

        status.textContent = "Weather updated successfully.";
        weather.style.display = "block";

    } catch (error) {
        status.textContent =
            "Unable to load weather. Please try again.";
    }
}

// Search when Enter is pressed
document.getElementById("city").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
