// The below function essentially only executes the DOM has loaded
$(document).ready(function(){

//Below is declaring variables to be used for coding the weather app
let today = dayjs()

let weatherIconURL = "https://openweathermap.org/img/wn/"
let forecastApiURL = "https://api.openweathermap.org/data/2.5/forecast?"
let apiKey = "&appid=72a9cadaa69ac8f1237715c186517968"
let units = "&units=metric"
let searchString = ""
let queryURL

// below is an empty array which will take in search history from user
let searchHistory = []



// function to display search history in the browser
function renderSearchHistory () {


    $("#history").empty()

    

    for (i = 0; i < searchHistory.length; i++){

        let historyButtons = $("<button>")

        historyButtons.addClass("history-button")

        historyButtons.attr("data-city", searchHistory[i])

        historyButtons.text(searchHistory[i])

        $("#history").append(historyButtons)

    }

}


// the below get saved search history from local storage and displays it in the browser
if (localStorage.getItem("cityName")){
    let initialHistoryArray = JSON.parse(localStorage.getItem("cityName"))
    if (Array.isArray(initialHistoryArray)){
        searchHistory = initialHistoryArray
        renderSearchHistory()
    } 
    } 


// the below function displays current day weather conditions using data requested from the openweather map api. dayJS has also been utilised in this function and it takes in url as a parameter
function renderCurrentDay (url) {

    fetch(url)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            
            let todaysDate = today.format("DD/MM/YYYY")

        
            let todaysWeatherEL = $("<div>")
            todaysWeatherEL.addClass("today-result")
            let cityDateDisplayEl = $("<div>")
            cityDateDisplayEl.addClass("today-date-container")
            let todaysWeatherIconCode = data.list[0].weather[0].icon
            let cityNameEl = $("<h2>")
            cityNameEl.addClass("city-name")
            cityNameEl.text(data.city.name + " " + "(" + todaysDate + ")" + " ")
            let todaysIconDisplayed = $("<img>")
            todaysIconDisplayed.attr({"src": weatherIconURL + todaysWeatherIconCode + ".png", "class": "weather-icon", "alt": "weather icon", "id": "currentDay-icon" })
            let todaysTempEl = $("<p>")
            todaysTempEl.addClass("current-condition")
            todaysTempEl.text("Temp: " + data.list[0].main.temp + " °C")
            let todaysWindEl = $("<p>")
            todaysWindEl.addClass("current-condition")
            todaysWindEl.text("Wind: " + (data.list[0].wind.speed * 3.6).toFixed(2) + " KPH")
            let todaysHumidityEl = $("<p>")
            todaysHumidityEl.addClass("current-condition")
            todaysHumidityEl.text("Humidity: " + data.list[0].main.humidity + "%")

            cityDateDisplayEl.append(cityNameEl, todaysIconDisplayed)
            todaysWeatherEL.append(cityDateDisplayEl, todaysTempEl, todaysWindEl, todaysHumidityEl)
            $("#today").append(todaysWeatherEL)

        })

}

// the below function displays 5 day weather forecast including details of weather conditions using data requested from the openweather map api. dayJS has also been utilised in this function and it takes in url as a parameter

function render5DayForecast (url) {

    fetch(url)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            let weatherForecastData = data.list

            $("#forecast-title").text("5-Day Forecast:")


            for(i = 0; i < weatherForecastData.length; i ++){

                if (weatherForecastData[i].dt_txt.search("09:00:00") != -1){
                    let forecastWeatherEL = $("<div>")
                    forecastWeatherEL.addClass("forecast-container col-xs-2")

                    let forecastDateDisplayEl = $("<h3>")
                    forecastDateDisplayEl.addClass("forecast-date")
                    let forecastDate = weatherForecastData[i].dt_txt
                    const forecastDateArray = forecastDate.split(" ")
                    forecastDate = dayjs(forecastDateArray[0]).format("DD/MM/YYYY")
                    forecastDateDisplayEl.text(forecastDate)

                    let forecastIconCode = weatherForecastData[i].weather[0].icon
                    let forecastIconDisplayed = $("<img>")
                    forecastIconDisplayed.addClass("forecast-icon")
                    forecastIconDisplayed.attr({"src": weatherIconURL + forecastIconCode + ".png", "class": "weather-icon", "alt": "weather icon" })

                    let forecastTempEl = $("<p>")
                    forecastTempEl.addClass("forecast-condition")
                    forecastTempEl.text("Temp: " + weatherForecastData[i].main.temp + " °C")

                    let forecastWindEl = $("<p>")
                    forecastWindEl.addClass("forecast-condition")
                    forecastWindEl.text("Wind: " + (weatherForecastData[i].wind.speed * 3.6).toFixed(2) + " KPH")

                    let forecastHumidityEl = $("<p>")
                    forecastHumidityEl.addClass("forecast-condition")
                    forecastHumidityEl.text("Humidity: " + weatherForecastData[i].main.humidity + "%")

                    forecastWeatherEL.append(forecastDateDisplayEl, forecastIconDisplayed, forecastTempEl, forecastWindEl, forecastHumidityEl)
                    $("#forecast").append(forecastWeatherEL)
                }
            }

        })

}


// the below calls the renderCurrentDay(), render5DayForecast() and the renderSearchHistory() functions once user has inputted a value and clicked the search button.

$("#search-button").on("click", function(event) {
    event.preventDefault()

    $(".search-results").empty()

    searchString = $("#search-input").val().trim()

    if (searchString != ""){
        const searchStringArr = searchString.split(" ")

    if (searchStringArr.length > 1){
        for (i = 0; i < searchStringArr.length; i++) {
            searchStringArr[i] = searchStringArr[i].charAt(0).toUpperCase() + searchStringArr[i].slice(1);
        
        }
    
        const finalSearchString = searchStringArr.join(" ")
        if (!searchHistory.includes(finalSearchString)){searchHistory.push(finalSearchString)}
    } else {
        if(!searchHistory.includes(searchString)){searchHistory.push(searchString.charAt(0).toUpperCase() + searchString.slice(1))}
    }

    
    queryURL = forecastApiURL + "q=" + searchString + apiKey + units

    
    localStorage.setItem("cityName", JSON.stringify(searchHistory))

        
    renderCurrentDay(queryURL)
    render5DayForecast(queryURL)
    renderSearchHistory()
    $(".weather-search").val("")
    }

    
})


// the below function displays weather results for current day and forecast by calling the renderCurrentDay(), render5DayForecast()renderCurrentDay().
function displayWeather (){

    let citySelected = $(this).attr("data-city")

    let cityQueryUrl = forecastApiURL + "q=" + citySelected + apiKey + units


    $(".search-results").empty()
    renderCurrentDay(cityQueryUrl)
    render5DayForecast(cityQueryUrl)

}
    // the below calls the displayWeather finction once search history button is clicked
    $(document).on("click", ".history-button", displayWeather);

   



})