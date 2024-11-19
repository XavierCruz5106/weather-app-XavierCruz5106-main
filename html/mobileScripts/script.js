let hamburger = document.getElementsByClassName("hamburger-container")[0];

let search = document.getElementsByClassName("search-icon")[0];
let searchBar = document.getElementsByClassName("search-bar")[0];
let input = document.getElementById("search-bar");

let checkmark = document.getElementsByClassName("checkmark")[0];
let closemark = document.getElementsByClassName("closemark")[0];

checkmark.addEventListener("click", changeUnits);
closemark.addEventListener("click", closeSettings);
hamburger.addEventListener("click", showSettings);

function closeSettings() {
  let settings = document.getElementsByClassName("settings-form")[0];
  settings.style = "display: none";
  let app = document.getElementsByClassName("app")[0];
  app.style = "display: block";
}

function showSettings() {
  let settings = document.getElementsByClassName("settings-form")[0];
  settings.style = "display: inline-flex";
  let app = document.getElementsByClassName("app")[0];
  app.style = "display: none";
}

search.addEventListener("click", expandBar);

function expandBar() {
  searchBar.classList.toggle("closed");
  if (searchBar.classList.contains("closed") && input.value !== "") {
    showPosition(input.value);
  }
  input.value = "";
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
  let measurement = document.getElementById("meas");

  let maxTempValues = document.getElementsByClassName("value-max");
  let minTempValues = document.getElementsByClassName("value-min");

  let settingUnits = document.getElementById("units");

  let selectedUnit = settingUnits.options[settingUnits.selectedIndex].value;

  let postUnits = document.getElementsByClassName("unit")[0];

  // when user changes to metric
  if (selectedUnit == "Metric" && !changed) {
    changed = true;

    measurement.innerHTML = "C";

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

    measurement.innerHTML = "F";

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

  console.log(name);

  let location = await getCoordsFromNames(name);

  if (location == 404) {
    // open the search bar again.
    searchBar.classList.toggle("closed");


    // add the place where it errored to the search bar again.
    input.value = name;

    // do some things with the error box
    alert("Invalid Place");
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
  let stateName = location.state;

  console.log(location);

  if (stateName === undefined) {
    stateName = location.city;
  }

  if (stateName === undefined) {
    stateName = location.county;
  }

  if (stateName === undefined) {
    stateName = location.country;
  }

  let todaytempf = Math.round(data.currentConditions.temp);

  let todaysTemp = document.getElementsByClassName("value")[0];

  todaysTemp.innerHTML = todaytempf;

  var d = new Date();
  var day = d.getDate();
  var dayName = d.toString().split(" ")[0];
  var month = d.toLocaleString("default", { month: "long" });

  let todaysDateElement = document.getElementsByClassName("date")[0];

  let todaysDate = todaysDateElement.getElementsByTagName("p")[1];
  console.log(todaysDate);


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

  let place = document.getElementById("place");
  console.log("PLACE: " + place);
  console.log("NAME: " + stateName)

  place.innerHTML = stateName;

  let maxtemp = document.getElementsByClassName("value-max");
  let mintemp = document.getElementsByClassName("value-min");
  let icons = document.getElementsByClassName("weatherimg");
  let status = document.getElementsByClassName("status");
  let currentCondition = document.getElementById("condition");
  currentCondition.innerHTML = data.currentConditions.conditions;

  for (let i = 0; i < maxtemp.length; i++) {
    maxtemp[i].innerHTML = Math.round(data.days[i].tempmax);
    mintemp[i].innerHTML = Math.round(data.days[i].tempmin);

    icons[i].src = `WeatherIcons/${data.days[i].icon}.svg`;
    status[i].innerHTML = data.days[i].conditions;
  }

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
      document.body.style.backgroundImage = `url('../images/Mobile/${iconPic}.jpg')`;
    }
  });
}

function redirectBasedOnViewport() {
  console.log(window.innerWidth);
  if (window.innerWidth > 600) {
    window.location.href = "../index.html";
  }
}

redirectBasedOnViewport(); // Check on page load

window.addEventListener("resize", redirectBasedOnViewport); // Check on resize


getLocation();