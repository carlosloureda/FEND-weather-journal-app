const { check, validationResult } = require("express-validator");
// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

/* Routes */

/**
 * GET route for returning `projectsData` to the calling client.
 */
app.get("/entries", (req, res) => {
  res.send(projectData);
});

/**
 * Post route: Adds incoming data into the projectData.
 *
 * This route needs to receive 3 params in the body:
 * - temperature - {Number} :
 * - date - {Number}
 * - mood - {String} :
 *
 * If the client sends a request without the proper fields this route will
 * answer with a 422 response and send the errors.
 */
app.post(
  "/add-entry",
  [
    check("temperature").isNumeric(),
    // TODO: check if we can set it to int or timestamp isRFC3339, isISO8601 for dates
    check("date").isNumeric(),
    check("mood").isString()
  ],
  (req, res) => {
    // Validate data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // Save data into projectData
    const { temperature, date, mood } = req.body;

    projectData["user-data"] = {
      temperature,
      date,
      mood
    };
    console.log("[/add-entry] endpoint called with: ", req.body);
    res.status(200).send("User entry properly saved");
    // res.sendStatus(200);
  }
);

// Setup Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server for weather app running on port: ${PORT}`);
  console.log(
    `Open http://localhost:${PORT}/ on your browser to see the app running`
  );
});
