let searchBtn = document.getElementById('search');
let previousResultsEl = document.querySelector('.previous-results');
let currentSearchResultsEl = document.querySelector('.current-search-results');
let fiveDaySearchResultsEl = document.querySelector('.fiveday-search-results');
let searchInputEl = document.getElementById('search-input');
let clearBtn = document.getElementById('clear');
const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
let cityname = "";

//handles search form
function handleSearchFormSubmit(event) {
    event.preventDefault();
    cityname = searchInputEl.value;

    //sets query parameter
    let queryString = '?q=' + cityname;
    location.replace(queryString);
}//end of handling search form

//adds city to local storage
function addLocalStorage() {
    //stores query parameter into cityname, then saves it to local storage:
    let storedCities = JSON.parse(localStorage.getItem('cities'));

    //parses city name for spaces:
    let city_first_name = cityname.split('%20')[0];
    let city_last_name = cityname.split('%20')[1];
    let searchedCity = "";

    //capitializes first letter
    if (!city_last_name) {
       searchedCity = city_first_name.charAt(0).toUpperCase() + city_first_name.slice(1);
    } else {
        searchedCity = city_first_name.charAt(0).toUpperCase() + city_first_name.slice(1) + " " + city_last_name.charAt(0).toUpperCase() + city_last_name.slice(1);
    }//end of parsing city name for spaces

    if (!storedCities || storedCities.length === 0) {
        storedCities = [];
    }

    //checks for dupe stored city
    let cities = [];
    for (let i = 0; i < storedCities.length; i++) {
        cities.push(storedCities[i]);
    }

    if (!cities.includes(searchedCity)) { 
        cities.push(searchedCity);
        localStorage.setItem("cities", JSON.stringify(cities));
    }

    renderLocalStorage();
}//end of adding city to local storage

//renders previously searched cities
function renderLocalStorage() {
    let storedCities = JSON.parse(localStorage.getItem('cities'));
    previousResultsEl.textContent = "";

    //checks for empty local storage or  undefined local storage
    if (!storedCities || storedCities.length === 0) {
        return;
    }

    //makes a button for each stored city
    let buttonDiv = document.createElement('div');
    buttonDiv.style.display = 'flex';
    buttonDiv.style.flexDirection = 'column';

    let resultBtn;

    for (let i = 0; i < storedCities.length; i++) {
        //accounts for empty city name
        if (storedCities[i].length === 0) {
            continue;
        }

        resultBtn = document.createElement('button');
        resultBtn.classList.add('btn', 'btn-default', 'btn-sm');
        resultBtn.style.backgroundColor = 'lightgray';
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

        resultBtn.onmouseover = function (event) {
            event.target.style.backgroundColor = 'gray';
        };

        resultBtn.onmouseout = function (event) {
            event.target.style.backgroundColor = 'lightgray';
        };

    }//end of making button of each stored city
    previousResultsEl.appendChild(buttonDiv);
}//end of rending previously search cities


//renders search results
function renderSearchResults() {
    let queryString = document.location.search.split('=')[1];

    if (queryString && queryString.length !== 0) {
        getCurrentWeather();
        getFiveDay();
    }
}//end of rending search results


//fetches current weather from openweather api
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
            if (results || results.length !== 0) {
                renderCurrentWeather(results);
            }
        }).catch(function (error) {
            errorModal.show();
            errorModal.hide();
        });
}//end of fetching current weather

//renders city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
function renderCurrentWeather(results) {
    addLocalStorage();

    currentSearchResultsEl.textContent = "";
    let resultCard = document.createElement('div');
    resultCard.classList.add('row');

    let headerCard = document.createElement('div');

    //creates title for search results card: (name,date)
    let titleEl = document.createElement('h2');
    titleEl.textContent = results.name + " " + "(" + new Date(results.dt * 1000).toLocaleDateString() + ") ";
    titleEl.style.fontWeight = 'bold';

    //creates and adds weather icon element
    let iconEl = document.createElement('img');
    iconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + results.weather[0].icon + '.png');
    iconEl.setAttribute('alt', 'image of weather icon');
    headerCard.style.display = 'flex';
    headerCard.style.alignItems = 'center';

    headerCard.append(titleEl, iconEl);

    //creates body card
    let bodyCard = document.createElement('div');

    //adds tempature element to body
    let tempEl = document.createElement('p');
    tempEl.textContent = "Temp: " + results.main.temp + " °F";

    //adds windspeed element to body
    let windspeedEl = document.createElement('p');
    windspeedEl.textContent = "Windspeed: " + results.wind.speed + " MPH";

    //adds humidity element to body
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
}//end of rending current weather

//fetches 5-day forecast from openweather api
function getFiveDay() {
    //retrieves cityname from query parameter
    cityname = document.location.search.split('=')[1];

    //fetches 5-day forecast
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
            if (results || results.length !== 0) {
                renderFiveDay(results);
            }
        })
        .catch(function (error) {
            errorModal.show();
            errorModal.hide();
        });

}//end of fetching 5-day forecast


//renders 5-day forecast results
function renderFiveDay(results) {
    //0,8,16,24,32
    addLocalStorage();

    fiveDaySearchResultsEl.textContent = "";

    let resultCard = document.createElement('div');
    //styling result header
    let resultHeader = document.createElement('h2');
    resultHeader.style.fontWeight = 'bold';
    resultHeader.style.marginTop = '8px';
    resultHeader.style.marginBottom = '8px';
    resultHeader.style.marginLeft = '8px';
    resultHeader.textContent = '5-Day Forecast:'; 
    resultCard.append(resultHeader);

    let resultBody = document.createElement('div');
    resultBody.style.marginLeft = '8px';

    resultBody.classList.add('card-deck', 'row');

    for (let i = 0; i <= 32; i += 8) {
        let resultBodyItem = document.createElement('div');
        resultBodyItem.classList.add('card', 'col-12', 'col-sm-10', 'col-md-10', 'col-lg-2');

        //adds date to result body item
        let dateEl = document.createElement('p');
        dateEl.textContent = new Date(results.list[i].dt * 1000).toLocaleDateString();
        dateEl.style.fontWeight = 'bold';

        //adds weather icon to result body item
        let iconEl = document.createElement('img');
        iconEl.classList.add('mr-3');
        iconEl.style.width = "50px";
        iconEl.style.height = "50px";
        iconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + results.list[i].weather[0].icon + '.png');
        iconEl.setAttribute('alt', 'image of weather icon');

        //adds tempature element to result body item
        let tempEl = document.createElement('p');
        tempEl.textContent = "Temp: " + results.list[i].main.temp + " °F";

        //adds wind speed element to result body item
        let windspeedEl = document.createElement('p');
        windspeedEl.textContent = "Windspeed: " + results.list[i].wind.speed + " MPH";

        //adds humidity element to result body item
        let humidityEl = document.createElement('p');
        humidityEl.textContent = "Humidity: " + results.list[i].main.humidity + " %";

        resultBodyItem.append(dateEl, iconEl, tempEl, windspeedEl, humidityEl);
        resultBodyItem.style.padding = '5px';
        resultBodyItem.style.backgroundColor = 'rebeccapurple';
        resultBodyItem.style.color = 'white';
        resultBodyItem.style.fontSize = '12';

        resultBody.append(resultBodyItem);
    }

    resultBody.style.justifyContent = 'space-between';
    resultBody.style.columnGap = '1rem';
    resultBody.style.rowGap = '1rem';

    resultCard.append(resultBody);
    fiveDaySearchResultsEl.append(resultCard);
}//end of rendering 5-day forecast


renderSearchResults();
renderLocalStorage();
searchBtn.addEventListener("click", handleSearchFormSubmit);
clearBtn.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.clear();
    renderLocalStorage();
});

document.getElementById('errorModal').addEventListener('hide.bs.modal', function (event) {
    location.replace('./index.html');
});