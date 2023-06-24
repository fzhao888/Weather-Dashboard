//get cityname from form input
//get lat and lon using https://api.openweathermap.org/data/2.5/weather?q=cityname&appid=764671b721b30354fb8205614f3a38ac
//get current forecast and 5-day forecast
//save data to local storage
//display weather data
//display previously searched

let searchBtn = document.getElementById('search');
let previousResultsEl = document.querySelector('.previous-results');
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




renderLocalStorage();
searchBtn.addEventListener("click", handleSearchFormSubmit);