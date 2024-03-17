function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let day = days[date.getDay()];

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}, ${hours}:${minutes}`;
}

function refreshWeather(response) {
  let currentTemp = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let weatherDescriptionElement = document.querySelector("#weatherDescription");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  iconElement.innerHTML = `<img
      src="${response.data.condition.icon_url}"
      class="temp-icon"
    />`;
  cityElement.innerHTML = response.data.city;
  currentTemp.innerHTML = Math.round(temperature);
  weatherDescriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windElement.innerHTML = `${response.data.wind.speed}km/h`;
  dateElement.innerHTML = formatDate(date);

  getForecast(response.data.city);
}

function searchCity(city) {
  // make api call and update the interface
  let apiKey = "dc6760cf7088c245e5a42a646bco203t";
  let apiURL = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiURL).then(refreshWeather);
}

function searchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "dc6760cf7088c245e5a42a646bco203t";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `<div class="row">
            <div class="col-2">
              <div class="forecast-date">${formatDay(day.time)}</div>
              <div>
              <img src="${day.condition.icon_url}" alt="" class="forecast-image"
              />
              </div>
              <div class="forecast-temperatures">
                <span class="forecast-temp-max">${Math.round(
                  day.temperature.maximum
                )}</span
                ><span class="forecast-temp-min"> ${Math.round(
                  day.temperature.minimum
                )}</span>
              </div>
            </div>
          </div>`;
    }
  });
  let forecast = document.querySelector("#forecast");
  forecast.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", searchSubmit);

searchCity("London");
