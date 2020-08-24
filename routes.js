const { Router } = require("express");
const axios = require("axios");
const qs = require("qs");
const path = require("path");
const router = new Router();

let accessToken = 0;
let fetchAllLocations = 0;
let fetchSingleLocation = 0;

// ----- Routes ------ //
router.get("/api", async (request, response, next) => {
  try {
    const ovaticLocations = await axios.get(process.env.EXTERNAL_URL + "/locations/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("// ---- Fetch all locations accessed ---- //");
    fetchAllLocations++;
    console.log(
      `// ---- Fetch all locations route has been accessed ${fetchAllLocations} times ---- //`
    );

    //Filtering out all the excess locations. TODO: Find a better filter setup.
    const filteredOvaticLocations = ovaticLocations.data.locations.filter(
      (location) => location.locationID <= 1371
    );

    return response.status(200).send(filteredOvaticLocations);
  } catch (error) {
    return next(error);
  }
});

router.get("/api/:id", async (request, response, next) => {
  try {
    const ovaticLocations = await axios.get(
      process.env.EXTERNAL_URL + "/locations/" + request.params.id,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const ovaticSeatplans = await axios.get(process.env.EXTERNAL_URL + "/seatplans/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        locationID: `${request.params.id}`,
      },
    });

    const combinedResponse = {
      ...ovaticLocations.data,
      ...ovaticSeatplans.data,
    };

    console.log("// ---- Fetch single location accessed ---- //");
    fetchSingleLocation++;
    console.log(
      `// ---- Fetch single location route has been accessed ${fetchSingleLocation} times ---- //`
    );
    return response.status(200).send(combinedResponse);
  } catch (error) {
    return next(error);
  }
});

// Redirect route if user refreshes a specific page
router.get("/:id", function (req, res) {
  res.sendFile(path.join(__dirname, "/build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// ----- Access token function triggers on server start ------ //
const encryptedClientIdClientSecret = process.env.ENCRYPTED_INFO;
const stringifiedData = qs.stringify({ grant_type: "client_credentials" });

const getAccessToken = async (request, response) => {
  try {
    const apiData = await axios({
      method: "post",
      url: process.env.AUTHENTICATION_URL,
      data: stringifiedData,
      headers: {
        authorization: `Basic ${encryptedClientIdClientSecret}`,
      },
    });
    console.log("// ---- 200 Token fetch succes ---- //");
    accessToken = apiData.data.access_token;
  } catch (error) {
    console.log("Token fetch error : " + error);
    return error;
  }
};

getAccessToken();

module.exports = router;
