const { Router } = require("express");
const nodemailer = require("nodemailer");
const axios = require("axios");
const qs = require("qs");
const path = require("path");
const router = new Router();

let accessToken = 0;
let fetchAllLocations = 0;
let fetchSingleLocation = 0;

// ----- Routes ------ //
// ----- API Fetching ----- //
router.get("/api", async (request, response, next) => {
  try {
    const ovaticLocations = await axios.get(
      process.env.EXTERNAL_URL + "/locations/",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("// ---- Fetch all locations accessed ---- //");
    fetchAllLocations++;
    console.log(
      `// ---- Fetch all locations route has been accessed ${fetchAllLocations} times ---- //`
    );

    //Filtering out all the excess locations. TODO: Find a better filter setup.
    const filteredOvaticLocations = ovaticLocations.data.locations;

    console.log(filteredOvaticLocations);

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

    const ovaticSeatplans = await axios.get(
      process.env.EXTERNAL_URL + "/seatplans/",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          locationID: `${request.params.id}`,
        },
      }
    );

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

// ----- Visitor count tracker ----- //
router.get("/test/visitors", (request, response, next) => {
  const combined = { fetchSingleLocation, fetchAllLocations };
  console.log("// ---- Visitor count accessed ---- //");
  return response.status(200).send(combined);
});

// ----- Access token function triggers on server start ------ //
const encryptedClientIdClientSecret = process.env.ENCRYPTED_INFO;
const stringifiedData = qs.stringify({ grant_type: "client_credentials" });

const getAccessToken = async (request, response, next) => {
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
