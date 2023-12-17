$(document).ready(function(){

let today = dayjs()

let weatherIconURL = "https://openweathermap.org/img/wn/"
let forecastApiURL = "https://api.openweathermap.org/data/2.5/forecast?"
let apiKey = "&appid=72a9cadaa69ac8f1237715c186517968"
let units = "&units=metric"
let searchString = ""
let queryURL

$("#search-button").on("click", function(event) {
event.preventDefault()
searchString = $(".weather-search").val().trim()
queryURL = forecastApiURL + "q=" + searchString + apiKey + units

fetch(queryURL)
.then(function (response) {
    return response.json()
}).then(function (data) {
    console.log(data)
    let weatherForecastData = data.list
    
    let todaysDate = today.format("DD/MM/YYYY")

    $("#today").empty()
    let todaysWeatherEL = $("<div>")
    let cityDateDisplayEl = $("<div>")
    let todaysWeatherIconCode = data.list[0].weather[0].icon
    let cityNameEl = $("<h2>")
    cityNameEl.text(searchString + " " + "(" + todaysDate + ")" + " ")
    let todaysIconDisplayed = $("<img>")
    todaysIconDisplayed.attr({"src": weatherIconURL + todaysWeatherIconCode + ".png", "class": "weather-icon", "alt": "weather icon" })
    // let todaysDateEl = ("<span>")
    // todaysDateEl.text(todaysDate)
    let todaysTempEl = $("<p>")
    todaysTempEl.text("Temp: " + data.list[0].main.temp)
    let todaysWindEl = $("<p>")
    todaysWindEl.text("Wind: " + (data.list[0].wind.speed * 3.6).toFixed(2) + " KPH")
    let todaysHumidityEl = $("<p>")
    todaysHumidityEl.text("Humidity: " + data.list[0].main.humidity + "%")

    cityDateDisplayEl.append(cityNameEl, todaysIconDisplayed)
    todaysWeatherEL.append(cityDateDisplayEl, todaysTempEl, todaysWindEl, todaysHumidityEl)
    $("#today").append(todaysWeatherEL)

    $("#forecast-title").text("5-Day Forecast:")

    for(i = 8; i < weatherForecastData.length; i + 8){
    
    }

})

})













})