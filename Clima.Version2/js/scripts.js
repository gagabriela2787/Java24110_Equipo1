let fecha = new Date();
let horaActual = fecha.getHours();

let header = `
<nav class="main-nav">
<div id="toggle-menu" class="toggle-menu">
  <label for="toggle-menu-checkbox">
    <img src="./images/hamburguer-icon.png" alt="ocultar menu" />
  </label>
</div>
<input
  type="checkbox"
  class="toggle-menu__checkbox"
  id="toggle-menu-checkbox"
/>
<ul id="main-menu" class="main-menu">
  <li class="main-menu__item">
    <a href="index.html" class="main-menu__link">Hoy</a>
  </li>
  <li class="main-menu__item">
    <a href="#section3" class="main-menu__link">5 días</a>
  </li>
  <li class="main-menu__item">
    <a href="#section4" class="main-menu__link">Calidad del aire</a>
  </li>
  <li class="main-menu__item">

  <div class="brand">
  <a>CaCClima</a>
</div>
  
</li>
 
</ul>
</nav>
`;
document.getElementById("idHeader").innerHTML = header;

/* convierte la primera letra de la oración a mayúscula*/
const toSentenceCase = str => {
  const s =
    str &&
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .join(' ');
  return s.slice(0, 1).toUpperCase() + s.slice(1);
};


const toggleMenuElement = document.getElementById("toggle-menu");
const mainMenuElement = document.getElementById("main-menu");

toggleMenuElement.addEventListener("click", () => {
  mainMenuElement.classList.toggle("main-menu--show");
});

const APP_ID = "4090239d69cdb3874de692fd18539299";

const fetchData = (position) => {
  const {latitude, longitude} = position.coords;
  fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=es&units=metric&appid=${APP_ID}`
    )
    .then((response) => response.json())
    .then((data) => setWeatherData(data));
};

const setWeatherData = (data) => {
  const weatherData = {
    location: data.name,
    description: toSentenceCase(data.weather[0].description),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    temperature: Math.floor(data.main.temp),
    date: getDate(),
    min: Math.floor(data.main.temp_min),
    max: Math.floor(data.main.temp_max),
    sensacion: Math.floor(data.main.feels_like),
    visibility: data.visibility,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg //Wind direction, degrees
  };

  let iconCode = data.weather[0].icon;

  document.getElementById("description").textContent = weatherData.description;
  document.getElementById("temperature").textContent = weatherData.temperature;
  document.getElementById("sensacion").textContent = weatherData.sensacion;
  document.getElementById("maximos").textContent = weatherData.max + "º/" + weatherData.min + "º";
  document.getElementById("humedad").textContent = weatherData.humidity + "%";
  document.getElementById("presion").textContent = weatherData.pressure + " hPa";
  document.getElementById("viento").textContent = weatherData.windSpeed + " m/s";
 
  // Object.keys(weatherData).forEach((key) => {
  //   setTextContent(key, weatherData[key]);
  // });

  const ubicacion = [...document.querySelectorAll(".ubicacion")];
  ubicacion.forEach(function(elemento) {
    elemento.textContent = weatherData.location;
   
  });


  let imagen = document.getElementById("bloqueHoy");
  let urlIcono = "http://openweathermap.org/img/wn/" + iconCode + "@4x.png";
  imagen.style.backgroundImage = "url(" + urlIcono + ")";
  imagen.style.backgroundPosition = "0 0";

  cleanUp();
};

const cleanUp = () => {
  let container = document.getElementById("container");
  let loader = document.getElementById("loader");

  loader.style.display = "none";
  container.style.display = "flex";
};

const getDate = () => {
  let date = new Date();
  return `${date.getDate()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
};

// const setTextContent = (element, text) => {
//   document.getElementById(element).textContent = text;
// };

const temperaturaPorDia = (position) => {
  const {latitude, longitude} = position.coords;
  fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=es&units=metric&appid=${APP_ID}`
  )
  .then((response) => response.json())
  .then((data) => setPorDia(data));
}

const setPorDia = (data) => {

  document.getElementById('tbody').insertRow(-1).innerHTML = "";

  data.list.forEach(function(elemento) {
   
   let tabla = document.getElementById("tbody");

   let iconCode = elemento.weather[0].icon;
   let nuevaFila   = '<td>' + elemento.dt_txt + '</td>';
   nuevaFila  += '<td>' + Math.floor(elemento.main.temp) + '</td>';
   nuevaFila  += '<td>' + "ver icono" + '</td>';
   nuevaFila  += '<td>' + elemento.weather[0].description + '</td>';
     
   document.getElementById('tbody').insertRow(-1).innerHTML = nuevaFila;

   
  });

}


const onLoad = () => {
  navigator.geolocation.getCurrentPosition(fetchData);
  navigator.geolocation.getCurrentPosition(temperaturaPorDia);

  let imagen = document.getElementsByTagName("body")[0];

  if (horaActual > 7 && horaActual < 21) {
    imagen.style.backgroundImage = 'url("../images/dia.jpg")';
    imagen.style.backgroundPosition = "0 0";
  } else {
    imagen.style.backgroundImage = 'url("../images/noche.jpg")';
    imagen.style.backgroundPosition = "0 0";
  }
};