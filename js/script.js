var root = document.querySelector("#root");
var searchBar = document.querySelector("#searchbar");
var cityName = ""
var dropdown = document.querySelector('.dropdown');
var foundLocations = [];
var fetchCityContent = {}

// fetch all city data

const fetchAllCities = async () => {
    var fetchCity = await fetch('https://countriesnow.space/api/v0.1/countries')
    fetchCityContent = await fetchCity.json();
    // console.log('fetchCityContent: ',fetchCityContent);
}
fetchAllCities()

// fetch Pexel images and update body background

var fetchImage = async (selectedCountry) => {
    var imageResponse = await fetch(`https://api.pexels.com/v1/search?query=${selectedCountry}`, {
        headers: { 'Authorization': '563492ad6f91700001000001db09f2c3ac4e4d88b42ba73ba3e0e687' }
    })
    var gottenImage = await imageResponse.json()
    
    var body = document.querySelector('#backgroundHolder');
    body.style.background = `url(${gottenImage.photos[0].src.landscape})`
    body.style.backgroundPosition = 'center'
    body.style.backgroundRepeat = 'no-repeat'
    body.style.backgroundSize = 'cover'

}

// fetch weather data and update cardContainer w details

var showInfos = async (event) => {
    var selectedCity = foundLocations[event.target.getAttribute("value")].city;
    var selectedCountry = foundLocations[event.target.getAttribute("value")].country;
     
    var fetchWeather = await fetch(`https://api.weatherapi.com/v1/current.json?key=e6be19e096224376bf9100012221909&q=${foundLocations[event.target.getAttribute("value")].city}+${foundLocations[event.target.getAttribute("value")].country}&lang=hu`)
    var fetchWeatherContent = await fetchWeather.json();
    console.log(fetchWeatherContent);
    searchBar.value = foundLocations[event.target.getAttribute("value")].city + ", " + foundLocations[event.target.getAttribute("value")].country;
    fetchImage(selectedCountry)
    var cardContainer = document.querySelector('#card-container');
    var cardCity = document.getElementById('card-city')
    var cardIcon = document.getElementById('card-icon')
    var cardIconText = document.getElementById('card-icon-text')
    var cardTemp = document.getElementById('card-temp')
    var cardDate = document.getElementById('card-date')
    cardCity.textContent = selectedCity;
    // console.log(`${fetchWeatherContent.current.condition.icon.slice(2, fetchWeatherContent.current.condition.length)}`);
    var iconLink = `http://${fetchWeatherContent.current.condition.icon.slice(2, fetchWeatherContent.current.condition.length)}`
    cardIcon.setAttribute('src', iconLink)
    cardIconText.textContent = fetchWeatherContent.current.condition.text
    cardTemp.textContent = fetchWeatherContent.current.temp_c + '°C';
    cardDate.textContent = `Last updated: ${fetchWeatherContent.current.last_updated}`;

    cardContainer.style.display = "flex";
}


// find locations for dropdown from fetched (all cities) data using input from searchBar

const cityFinder = () => {
    if (cityName.includes(' ')){
        var tempArr =[]
        for (var i=0; i<cityName.length; i++){
            tempArr.push(cityName[i])
        }
        for (var i=0; i<tempArr.length; i++){
            if (tempArr[i]=== ' '){
                tempArr[i+1] = tempArr[i+1].toUpperCase()
            }
        }
        cityName = ''
        for (var i=0; i< tempArr.length; i++){
            cityName += tempArr[i]
        }
        console.log('cityName: ', cityName);
    }
    foundLocations = [];

    for (let i = 0; i < fetchCityContent.data.length; i++) {
        for (let j = 0; j < fetchCityContent.data[i].cities.length; j++) {
            if (fetchCityContent.data[i].cities[j].startsWith(cityName)) {

                var cityMatch = fetchCityContent.data[i].cities[j];
                var countryMatch = fetchCityContent.data[i].country;
                foundLocations.push({ city: `${cityMatch}`, country: `${countryMatch}` });
            }
        }
    }
    // console.log(foundLocations);
    return divGenerator();
}

// create dropdown list based on cityFinder results

const divGenerator = async () => {
    dropdown.innerHTML = "";
    for (let i = 0; i < foundLocations.length; i++) {
        var divTemplate = document.createElement("div");
        divTemplate.classList.add("match");
        divTemplate.setAttribute("value", i);
        divTemplate.innerHTML = `${foundLocations[i].city}, ${foundLocations[i].country}`;
        divTemplate.addEventListener("click", showInfos);
        divTemplate.addEventListener("click", () => { dropdown.style.display = 'none' });
        dropdown.appendChild(divTemplate)
    }
}

// check searchBar input (3+ chars) and pass it towards cityFinder

const searchCity = () => {
    if (searchBar.value.length >= 3) {
        dropdown.style.display = "flex";
        dropdown.style.flexDirection = "column";
        dropdown.style.zIndex = 11
        cityName = searchBar.value.charAt(0).toUpperCase() + searchBar.value.slice(1, searchBar.value.length);
        cityFinder();
    } else {
        dropdown.style.display = "none";
    }
}

searchBar.addEventListener("input", searchCity);


// searchBar.addEventListener("keypress", (event) => {
//     if (event.key == "Enter") {
//         showInfos();
//     } else if (event.keycode == "Space") {

//         for (let i = 0; i < searchBar.value.length; i++) {
//             if (i == ' ') {
//                 searchBar.value.charAt(i + 1).toUpperCase();
//                 // console.log("sajt");
//             }
//         }
//     }
// });



