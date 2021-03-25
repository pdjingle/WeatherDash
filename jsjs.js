// / /Variable declaired and city is searched and stored
var city = "";
var searchCity = $("#search-city");
var currentUvindex = $("#uv-index");
var searchButton = $("#search-button");
var currentTemperature = $("#temperature");
var clearButton = $("#clear-history");
var currentWSpeed = $("#wind-speed");
var currentCity = $("#current-city");
var currentHumidty = $("#humidity");
var sCity = [];

$(document).ready(function(){
//The search function to find out if the city is within the database 
function find(c) {
    for (var i = 0; i < sCity.length; i++) {
        if (c.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
    return 1;
}

//The API Key for openweathermap.org
var APIKey = "09a9fa34ecb1a338aa6268b7deee03e8";

// Display the curent and future weather to the user after grabing the city form the input text box.
function displayWeather(event) {
    debugger
    event.preventDefault();
    console.log("I am here")
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}
function currentWeather(city) {
    // The function to call the current weather in the desired location 
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {



        // Display following: City, current weather, date and a weather icon
        console.log(response);


        //Date format 
        var date = new Date(response.dt * 1000).toLocaleDateString();

        //Name of city and date
        $(currentCity).html(response.name + "(" + date + ")");

        //  display the current temperature with the conversion to fahrenheit 

        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2));

        // Current Humidity
        $(currentHumidty).html(response.main.humidity + "%");

        //Display MPH Wind Speed Conversion 
        var ws = response.wind.speed;
        var windsmph = (ws * 2.237).toFixed(1);
        $(currentWSpeed).html(windsmph + "MPH");

        // Display UVIndex.
        UVIndex(response.coord.lon, response.coord.lat);
        forecast(response.id);
        if (response.cod == 200) {
            sCity = JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity == null) {
                sCity = [];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname", JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if (find(city) > 0) {
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname", JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}
// UV Index using String Template Literals, I think
function UVIndex(lon, lat) {
    var queryURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        // response data to get the result 
    })

}

// Here we display the 5 days forecast for the current city.
function forecast(cityid) {
    var dayover = false;
    var queryforcastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + APIKey;
    $.ajax({
        url: queryforcastURL,
        method: "GET"
    }).then(function (response) {

        for (i = 0; i < 5; i++) {
            var date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            var tempK = response.list[((i + 1) * 8) - 1].main.temp;
            var tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
            var humidity = response.list[((i + 1) * 8) - 1].main.humidity;

            $("#fDate" + i).html(date);
            $("#fImg" + i).html("<img src=" + iconurl + ">");
            $("#fTemp" + i).html(tempF);
            $("#fHumidity" + i).html(humidity + "%");
        }

    });
}

//Past city search data below search box 
function addToList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
}
// Past searched cities 
function invokePastSearch(event) {
    console.log("I am here")
    var liEl = event.target;
    if (event.target.matches("li")) {
        city = liEl.textContent.trim();
        currentWeather(city);
    }

}

// Last load city function
function loadlastCity() {
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if (sCity !== null) {
        sCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < sCity.length; i++) {
            addToList(sCity[i]);
        }
        city = sCity[i - 1];
        currentWeather(city);
    }

}
//Clear the search history from the page
function clearHistory(event) {
    event.preventDefault();
    console.log("I am here")
    sCity = [];
    localStorage.removeItem("cityname");
    document.location.reload();
}
//Clicky buttons 

$("#search-button").on("click", function (){
    event.preventDefault();
    console.log(searchCity)
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
});
$(".list-group").on("click", invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-history").on("click", clearHistory);
})