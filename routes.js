const { Router } = require("express");
const axios = require("axios");
const qs = require("qs");

const router = new Router();
let accessToken = 0;
let fetchAllLocations = 0;
let fetchSingleLocation = 0;

// ----- Routes ------ //
router.get("/", async (request, response, next) => {
  try {
    const serverMessage = "😀 😆 🐼 // ---- Server is online ---- // 🐶 😴 🧙";
    console.log("// ---- Server is online ---- //");
    return response.json(serverMessage);
  } catch (error) {
    return next(error);
  }
});

router.get("/api", async (request, response, next) => {
  try {
    const ovaticResponse = await axios.get(process.env.EXTERNAL_URL_LOCATIONS, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("// ---- Fetch all locations accessed ---- //");
    fetchAllLocations++;
    console.log(
      `// ---- Fetch all locations route has been accessed ${fetchAllLocations} times ---- //`
    );
    return response.status(200).send(ovaticResponse.data);
  } catch (error) {
    return next(error);
  }
});

router.get("/api/:id", async (request, response, next) => {
  try {
    const ovaticResponse = await axios.get(
      process.env.EXTERNAL_URL_LOCATIONS + request.params.id,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const ovaticSeatplans = await axios.get(
      process.env.EXTERNAL_URL_SEATPLANS,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          locationID: `${request.params.id}`
        },
      }
    ); 


    const combinedResponse = {
      ...ovaticResponse.data,
      ...ovaticSeatplans.data
    }


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
    console.log("Post Error : " + error);
    return error;
  }
};

getAccessToken();

module.exports = router;
