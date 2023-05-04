//Toggle Theme

const toggleTheme = document.querySelector(".dark-light-mode");
const modetoggle = document.querySelector(".mode-toggle");

toggleTheme.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

modetoggle.addEventListener("click", () => {
    if (localStorage.getItem("theme") === "light") {
        modetoggle.src = "./assets/images/animation-image/clear-day.svg";
    } else {
        modetoggle.src = "./assets/images/animation-image/moon-first-quarter.svg";
    }
});

//check for user localstorage for prefered theme or city on page Load

const localDeviceTheme = localStorage.getItem("theme");
if (localDeviceTheme) {
    document.documentElement.classList.toggle(localDeviceTheme);
}

if (localDeviceTheme === "light") {
    modetoggle.src = "./assets/images/animation-image/moon-first-quarter.svg";
} else {
    modetoggle.src = "./assets/images/animation-image/clear-day.svg";
}

//Jokes loop through every 7 seconds

const jokesQuestion = document.querySelector(".joke-question");
const jokesanswer = document.querySelector(".joke-answer");

setInterval(async () => {
    await fetch("constants/weather-jokes.json")
        .then((response) => response.json())
        .then((data) => {
            let RandomNumber = Math.floor(Math.random() * data.length);
            jokesQuestion.innerText = data[RandomNumber]["question"];
            jokesanswer.innerText = data[RandomNumber]["answer"];
        })
        .catch((error) => console.error(error));
}, 7000);

//open weather API key, units

const APIKEY = "02937867dce4be1ea755fb1a3378315d";
let units = "metric";
let unitDegree = "C";

//updating the weather card

const forecastCityName = document.querySelector("#location");
const dateTime = document.querySelector("#date-time");
const dayTemperature = document.querySelector(".temp");
const dayCardIcon = document.querySelector("#day-card");
const dayDescription = document.querySelector("#description-temp");
const dayfeelsLike = document.querySelector("#feels-like");
const dayCondition = document.querySelector(".condition");
const dayConditionIcon = document.querySelector(".condition-icon");
const dayConditionmessage = document.querySelector("#condition-msg");
const currentTempImage = document.querySelector(".current-temp-image");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".wind-speed");
const humidityDescription = document.querySelector(".humidity-description");
const windSpeedDescription = document.querySelector(".wind-speed-description");
const humidity_warning = document.querySelector(".humidity_warning");
const windSpeed_warning = document.querySelector(".wind_speed_warning");
const sunriseTime = document.querySelector(".sunrise-time");
const sunsetTime = document.querySelector(".sunset-time");
const sunriseSunsetBg = document.querySelector(".sunrise-sunset-bg");

//humidity and windspeed descriptions and warning levels

const humidity_array = {
    "Low levels of Humidity": [0, 30.9],
    "Comfortable levels of Humidity": [31, 50.9],
    "High levels of Humidity": [51, 70.9],
    "Very High levels of Humidity": [71, Infinity],
};

const wind_speed_array = {
    "Calm perfect weather for a walk": [0, 5.9],
    "Light Breeze, kite flying": [6, 19.9],
    "Moderate Breeze, kite flying": [20, 38.9],
    "Strong Wind, Stay indoors": [39, 61.9],
    "Gale, Stay indoors": [62, 88.9],
    "Severe Gale, Stay indoors": [89, 118.9],
    "Hurricane/Typhoon, Stay indoors": [119, Infinity],
};

const uv_level_array = {
    "Low risk from UV rays": [0, 2.9],
    "Medium risk from UV rays": [3, 5.9],
    "High risk from UV rays": [6, 7.9],
    "Very High risk from UV rays": [8, 10.9],
    "Extreme risk from UV rays": [11, Infinity],
};

const pollen_level_value_ranges = {
    "Low risk from Alder pollen": [0, 2.4],
    "Moderate risk from Alder pollen": [2.5, 49.9],
    "High risk from Alder pollen": [50, 499.9],
    "Very High risk from Alder pollen": [500, 1999.9],
    "Extreme risk from Alder pollen": [2000, Infinity],
};

const AQI = {
    1: [0, 15.9],
    2: [16, 31.9],
    3: [32, 49.9],
    4: [50, 99.9],
    5: [100, Infinity],
};

const warning = {
    "code-green": ["Low", "Calm", "Light"],
    "code-orange": ["Comfortable", "Moderate", "Medium"],
    "code-yellow": ["High", "Strong", "Gale"],
    "code-red": ["Very", "Severe", "Hurricane", "Extreme"],
};

async function weatherDetailsUpdate(weatherData) {
    //updating location details

    forecastCityName.innerText =
        weatherData.name + " , " + weatherData.sys.country;

    let epochTime = weatherData.dt;
    let utcOffset = weatherData.timezone;
    let sunrise = weatherData.sys.sunrise;
    let sunset = weatherData.sys.sunset;

    function formatUnixTime(epochTime, utcOffset, options = {}) {
        const date = new Date((epochTime + utcOffset) * 1000);
        return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
    }

    function getLongFormatUnixTime(epochTime, utcOffset) {
        const options = {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };
        return formatUnixTime(epochTime, utcOffset, options);
    }

    dateTime.innerText = getLongFormatUnixTime(epochTime, utcOffset);

    let timeStr = getLongFormatUnixTime(epochTime, utcOffset).split(" ")[4];
    let hour = parseInt(timeStr.split(":")[0]);
    let isPm = getLongFormatUnixTime(epochTime, utcOffset).split(" ")[5] === "PM";

    if (isPm && hour !== 12) {
        hour += 12;
    } else if (!isPm && hour === 12) {
        hour += 0;
    }

    const isNight = hour >= 19 || hour <= 4;
    if (isNight) {
        sunriseSunsetBg.src = "assets/night.png";
    } else {
        sunriseSunsetBg.src = "assets/day.png";
    }

    function shortformatUnixTime(sunrise, utcOffset, options = {}) {
        const date = new Date((sunrise + utcOffset) * 1000);
        return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
    }
    function getshortFormat(sunrise, utcOffset) {
        const options = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };
        return shortformatUnixTime(sunrise, utcOffset, options);
    }

    sunriseTime.childNodes[2].nodeValue = getshortFormat(sunrise, utcOffset);
    sunsetTime.childNodes[2].nodeValue = getshortFormat(sunset, utcOffset);

    dayTemperature.childNodes[0].nodeValue = Math.floor(weatherData.main.temp);
    dayDescription.innerText = weatherData.weather[0].description;
    dayfeelsLike.innerHTML = `${Math.floor(
        weatherData.main.feels_like
    )} &deg; ${unitDegree}`;

    const weatherIcon = await fetch("icons_description.json");
    const weatherIconData = await weatherIcon.json();
    const dayOrNightIcon = weatherData.weather[0].icon.split("").pop();
    const iconId = weatherData.weather[0].id;

    dayCardIcon.src = `assets/animation-ready/${weatherIconData[0][dayOrNightIcon][iconId]}.svg`;

    const weatherCaution = weatherData.weather[0].main;

    dayConditionIcon.src = weatherIconData[0].caution[weatherCaution];

    dayConditionmessage.childNodes[4].nodeValue =
        weatherIconData[0].cautionDescription[weatherCaution];

    currentTempImage.src = weatherIconData[0].chibiIcon[weatherCaution];

    let humidity_level = weatherData.main.humidity;

    for (const key in humidity_array) {
        if (
            humidity_array.hasOwnProperty(key) &&
            humidity_level >= humidity_array[key][0] &&
            humidity_level <= humidity_array[key][1]
        ) {
            humidity_level = key;
            break;
        }
    }

    humidity.childNodes[0].nodeValue = `${weatherData.main.humidity} %`;
    humidityDescription.innerText = humidity_level;

    //extract first word which is looped through warning object
    humidity_level = humidity_level.split(" ")[0];

    const humidity_level_warning = Object.entries(warning).find(([key, value]) =>
        value.includes(`${humidity_level}`)
    );

    humidity_warning.src = `assets/animation-ready/${humidity_level_warning[0]}.svg`;

    let wind_speed_level = weatherData.wind.speed * (18 / 5);

    for (const key in wind_speed_array) {
        if (
            wind_speed_array.hasOwnProperty(key) &&
            wind_speed_level >= wind_speed_array[key][0] &&
            wind_speed_level <= wind_speed_array[key][1]
        ) {
            wind_speed_level = key;
            break;
        }
    }

    if (units === "metric") {
        windSpeed.childNodes[0].nodeValue = `${Math.floor(
            weatherData.wind.speed * (18 / 5)
        )} Kmph`;
    } else {
        windSpeed.childNodes[0].nodeValue = `${Math.floor(
            weatherData.wind.speed * (18 / 5) * 0.62
        )} mph`;
    }

    windSpeedDescription.innerText = wind_speed_level;

    //extract first word which is looped through warning object
    wind_speed_level = wind_speed_level.split(" ")[0];

    const wind_level_warning = Object.entries(warning).find(([key, value]) =>
        value.includes(`${wind_speed_level}`)
    );

    windSpeed_warning.src = `assets/animation-ready/${wind_level_warning[0]}.svg`;
}

//Air quality and pollen details

const airQualityValue = document.querySelector(".card-value");
const windDirection = document.querySelector(".aqi-card2-background");
const tooltips = document.querySelector("[data-value]");
const stopValue = document.querySelector(".skill-per");

//gets lat and long data from geolocation or weather data from search feature

async function airQuality(parameterA, parameterB) {
    if (typeof parameterA === "number") {
        latitude = parameterA;
        longitude = parameterB;
    } else {
        latitude = parameterA.coord.lat;
        longitude = parameterA.coord.lon;
        windDegree = parameterA.wind.deg;
    }

    const airQualityApi = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=dust,uv_index,uv_index_clear_sky,alder_pollen,european_aqi,european_aqi_pm2_5,us_aqi,us_aqi_pm2_5`;

    const response = await fetch(airQualityApi);
    const airQualityData = await response.json();

    additonalWeatherUpdate(airQualityData);

    const airQualityDataSum = airQualityData.hourly.european_aqi.reduce(
        (acc, value) => acc + value
    );

    const AQI_index = Math.floor(
        airQualityDataSum / airQualityData.hourly.european_aqi.length
    );

    airQualityValue.childNodes[0].nodeValue = AQI_index;

    //wind direction into NEWS

    const compassDirections = [
        "North",
        "North-East",
        "East",
        "South-East",
        "South",
        "South-West",
        "West",
        "North-West",
    ];
    const degreeStep = 45;
    const direction = Math.floor(windDegree / degreeStep + 0.5) % 8;

    windDirection.innerText = compassDirections[direction] + " Wind";

    let result = null;

    for (const key in AQI) {
        if (
            AQI.hasOwnProperty(key) &&
            AQI_index >= AQI[key][0] &&
            AQI_index <= AQI[key][1]
        ) {
            result = key;
            break;
        }
    }

    const AQI_status = ["Good", "Fair", "Satisfatory", "Very poor", "Hazardous"];

    stopValue.style.width = `${result * 20}%`;
    tooltips.innerText = AQI_status[result - 1];
}

//Additional weather details update

const uv_index = document.querySelector(".uv-index");
const alder_pollen = document.querySelector(".pollen");
const uv_index_description = document.querySelector(".uv-index-description");
const alder_pollen_description = document.querySelector(".pollen-description");
const uv_index_warning = document.querySelector(".uv_index_warning");
const pollen_warning = document.querySelector(".pollen_warning");

async function additonalWeatherUpdate(airQualityData) {
    const uv_indexSum = airQualityData.hourly.uv_index.reduce(
        (acc, value) => acc + value
    );

    const uv_indexValue = Math.floor(
        uv_indexSum / airQualityData.hourly.european_aqi.length
    );

    const alder_PollenSum = airQualityData.hourly.alder_pollen.reduce(
        (acc, value) => acc + value
    );

    const alder_pollenValue = Math.floor(
        alder_PollenSum / airQualityData.hourly.european_aqi.length
    );

    let uv_level_description = null;

    for (const key in uv_level_array) {
        if (
            uv_level_array.hasOwnProperty(key) &&
            uv_indexValue >= uv_level_array[key][0] &&
            uv_indexValue <= uv_level_array[key][1]
        ) {
            uv_level_description = key;
            break;
        }
    }

    uv_index.childNodes[0].nodeValue = `${uv_indexValue} UVI`;
    uv_index_description.innerText = uv_level_description;

    //extract first word which is looped through warning object
    uv_level_description = uv_level_description.split(" ")[0];

    const uv_level_warning = Object.entries(warning).find(([key, value]) =>
        value.includes(`${uv_level_description}`)
    );

    uv_index_warning.src = `assets/animation-ready/${uv_level_warning[0]}.svg`;

    let pollen_description = null;

    for (const key in pollen_level_value_ranges) {
        if (
            pollen_level_value_ranges.hasOwnProperty(key) &&
            alder_pollenValue >= pollen_level_value_ranges[key][0] &&
            alder_pollenValue <= pollen_level_value_ranges[key][1]
        ) {
            pollen_description = key;
            break;
        }
    }

    alder_pollen.childNodes[0].nodeValue = `${alder_pollenValue}`;
    alder_pollen_description.innerText = pollen_description;

    //extract first word which is looped through warning object
    pollen_description = pollen_description.split(" ")[0];

    const pollen_level_warning = Object.entries(warning).find(([key, value]) =>
        value.includes(`${pollen_description}`)
    );

    pollen_warning.src = `assets/animation-ready/${pollen_level_warning[0]}.svg`;
}

// toggle units

const mainUnit = document.querySelector(".unit-conversion");
const unitConversion = document.querySelector(".slash");

const onLoadLocation = localStorage.getItem("location");

if (onLoadLocation) {
    getLocation(onLoadLocation);
} else {
    getLocation("Singapore");
}

async function getLocation(position) {
    let openWeatherApi;
    if (typeof position === "object") {
        openWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${position.value}&appid=${APIKEY}&units=${units}`;
        localStorage.setItem("location", position.value);
    } else {
        openWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${position}&appid=${APIKEY}&units=${units}`;
        localStorage.setItem("location", position);
    }

    let response = await fetch(openWeatherApi);
    let weatherData = await response.json();

    let latitude = weatherData.coord.lat;
    let longitude = weatherData.coord.lon;

    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);

    weatherDetailsUpdate(weatherData);
    airQuality(weatherData);
    futureForecast(weatherData.coord.lat, weatherData.coord.lon);

    if (weatherData.cod === "404") {
        alert("Please enter a valid location");
    }
}

unitConversion.addEventListener("click", () => {
    let temp = mainUnit.childNodes[1].nodeValue;
    mainUnit.childNodes[1].nodeValue = `${unitConversion.childNodes[1].childNodes[0].nodeValue}`;
    unitConversion.childNodes[1].childNodes[0].nodeValue = temp;
    if (mainUnit.childNodes[1].nodeValue === "F") {
        units = "imperial";
        weatherDetails(
            localStorage.getItem("latitude"),
            localStorage.getItem("longitude"),
            units
        );
        unitDegree = "F";

        forecastCities(units);
    } else {
        units = "metric";
        weatherDetails(
            localStorage.getItem("latitude"),
            localStorage.getItem("longitude"),
            units
        );
        unitDegree = "C";

        forecastCities(units);
    }
});
