//SUNNY COLOR FFD88A

let hamburger = document.getElementsByClassName("hamburger-container")[0];


hamburger.addEventListener("click", showSettings);

/*

let todaytempf;
let todaytempc; // do conversion

let pressureIn;
let pressureMb; // do pressure conversion

let windSpeedMPH;
let windSpeedKPH; // do windSpeed conversion
*/

let checkmark = document.getElementsByClassName("checkmark")[0];
let closemark = document.getElementsByClassName("closemark")[0];

checkmark.addEventListener("click", changeUnits);
closemark.addEventListener("click", closeSettings);

let search = document.getElementsByClassName("search-icon")[0];
let searchBar = document.getElementsByClassName("search-bar")[0];
let input = document.getElementById("search-bar");

let weatherAppLeft = document.getElementsByClassName("weatherapp-left")[0];

search.addEventListener("click", expandBar);

function expandBar() {
  searchBar.classList.toggle("closed");
  if (searchBar.classList.contains("closed") && input.value !== "") {
    showPosition(input.value);
  }
  input.value = "";
  weatherAppLeft.classList.toggle("closed");
  if (searchBar.classList.contains("closed")) {
    weatherAppLeft.style = "transition-duration: 1.2s";
    searchBar.style = "transition-duration: 1.2s";
  } else {
    weatherAppLeft.style = "transition-duration: 2s";
    searchBar.style = "transition-duration: 2s";
  }
  /*
  if (searchBar.classList.contains("closed")){
    weatherAppLeft.style = "width: 237.438px";
  } else {
    weatherAppLeft.style = "width: 270px";
  }
  */
}

let changed = false;

function changeUnits() {
  // temperature values
  let values = document.getElementsByClassName("value");

  let maxTempValues = document.getElementsByClassName("value-max");
  let minTempValues = document.getElementsByClassName("value-min");

  let settingUnits = document.getElementById("units");

  let selectedUnit = settingUnits.options[settingUnits.selectedIndex].value;

  let postUnits = document.getElementsByClassName("unit")[0];

  // when user changes to metric
  if (selectedUnit == "Metric" && !changed) {
    changed = true;

    //measurement units

    //0.6213711922

    console.log(values);
    let unitMPH = Number(values[1].innerHTML);

    let unitKPH = unitMPH * 1.609344;

    values[1].innerHTML = Math.round(unitKPH);

    console.log(postUnits);

    console.log(unitKPH);

    postUnits.innerHTML = "km/h";

    let ftemp = Number(values[0].innerHTML);
    let ctemp = (ftemp - 32) / 1.8;

    values[0].innerHTML = Math.round(ctemp);

    for (let i = 0; i < maxTempValues.length; i++) {
      //exclude inches value and mph value;
      let Maxftemp = Number(maxTempValues[i].innerHTML);
      let Minftemp = Number(minTempValues[i].innerHTML);

      let Maxctemp = (Maxftemp - 32) / 1.8;
      let Minctemp = (Minftemp - 32) / 1.8;

      maxTempValues[i].innerHTML = Math.round(Maxctemp);
      minTempValues[i].innerHTML = Math.round(Minctemp);
    }
  }

  if (selectedUnit == "Imperial" && changed) {
    changed = false;

    let unitKPH = Number(values[1].innerHTML);

    let unitMPH = unitKPH * 0.6213711922;

    values[1].innerHTML = Math.round(unitMPH);

    console.log(postUnits);

    console.log(unitMPH);

    postUnits.innerHTML = "mi/h";

    let ctemp = Number(values[0].innerHTML);
    let ftemp = ctemp * 1.8 + 32;

    values[0].innerHTML = Math.round(ftemp);

    for (let i = 0; i < maxTempValues.length; i++) {
      let Maxctemp = Number(maxTempValues[i].innerHTML);
      let Minctemp = Number(minTempValues[i].innerHTML);

      let Maxftemp = Maxctemp * 1.8 + 32;
      let Minftemp = Minctemp * 1.8 + 32;

      maxTempValues[i].innerHTML = Math.round(Maxftemp);
      minTempValues[i].innerHTML = Math.round(Minftemp);
    }
  }
  closeSettings();
}

function closeSettings() {
  let settings = document.getElementsByClassName("settings-form")[0];
  settings.style = "display: none";
  let app = document.getElementsByClassName("app")[0];
  app.style = "display: inline-flex";
}

function showSettings() {
  let settings = document.getElementsByClassName("settings-form")[0];
  settings.style = "display: inline-flex";
  let app = document.getElementsByClassName("app")[0];
  app.style = "display: none";
}

async function fetchForecast(location) {
  let startTime = handleMidWeek(new Date());
  let endTime = new Date(startTime);
  let key = "DE4F43CA98WU6HFGAXR8VSEBC";

  endTime.setDate(startTime.getDate() + 6);

  let startTimeStr = `${startTime.getFullYear()}-${
    startTime.getMonth() + 1
  }-${startTime.getDate()}`;
  let endTimeStr = `${endTime.getFullYear()}-${
    endTime.getMonth() + 1
  }-${endTime.getDate()}`;

  //F, MILES -> US; C, KM -> METRIC
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${startTimeStr}/${endTimeStr}?unitGroup=us&include=days%2Ccurrent&key=${key}&contentType=json`
  );
  let data = await response.json();

  return data;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPositionBrowser);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

async function getCoordsFromNames(countryName) {
  // Have countryName equal list item
  const response = await fetch(
    `https://us1.locationiq.com/v1/search?key=pk.3d27b6005fea0aaf2afbbf30cf6d7e0d&q=${countryName}&format=json&`
  );
  let data;
  if (response.status == 404) {
    data = 404;
  } else {
    data = await response.json();
  }
  return data;
}

async function getNamesFromCoords(coords) {
  let lat = coords.split(",")[0];
  let lon = coords.split(",")[1];

  const response = await fetch(
    `https://us1.locationiq.com/v1/reverse?key=pk.3d27b6005fea0aaf2afbbf30cf6d7e0d&lat=${lat}&lon=${lon}&zoom=9&format=json&`
  );
  let data = await response.json();

  return data.address;
}

//let coords = "51.1638175,10.4478313";

//getNamesFromCoords(coords);

async function showPositionBrowser(position) {
  let location = position.coords.latitude + "," + position.coords.longitude;
  console.log(location);

  let data = await fetchForecast(location);

  let names = await getNamesFromCoords(location);
  console.log(names);
  console.log(data);
  populateInformation(data, names);
}

async function showPosition(name) {
  let errorbox = document.getElementsByClassName("errorbox")[0];

  errorbox.style = "display: hidden";

  console.log(name);

  let location = await getCoordsFromNames(name);

  if (location == 404) {
    // open the search bar again.
    searchBar.classList.toggle("closed");

    // expand the weather app left again.
    weatherAppLeft.classList.toggle("closed");

    // add the place where it errored to the search bar again.
    input.value = name;

    // do some things with the error box
    errorbox.style = "display: block";
  } else {
    console.log(location);
    let coords = location[0].lat + "," + location[0].lon;

    let data = await fetchForecast(coords);
    let names = await getNamesFromCoords(coords);
    console.log(data);
    populateInformation(data, names);
  }
}

async function populateInformation(data, location) {
  let countryName = location.country;
  let stateName = location.state;

  console.log(location);

  if (stateName === undefined) {
    stateName = location.city;
  }

  if (stateName === undefined) {
    stateName = location.county;
  }

  let todaytempf = Math.round(data.currentConditions.temp);

  let todaysTemp = document.getElementsByClassName("value")[0];

  //TODO: Add switch temp button
  todaysTemp.innerHTML = todaytempf;

  var d = new Date();
  var day = d.getDate();
  var dayName = d.toString().split(" ")[0];
  var month = d.toLocaleString("default", { month: "long" });

  let todaysDateElement = document.getElementsByClassName("date")[0];

  let todaysDate = todaysDateElement.getElementsByTagName("p")[0];

  todaysDate.innerHTML = `${dayName}, <br>${day} ${month}`;

  let airInfo = document.getElementsByClassName("air");
  let values = document.getElementsByClassName("value");
  let units = document.getElementsByClassName("unit");

  let pressure = airInfo[0];
  let humidity = airInfo[1];
  let windSpeed = airInfo[2];

  let pressureIn = data.currentConditions.pressure;
  let windSpeedMPH = data.currentConditions.windspeed;

  pressure.innerHTML = pressureIn + " mb";
  humidity.innerHTML = data.currentConditions.humidity + "%";
  //windSpeed.innerHTML = "<br>";
  values[1].innerHTML = windSpeedMPH;
  units.innerHTML = "mi/h";

  let city = document.getElementById("city");
  let country = document.getElementById("country");

  city.innerHTML = stateName;
  country.innerHTML = countryName;

  let maxtemp = document.getElementsByClassName("value-max");
  let mintemp = document.getElementsByClassName("value-min");
  let icons = document.getElementsByClassName("weatherimg");
  let status = document.getElementsByClassName("status");

  for (let i = 0; i < maxtemp.length; i++) {
    maxtemp[i].innerHTML = Math.round(data.days[i].tempmax);
    mintemp[i].innerHTML = Math.round(data.days[i].tempmin);

    icons[i].src = `icons/WeatherIcons/${data.days[i].icon}.svg`;
    status[i].innerHTML = data.days[i].conditions;
  }

  let currentWeatherIcon =
    document.getElementsByClassName("current-weatherimg")[0];
  currentWeatherIcon.src = `icons/WeatherIcons/${data.currentConditions.icon}.svg`;

  changeBG(data.currentConditions.icon);
}

function handleMidWeek(date) {
  date = new Date();
  var dayNum = date.getDay();
  // get start of the week
  for (let i = 0; i < dayNum; i++) {
    if (dayNum == 1) {
      break;
    }
    var newDate = date.getDate() - 1;
    date.setDate(newDate);
  }

  return date;
}

function changeBG(icon) {
  var w = window.innerWidth;

  console.log(w);

  const isBig = w >= 2560;
  const weatherIcons = [
    "cloud",
    "snow",
    "clear",
    "rain",
    "thunder",
    "hail",
    "fog",
    "wind",
    "sleet",
  ];
  weatherIcons.forEach((iconPic) => {
    if (icon.includes(iconPic)) {
      document.body.style.backgroundImage = `url('../images/${iconPic}${
        isBig ? "Big" : ""
      }.jpg')`;
    }
  });
}

function redirectBasedOnViewport() {
  if (window.innerWidth <= 600) {
    window.location.href = "html/mobile.html";
  }
}

redirectBasedOnViewport(); // Check on page load

window.addEventListener("resize", redirectBasedOnViewport); // Check on resize

getLocation();
