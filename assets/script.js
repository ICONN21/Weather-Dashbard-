const searchButton = document.getElementById('search-btn');
const weatherDisplay = document.getElementById('weather-display');
const currentWeather = document.getElementById('currentWeather');
const currentCityDate = document.getElementById('current-city-date');
const currentTemp = document.getElementById('current-temp');
const currentHumidity = document.getElementById('current-humidity');
const currentWind = document.getElementById('current-wind');

const cityInput = document.getElementById('city-input');
const APIkey = `4a053c145f12f7d520fdf3cb5b6974dd`;

function createCard(data) {
    const card = document.createElement('div');
    card.classList.add('weather-card');
    
    card.innerHTML = `
        <h2>${data.name}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} km/h</p>
    `;
    
    weatherDisplay.appendChild(card);
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${APIkey}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayCurrentWeather(data);
            displayForecast(data.coord.lat, data.coord.lon);
            addCityToHistory(cityName);
        })
        .catch(() => {
            alert(`Failed to fetch coordinates of ${cityName}`);
        });
}

searchButton.addEventListener('click', getCityCoordinates);

function addCityToHistory(cityName) {
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    listItem.textContent = cityName;
    listItem.addEventListener('click', function() {
        cityInput.value = cityName;
        getCityCoordinates();
    });
    historyList.appendChild(listItem);
}

function displayCurrentWeather(data) {
    currentCityDate.textContent = `${data.name}, ${new Date().toLocaleDateString()}`;
    document.getElementById('current-icon').src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    currentTemp.textContent = `Temperature: ${data.main.temp}°C`;
    currentHumidity.textContent = `Humidity: ${data.main.humidity}%`;
    currentWind.textContent = `Wind Speed: ${data.wind.speed} km/h`;

    createCard(data); // Create a card for the current weather
}

function displayForecast(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const forecastDays = document.getElementById('forecast-days');
            forecastDays.innerHTML = ''; // Clear previous forecast
            
            // Loop over the forecast data (we'll use a 5-day forecast with intervals of 8 steps)
            for (let i = 0; i < data.list.length; i += 8) {
                const dayData = data.list[i];
                const day = document.createElement('div');
                day.classList.add('day');
                
                day.innerHTML = `
                    <p>${new Date(dayData.dt_txt).toLocaleDateString()}</p>
                    <img src="http://openweathermap.org/img/w/${dayData.weather[0].icon}.png" alt="Weather Icon">
                    <p>Temp: ${dayData.main.temp}°C</p>
                    <p>Wind: ${dayData.wind.speed} km/h</p>
                    <p>Humidity: ${dayData.main.humidity}%</p>
                `;
                
                forecastDays.appendChild(day);
            }
        })
        .catch(() => {
            alert('Failed to fetch forecast data');
        });
}