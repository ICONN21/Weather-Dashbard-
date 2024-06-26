const searchButton = document.getElementById('search-btn');
const weatherDisplay = document.getElementById('weather-display');
const currentWeather = document.getElementById('current-weather');
const currentCityDate = document.getElementById('current-city-date');
const currentTemp = document.getElementById('current-temp');
const currentHumidity = document.getElementById('current-humidity');
const currentWind = document.getElementById('current-wind');
const cityInput = document.getElementById('city-input');
const APIkey = `4a053c145f12f7d520fdf3cb5b6974dd`;

// Function to fetch data from API.
function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${APIkey}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayCurrentWeather(data);
            displayForecast(data.coord.lat, data.coord.lon);
            addCityToHistory(cityName, data);
        })
        .catch(() => {
            alert(`Failed to fetch coordinates of ${cityName}`);
        });
}

searchButton.addEventListener('click', getCityCoordinates);

// Adds searched cities to history list so they can easily be searched again.
function addCityToHistory(cityName, data) {
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    listItem.textContent = cityName;
    listItem.addEventListener('click', () => {
        displayCurrentWeather(data);
        displayForecast(data.coord.lat, data.coord.lon);
    });
    historyList.appendChild(listItem);

    // Save city data to local storage
    localStorage.setItem(cityName, JSON.stringify(data));
}

// Prints the information fetched from the API to the window.
function displayCurrentWeather(data) {
    currentCityDate.textContent = `${data.name}, ${new Date().toLocaleDateString()}`;
    document.getElementById('current-icon').src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    currentTemp.textContent = `Temperature: ${data.main.temp}°F`;
    currentHumidity.textContent = `Humidity: ${data.main.humidity}%`;
    currentWind.textContent = `Wind Speed: ${data.wind.speed} mph`;
}

function displayForecast(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIkey}`;
    // Fetches more data based on latitude and longitude.
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
                    <p>Temp: ${dayData.main.temp}°F</p>
                    <p>Wind: ${dayData.wind.speed} mph</p>
                    <p>Humidity: ${dayData.main.humidity}%</p>
                `;
                
                forecastDays.appendChild(day);
            }
        })
        .catch(() => {
            alert('Failed to fetch forecast data');
        });
}

// Load history from local storage on page load
window.addEventListener('load', () => {
    const historyList = document.getElementById('history-list');
    for (let i = 0; i < localStorage.length; i++) {
        const cityName = localStorage.key(i);
        const data = JSON.parse(localStorage.getItem(cityName));
        const listItem = document.createElement('li');
        listItem.textContent = cityName;
        listItem.addEventListener('click', () => {
            displayCurrentWeather(data);
            displayForecast(data.coord.lat, data.coord.lon);
        });
        historyList.appendChild(listItem);
    }
});