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
    if (weatherInfo.cod !== 200) {
      console.log("-> error", weatherInfo);
      openErrorModal(
        `An error happened fething weather info: ${weatherInfo.message}`
      );
    } else {
      const success = await saveData("/add-entry", {
        temperature: weatherInfo.main.temp,
        date: getTodaysDate(),
        feelings: document.getElementById("feelings").value
      });
      if (success) {
        getUserDataAndUpdateUI();
      }
    }
  } catch (error) {
    console.log("error", error);
    openErrorModal(`An unexpected error happened: ${error}`);
  }
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
 * [Async] Queries our server to fetch the last entry for the current user and
 * updates the UI with that retreived data.
 */
const getUserDataAndUpdateUI = async () => {
  const result = await fetch(`/recent-entry`);
  try {
    const { temperature, date, feelings } = await result.json();
    updateLatestEntriesUI(temperature, date, feelings);
    resetForm();
  } catch (error) {
    console.log("error", error);
    openErrorModal("Some unexpected error happened!");
  }
};

/**
 * Updates the user interface containing the latest entry
 *
 * @param {number} temperature - The temperature to set on the #temp field
 * @param {string} date - The date to set on the #date field
 * @param {string} feelings - The feelings to set on the #feelings field
 */
const updateLatestEntriesUI = (temperature, date, feelings) => {
  temperature = `Todays' temperature is ${temperature} ºF`;
  date = `Todays' date: ${date}`;
  feelings = `Your mood is: ${feelings}`;
  document.getElementById("temp").innerHTML = temperature;
  document.getElementById("date").innerHTML = date;
  document.getElementById("content").innerHTML = feelings;
};

/**
 * Resets the form UI so user has a clean state.
 */
const resetForm = () => {
  document.getElementById("zip").value = "";
  document.getElementById("feelings").value = "";
  toggleSubmitButton();
};
/**
 * Event listener handler for linking the weather fetch API to the generate
 * submit button.
 */
const addSubmitButtonListener = () => {
  document.getElementById("generate").addEventListener("click", () => {
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

/**
 * Hanlder for adding event listeners for closing modal window
 */
const errorModalHandler = () => {
  let modal = document.getElementById("errorModal");
  let span = document.querySelector(".modal-close");
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    document.getElementById("modal-body-content").innerHTML = "";
    modal.style.display = "none";
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      document.getElementById("modal-body-content").innerHTML = "";
      modal.style.display = "none";
    }
  };
};

/**
 * Opens a modal for showing nicer error messages to the user
 * @param {string} errorMessage - The message error to be displayed on the modal
 * window
 */
const openErrorModal = errorMessage => {
  let modal = document.getElementById("errorModal");
  document.getElementById("modal-body-content").innerHTML = errorMessage;
  modal.style.display = "block";
};

/* RUN Start up code */

// We want to disable the generate button on startup
toggleSubmitButton();

// Listeners && EventListeners
addSubmitButtonHandlers();
addSubmitButtonListener();
errorModalHandler();
