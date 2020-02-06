/* Global Variables */
// const WEATHER_API_BASE_URL = secrets.WEATHER_API_KEY;
const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "<ADD-YOUR-API-KEY-HERE>";
// TODO: I don't have a mentor ... and I hate knowledge section
const COUNTRY_CODE = "es";

/**
 * Creates a new date instance dynamically with JS
 * @returns {string} newDate - Date in format m.d.yyyy
 */
const getTodaysDate = () => {
  let d = new Date();
  return d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
};

/**
 * [Async] Fetches todays' weather from a given weather API (passed as an
 * argument). Right
 *
 * @param {string} baseUrl - Base url for the calling the API
 * @param {string} zip  - The zipcode of the city we are fetching data for
 * @param {string} apiKey - The API Key needed to request the web API
 *
 * @returns {object} weatherInfo - The weather information returned from the
 * remote weather Web API
 */

const fetchWeatherInfo = async (baseUrl, zip, apiKey) => {
  const url = `${baseUrl}?zip=${zip},${COUNTRY_CODE}&APPID=${apiKey}`;

  const result = await fetch(url);
  let weatherInfo = {};
  try {
    weatherInfo = await result.json();
    if (weatherInfo.cod === "404") {
      console.log("-> error", weatherInfo);
      // TODO: Improve UI to show this error in a better way than an alert
      window.alert(
        `An error happened fething weather info: ${weatherInfo.message}`
      );
      //cod: 200
    } else {
      console.log("Data fetched from openweathermap: ", weatherInfo);
    }
  } catch (error) {
    console.log("error", error);
  }

  const _result2 = await saveData("/add-entry", {
    temperature: weatherInfo.main.temp,
    date: getTodaysDate(),
    feelings: document.getElementById("feelings").value
  });
  console.log("_result2: ", _result2);
  // TODO: return true?
  //   return weatherInfo;
};

/**
 * [Async] Saves the user data on our server
 *
 * @param {string} path - Path for the server endpoint to save the data.
 * @param {object} userData - The user data to be saved. With this schema:
 *                          {temperature: number, date: string, feeling: string}
 */
const saveData = async (path, userData) => {
  // validate user data ? temperature, date, user response (feeling)
  const response = await fetch(path, {
    // TODO: need to add something ?
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData) // body data type must match "Content-Type" header
  });
  return response && response.status === 200 ? true : false;
};

/**
 * Event listener handler for linking the weather fetch API to the generate
 * submit button.
 */
const addSubmitButtonListener = () => {
  document.getElementById("generate").addEventListener("click", () => {
    // As we are on client side the validation is done by disabling the submit
    // button on the UI
    const zip = document.getElementById("zip").value;
    fetchWeatherInfo(WEATHER_API_BASE_URL, zip, API_KEY);
  });
};

/**
 * (Validator) Manages all the code related to check for events to enable/disable
 * the submit button (the `generate` one) while the user writes on both input
 * #zip and #feelings elements.
 *
 * Depends on toggleSubmitButton function
 */
const addSubmitButtonHandlers = () => {
  document.getElementById("zip").addEventListener("input", () => {
    toggleSubmitButton();
  });

  document.getElementById("feelings").addEventListener("input", () => {
    toggleSubmitButton();
  });
};

/**
 * Checks if both input #zip and #feelings elements to be filled to
 * enable the submit buttons
 */
const toggleSubmitButton = () => {
  const zipValue = document.getElementById("zip").value;
  const feelingsValue = document.getElementById("feelings").value;
  document.getElementById("generate").disabled =
    zipValue && feelingsValue ? false : true;
};

/* RUN Start up code */

// We want to disable the generate button on startup
toggleSubmitButton();

// Listeners && EventListeners
addSubmitButtonHandlers();
addSubmitButtonListener();
