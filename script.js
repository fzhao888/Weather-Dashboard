//get cityname from form input
//get lat and lon using https://api.openweathermap.org/data/2.5/weather?q=cityname&appid=764671b721b30354fb8205614f3a38ac
//get current forecast and 5-day forecast
//save data to local storage
//display weather data
//display previously searched

let searchBtn = document.getElementById('search');
let previousResultsEl = document.querySelector('.previous-results');
let currentSearchResultsEl = document.querySelector('.current-search-results');
let fiveDaySearchResultsEl = document.querySelector('.fiveday-search-results');
let searchInputEl = document.getElementById('search-input');
let cityname = "";

function handleSearchFormSubmit(event) {
    event.preventDefault();

    //stores search input into cityname, then saves it to local storage:
    cityname = searchInputEl.value;

    let storedCities = JSON.parse(localStorage.getItem('cities'));
    console.log(cityname);
    if (!storedCities || storedCities.length === 0) {
        storedCities = [];
    }

    if (!storedCities.includes(cityname)) {
        storedCities.push(cityname);
        localStorage.setItem("cities", JSON.stringify(storedCities));
    }

    //sets query parameter
    let queryString = '?q=' + cityname;
    location.replace(queryString);
}

//renders previously searched cities
function renderLocalStorage() {
    let storedCities = JSON.parse(localStorage.getItem('cities'));
    previousResultsEl.textContent = "";

    if (!storedCities || storedCities.length === 0) {
        return;
    }

    //makes a button for each stored city
    let buttonDiv = document.createElement('div');
    buttonDiv.style.display = 'flex';
    buttonDiv.style.flexDirection = 'column';

    let resultBtn;

    for (let i = 0; i < storedCities.length; i++) {
        if (storedCities[i].length === 0) {
            continue;
        }
        resultBtn = document.createElement('button');
        resultBtn.setAttribute('id', i);
        resultBtn.textContent = storedCities[i];
        resultBtn.style.marginBottom = '10px';
        resultBtn.style.borderRadius = '5px';
        buttonDiv.append(resultBtn);

        resultBtn.addEventListener("click", function (event) {
            event.preventDefault();
            let resultID = event.target.id;
            cityname = storedCities[resultID];
            location.replace('?q=' + cityname);
        });
    }

    previousResultsEl.appendChild(buttonDiv);
}



function renderSearchResults() {
    let queryString = document.location.search.split('=')[1];

    if (queryString && queryString.length !== 0) {
        getCurrentWeather();
        getFiveDay();
    }
}



function getCurrentWeather() {
    let cityname = document.location.search.split('=')[1];

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
    currentSearchResultsEl.textContent = "";
    let resultCard = document.createElement('div');
    //resultCard.classList.add('card');

    let headerCard = document.createElement('div');
    // headerCard.classList.add('card-header');

    let titleEl = document.createElement('h2');
    titleEl.textContent = results.name + " " + "(" + new Date(results.dt * 1000).toLocaleDateString() + ") ";
    titleEl.style.fontWeight = 'bold';
    let iconEl = document.createElement('img');
    iconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + results.weather[0].icon + '.png');

    headerCard.style.display = 'flex';
    headerCard.style.alignItems = 'center';
    headerCard.append(titleEl, iconEl);

    let bodyCard = document.createElement('div');
    //bodyCard.classList.add('card-content');
    let tempEl = document.createElement('p');
    tempEl.textContent = "Temp: " + results.main.temp + " °F";
    let windspeedEl = document.createElement('p');
    windspeedEl.textContent = "Windspeed: " + results.wind.speed + " MPH";
    let humidityEl = document.createElement('p');
    humidityEl.textContent = "Humidity: " + results.main.humidity + " %";
    bodyCard.append(tempEl, windspeedEl, humidityEl);

    resultCard.append(headerCard, bodyCard);
    currentSearchResultsEl.append(resultCard);
    currentSearchResultsEl.style.borderStyle = 'solid';
    currentSearchResultsEl.style.borderWidth = '2px';
    currentSearchResultsEl.style.marginLeft = '20px';
    currentSearchResultsEl.style.paddingLeft = '5px';
    currentSearchResultsEl.style.paddingBottom = '5px';
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
    //0,8,16,24,32
    fiveDaySearchResultsEl.textContent = "";

    let resultCard = document.createElement('div');

    let resultHeader = document.createElement('h2');
    resultHeader.style.fontWeight = 'bold';
    resultHeader.style.marginTop = '8px';
    resultHeader.style.marginBottom = '8px';
    resultHeader.textContent = '5-Day Forecast:';
    resultCard.append(resultHeader);

    let resultBody = document.createElement('div');

    for (let i = 0; i <= 32; i += 8) {
        let resultBodyItem = document.createElement('div');

        let dateEl = document.createElement('p');
        dateEl.textContent = new Date(results.list[i].dt * 1000).toLocaleDateString();
        dateEl.style.fontWeight = 'bold';

        let iconEl = document.createElement('img');
        iconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + results.list[i].weather[0].icon + '.png');

        let tempEl = document.createElement('p');
        tempEl.textContent = "Temp: " + results.list[i].main.temp + " °F";

        let windspeedEl = document.createElement('p');
        windspeedEl.textContent = "Windspeed: " + results.list[i].wind.speed + " MPH";

        let humidityEl = document.createElement('p');
        humidityEl.textContent = "Humidity: " + results.list[i].main.humidity + " %";

        resultBodyItem.append(dateEl, iconEl, tempEl, windspeedEl, humidityEl);
        resultBodyItem.style.padding = '5px';
        resultBodyItem.style.backgroundColor = 'rebeccapurple';
        resultBodyItem.style.color = 'white';

        if (i !== 0) {
            resultBodyItem.style.marginLeft = '5px';
        }

        resultBody.append(resultBodyItem);
    }
    resultBody.style.display = 'flex';

    resultCard.style.display = 'flex';
    resultCard.style.flexDirection = 'column';

    resultCard.append(resultBody);
    fiveDaySearchResultsEl.append(resultCard);
}


renderSearchResults();
renderLocalStorage();
searchBtn.addEventListener("click", handleSearchFormSubmit);