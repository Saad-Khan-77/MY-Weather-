const body = document.querySelector("body");
let search = document.querySelector(".top-container input");
let searchBTN = document.querySelector(".top-container span");
let loader = document.querySelector(".loader-container");

searchBTN.addEventListener("click", () => {
  if (search.value.trim() === "") {
    alert("Enter City Name");
  } else {
    handleSearch();
  }
});

search.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (search.value.trim() === "") {
      alert("Enter City Name");
      return;
    }
    handleSearch();
  }
});

async function getData(cityName) {
  loader.style.display = "block"; // for spinner start

  let ApiKey = "42fa2e32631a99122e7213ee0c22020e";
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${ApiKey}&units=metric`
  );
  let data = await response.json();
  console.log(data);

  loader.style.display = "none"; // for spinner end

  setValue(data);
}

function setValue(data) {
  // for  temperature
  let temp = document.querySelector(".Temperature");
  temp.innerHTML = `${Math.floor(data.main.temp)}<span class="unit">°C</span>`;

  // for weather description
  let description = document.querySelector(".message");
  description.textContent = data.weather[0].description;

  // for humidity
  let humidity = document.querySelector("#humi-number");
  humidity.textContent = `${data.main.humidity}%`;

  // for Wind Spped
  let windSpeed = document.querySelector("#WS-number");
  let windInMs = data.wind.speed; // API se wind speed (m/s me)
  let windInKmh = windInMs * 3.6; // Convert m/s → km/h (multiply by 3.6)
  windSpeed.textContent = `${windInKmh.toFixed(1)} Km/h`;

  // set the city name in placeholer
  search.placeholder =
    data.sys.country === undefined
      ? `⚐ ${data.name}`
      : `⚐ ${data.name}, ${data.sys.country}`;

  //   / ---- ICONS (local SVGs) ----
  const imgEl = document.querySelector(".image-container img");
  imgEl.src = `${"./openweathermap/"}${data.weather[0].icon}.svg`;

  // background
  if (data.main.temp < 0) {
    // Freezing / Snowy ❄️
    body.style.background =
      "linear-gradient(to right, #0f2027, #203a43, #2c5364)";
  } else if (data.main.temp <= 5 && data.main.temp >= 0) {
    // Very Cold 🌨️
    body.style.background = "linear-gradient(to right, #74ebd5, #ACB6E5)";
  } else if (data.main.temp <= 10 && data.main.temp >= 6) {
    // Cold but not freezing 🌬️
    body.style.background = "linear-gradient(to right, #a1c4fd, #c2e9fb)";
  } else if (data.main.temp <= 15 && data.main.temp >= 11) {
    // Cool 🌥️
    body.style.background = "linear-gradient(to right, #89f7fe, #66a6ff)";
  } else if (data.main.temp <= 20 && data.main.temp >= 16) {
    // Pleasant 🌿
    body.style.background = "linear-gradient(to right, #d4fc79, #96e6a1)";
  } else if (data.main.temp <= 25 && data.main.temp >= 21) {
    // Warm 🌤️
    body.style.background = "linear-gradient(to right, #fceabb, #f8b500)";
  } else if (data.main.temp <= 30 && data.main.temp >= 26) {
    // Hot ☀️
    body.style.background = "linear-gradient(to right, #f6d365, #fda085)";
  } else if (data.main.temp <= 35 && data.main.temp >= 31) {
    // Very Hot 🌞
    body.style.background = "linear-gradient(to right, #f093fb, #f5576c)";
  } else if (data.main.temp <= 40 && data.main.temp >= 36) {
    // Scorching 🔥
    body.style.background = "linear-gradient(to right, #ff758c, #ff7eb3)";
  } else if (data.main.temp <= 45 && data.main.temp >= 41) {
    // Extreme Heat 🔥🔥
    body.style.background = "linear-gradient(to right, #ff416c, #ff4b2b)";
  } else if (data.main.temp > 45) {
    // Dangerous Heat 🌋
    body.style.background = "linear-gradient(to right, #e52d27, #b31217)";
  }
}

function handleSearch() {
  // for Animation
  const main = document.querySelector("main");
  main.classList.add("expand");

  let userInput = search.value.toUpperCase().trim();

  getData(userInput)
    .then(() => {
      document.querySelector(".middle-container").classList.remove("hidden");
      document.querySelector(".bottom-container").classList.remove("hidden");
      document.querySelector(".error-container").style.display = "none";
      console.log("It's Working ");
    })
    .catch(() => {
      document.querySelector(".bottom-container").classList.add("hidden");
      document.querySelector(".middle-container").classList.add("hidden");
      document.querySelector(".error-container").style.display = "block";
      body.style.background = "linear-gradient(to right, #7e33ce, #5f95f3)";
      console.log("ERROR: kuch toh gadbad hai");

      // set the city name in placeholer
      search.placeholder = `⚐ Location not found`;
    });

  // Clear the input box after click
  search.value = "";
}
