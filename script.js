//get cityname from form input
//get lat and lon using https://api.openweathermap.org/data/2.5/weather?q=cityname&appid=764671b721b30354fb8205614f3a38ac
//get current forecast and 5-day forecast
//save data to local storage
//display weather data
//display previously searched

let searchBtn = document.getElementById('search');
let previousResultsEl = document.querySelector('.previous-results');
let searchResultsEl = document.querySelector('.search-results');
let searchInputEl = document.getElementById('search-input');
let cityname = "";

function handleSearchFormSubmit(event) {
    event.preventDefault();

    //stores search input into cityname, then saves it to local storage:
    cityname = searchInputEl.value;

    //sets query parameter
    let queryString = '?q=' + cityname;
    location.assign(queryString);

    let storedCities = JSON.parse(localStorage.getItem('cities'));
    console.log(cityname);
    if (!storedCities || storedCities.length === 0) {
        storedCities = [];
    }
    storedCities.push(cityname);
    localStorage.setItem("cities", JSON.stringify(storedCities));
    renderLocalStorage();
    renderSearchResults();
}

//renders previously searched cities
function renderLocalStorage() {
    let storedCities = JSON.parse(localStorage.getItem('cities'));
    previousResultsEl.textContent = "";

    if (!storedCities || storedCities.length === 0) {
        return;
    }

    //makes a button for each stored city
    let resultBtn;

    for (let i = 0; i < storedCities.length; i++) {
        resultBtn = document.createElement('button');
        resultBtn.setAttribute('id', i);
        resultBtn.textContent = storedCities[i];
        previousResultsEl.appendChild(resultBtn);


        resultBtn.addEventListener("click", function (event) {
            event.preventDefault();
            let resultID = event.target.id;
            cityname = storedCities[resultID];
            //location.assign('?q=' + cityname);
            renderSearchResults();
        });
    }
}



function renderSearchResults() {
    getCurrentWeather();
    getFiveDay();
}



function getCurrentWeather() {
    cityname = document.location.search.split('=')[1];

    let apiKey = '764671b721b30354fb8205614f3a38ac';
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=" + apiKey + "&units=imperial";

    //fetch lat and lon coordinates 
    fetch(queryURL)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (results) {
            renderCurrentWeather(results);
        })
}
//renders city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
function renderCurrentWeather(results) {
    let resultCard = document.createElement('div');
    
    let titleCard = document.createElement('div'); 
    let titleEl = document.createElement('h2');
    titleEl.textContent = results.name + " " + "(" + new Date(results.dt * 1000).toLocaleDateString() + ") ";
    let iconEl = document.createElement('img');
    iconEl.setAttribute('src','https://openweathermap.org/img/wn/' + results.weather[0].icon + '.png'); 

    titleCard.style.display = 'flex'; 
    titleCard.style.alignItems = 'center';
    titleCard.append(titleEl,iconEl);

    let bodyCard = document.createElement('div');
    let tempEl = document.createElement('p');
    tempEl.textContent = "Temp: " + results.main.temp +  " °F";
    let windspeedEl = document.createElement('p');
    windspeedEl.textContent = "Windspeed: " + results.wind.speed + " MPH";
    let humidityEl = document.createElement('p');
    humidityEl.textContent = "Humidity: " + results.main.humidity + " %";
    bodyCard.append(tempEl,windspeedEl,humidityEl);



    console.log(results);
    console.log(results.name);
    console.log(results.weather[0].icon);
    console.log(results.main.humidity);
    console.log(results.wind.speed);
    console.log(new Date(results.dt * 1000).toLocaleDateString());

    resultCard.append(titleCard,bodyCard);
    searchResultsEl.append(resultCard);
}

//renders 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
function getFiveDay() {
    cityname = document.location.search.split('=')[1];

    let apiKey = '764671b721b30354fb8205614f3a38ac';
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&appid=" + apiKey + "&units=imperial";
    fetch(queryURL)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (results) {
            renderFiveDay(results);
        });

}

function renderFiveDay(results) {
    console.log(results);
    //0,8,16,24,32
    for (let i = 0; i <= 32; i += 8) {
        console.log(results.city.name);
        console.log(results.list[i].weather[0].icon);
        console.log(results.list[i].main.humidity);
        console.log(results.list[i].wind.speed);
        console.log(new Date(results.list[i].dt * 1000).toLocaleDateString());
    }
}


renderLocalStorage();
searchBtn.addEventListener("click", handleSearchFormSubmit);