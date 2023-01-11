var apiKey = 'b08765019bb00fec232c2ee01f244d3b';

var searchButton = document.getElementById('search-button');

function getApi(longitude, latitude) {
    let requestUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat='+ 
    latitude +'&lon='+ longitude +'&units=imperial&appid='+ apiKey;
    fetch(requestUrl) 
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        writeCurrentData(data);
    });
};

searchButton.addEventListener('click', function(event){
    event.preventDefault();
    // get textbox val and assign it to a variable and remove any spaces
    let location = document.getElementById('text-box').value;
    alert(location);
    // call function that transaltes location into long/lat
    longLatTranslation(location);
    saveHistory(location);
});

function displayCity(data){
    document.getElementById('city-name').textContent = data;
}

function longLatTranslation(location) {
    let translatorUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+ location +'&limit=2&appid=' + apiKey;
    fetch(translatorUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let longitude = data[0].lon;
        let latitude = data[0].lat;

        getApi(longitude, latitude);
        displayCity(location);
    });

};

function writeCurrentData(data) {
    document.getElementById('temp').textContent = data.current.temp + '°F';
    document.getElementById('cloud-cover').textContent = data.current.clouds + '% Cloud Cover';
    document.getElementById('wind').textContent = data.current.wind_speed + ' Mph Winds';
    document.getElementById('humidity').textContent = data.current.humidity + '% Humidity';
    // for loop for the daily weather
    for (let i = 1; i < 6; i++) {
        let container = document.getElementById('day' + i);
        container.getElementsByClassName('date')[0].textContent = moment.unix(data.daily[i].dt).format('dddd, MMM Do');
        container.getElementsByClassName('cloud-cover')[0].textContent = data.daily[i].clouds + '% Cloud Cover';
        container.getElementsByClassName('temp')[0].textContent = data.daily[i].temp.day + '°F';
        container.getElementsByClassName('wind')[0].textContent = data.daily[i].wind_speed + ' mph Winds';
        container.getElementsByClassName('humidity')[0].textContent = data.daily[i].humidity + '% Humidity';
    };
};

function saveHistory(location) {
    let contentBox = document.getElementById('search-history');
    contentBox.appendChild(createMenuItem(location));
};

function createMenuItem(name) {
    let p = document.createElement('input');
    p.value = name;
    p.type = 'submit';
    p.classList.add('history-button');
    return p;
};

document.addEventListener('click', function() {
    let clicked = document.activeElement;
    if (clicked.classList.contains('history-button')){
        historyButton(clicked.value);
    } else {
        return;
    };
});

function historyButton(data) {
    document.getElementById('text-box').value = data;
    longLatTranslation(data);
};