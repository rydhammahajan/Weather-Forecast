{
    
    let searchBox = document.querySelector("input") ; 
    console.log(searchBox) ;
    let cityName = document.querySelector(".city") ; 
    let countryName =  document.querySelector(".country") ;
    let temperature = document.querySelector(".temperature-celcius") ; 
    let temperatureCondition = document.querySelector(".temperature-condition") ; 
    let temperatureImage = document.querySelector(".temperature-image");
    let pressure = document.querySelector(".pressure-value") ; 
    let visibility = document.querySelector(".visibility-value") ; 
    let humidity = document.querySelector(".humidity-value") ;
    let sunrise =  document.querySelector(".sunrise-time") ;
    let sunset =  document.querySelector(".sunset-time") ;
    let uviValue = document.querySelector(".uvi-value") ; 
    let uviDesc = document.querySelector(".uvi-description") ; 
    let row1 = document.querySelector(".scroll-row1") ;
    let row2 = document.querySelector(".scroll-row2") ;
    let forecastContainer = document.querySelector(".forecast-each-day")
    let todayDate = document.querySelector(".date") ;
    let clock = document.querySelector(".clock") ; 
    let location = "Gurdaspur"

    const weekday = ["Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"]

    var api_url ;
    var data ; 

    makeAPIcall() ;
    searchBox.addEventListener("keyup" ,function(){
        location = searchBox.value ; 
        makeAPIcall() ;
    }) ;
    
    async function makeAPIcall() {


        console.log("Hello") ;
        api_url = `https://api.weatherapi.com/v1/forecast.json?key=c01c5f188bb142f9846165125231304&q=${location}&days=8&aqi=yes&alerts=no`
      
        // Making an API call (request)
        // and getting the response back
        const response = await fetch(api_url);
        // Parsing it to JSON format
        data = await response.json();

        // console.log(data);
        updateCityCountry() ; 
        updateCurrentTemperatureDetails();
        updateSunriseSunsetUV();
        updateHourlyWeather();
        updateForecast();

    }

    function updateCityCountry(){
        cityName.innerText = data["location"]["name"] ;
        countryName.innerText = data["location"]["country"] ; 
    }

    function updateCurrentTemperatureDetails(){
        temperature.innerText = data["current"]["temp_c"] ; 
        temperatureCondition.innerText = data["current"]["condition"]["text"] ; 
        temperatureImage.src = data["current"]["condition"]["icon"] ;
        pressure.innerText =  data["current"]["pressure_mb"] + " mb"; 
        visibility.innerText = data["current"]["vis_km"] + " km"; 
        humidity.innerText = data["current"]["humidity"] + "%";
         
    }

    function updateSunriseSunsetUV(){
        let desc = "" ; 
        sunrise.innerText = data["forecast"]["forecastday"][0]["astro"]["sunrise"] ;
        sunset.innerText = data["forecast"]["forecastday"][0]["astro"]["sunset"] ;
        uviValue.innerText = data["forecast"]["forecastday"][0]["day"]["uv"];

        if(uviValue.innerText < 3) {
            desc = "Low risk of UV rays";
        }else if(uviValue.innerText < 6) {
            desc = "Moderate risk of UV rays";
        }
        else if(uviValue.innerText < 8) {
            desc = "High risk of UV rays";
        }else if(uviValue.innerText < 11) {
            desc = "Very High risk of UV rays";
        }else{
            desc = "Extreme risk of UV rays";
        }

        uviDesc.innerText = desc ;
    }

    function updateHourlyWeather(){

        row1.innerHTML = "" ;
        row2.innerHTML = "" ;
        let hourArray = data["forecast"]["forecastday"][0]["hour"] ; 
        console.log(hourArray) ;
        for (let i in  hourArray) {

            let hourElement = document.createElement("div") ; 
            let time = hourArray[i]["time"].split(" ")[1] ;
            let src = hourArray[i]["condition"]["icon"] ; 
            let temperature = hourArray[i]["temp_c"] ; 
            let am_pm = i<12? "am" : "pm" ; 
            console.log(time) ;
            hourElement.innerHTML = 
            `
            <div class = "single-hour-detail d-flex flex-column py-2 px-3 justify-content-center align-items-center fs-5 bg-light border-radius">
            
            <span class = "single-hour-time fs-6">${time}${am_pm}</span>
            <span class = "single-hour-temp-image"><img src = ${src}></span>
            <span class = "single-hour-temperature">${temperature}</span>
                
            </div>
            
            `
            if(i<12)row1.appendChild(hourElement) ;
            else row2.appendChild(hourElement) ;
            
        }

    }

    function updateForecast(){

        forecastContainer.innerHTML =  "" ;
        let forecastArray = data["forecast"]["forecastday"] ; 

        /*Setting up current date*/
        const currentDate = forecastArray[0]["date"] ; 
        const dateObject = new Date(currentDate).toLocaleDateString('en-us', { day:"numeric" ,year:"numeric", month:"short", weekday: "long"}) ;

        /*Setting up Current time*/
        clock.innerText = ((data["location"]["localtime"]).split(" "))[1] ;

        todayDate.innerText = dateObject ; 
                 
        for(let i=1 ; i<=7 ; i++) {

            let forecastElement = document.createElement("div") ;

            let forecastDate = forecastArray[i]["date"]
            const d = new Date(forecastDate);
            let date = d.getDate();
            let day = weekday[d.getDay()]  ; 
            
            let forecastWeather = forecastArray[i]["day"]["condition"]["text"] ; 
            let forecastImageSrc = forecastArray[i]["day"]["condition"]["icon"]
            let minTemp = forecastArray[i]["day"]["mintemp_c"]
            let maxTemp = forecastArray[i]["day"]["maxtemp_c"]

            forecastElement.innerHTML = 

            `
            <div class = "d-flex flex-column p-4 white-background border-radius ">
                <span class = "fs-5 blue-color h1">${day}, ${date} </span>
                <div class = "d-flex justify-content-between py-2 gap-2" >
                    <img src = ${forecastImageSrc} height = "50px">
                    <span class = "fs-4 blue-color h1 ">${forecastWeather}</span>
                </div>
                <span class = "h1 fs-6">Temperature in Celcius: </span>
                <div class = "blue-color">Min temp : ${minTemp}</div>
                <div class = "blue-color">Max temp : ${maxTemp}</div>
            </div>
            
            `

            forecastContainer.appendChild(forecastElement) ;


        }


    }


}