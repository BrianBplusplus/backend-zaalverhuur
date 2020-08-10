const { Router } = require("express");
const axios = require("axios");
const qs = require("qs");

const router = new Router();
let accessToken = ""

// ----- Routes ------ //
router.get("/", async (request, response, next) => {
  try {
    const serverMessage = "😀 🕶 🐼 🐶";
    console.log("Server is online")
    return response.json(serverMessage);
  } catch (error) {
    return next(error);
  }
});

router.get("/api", async (request, response, next) => {
  try {
    const todo = "Fetch all rooms"
    console.log("TODO: fetch all rooms")
    return response.json(todo)
  } catch (error) {
    return next(error);
  }
});

router.get("/api/:id", async (request, response, next) => {
  try {
    const todo = "Fetch single room"
    console.log("TODO: fetch single room" + " id : " + request.params.id)
    return response.json(todo + " id : " + request.params.id)
  } catch (error) {
    return next(error)
  }
})

// ----- Access token function triggers on server start ------ //
const encryptedClientIdClientSecret = process.env.ENCRYPTED_INFO;
const stringifiedData = qs.stringify({ grant_type: "client_credentials" });

const getAccessToken = async (request, response) => {
  try {
    const apiData = await axios({
      method: "post",
      url: "https://api.trs-suite.com:443//hosting/login/oauth",
      data: stringifiedData,
      headers: {
        authorization: `Basic ${encryptedClientIdClientSecret}`,
      },
    })
    console.log(apiData)
  }
  catch (error){
    console.log("Post Error : " + error)
        return (error)
  }



  /*
  axios({
    method: "post",
    url: "https://api.trs-suite.com:443//hosting/login/oauth",
    data: stringifiedData,
    headers: {
      authorization: `Basic ${encryptedClientIdClientSecret}`,
    },
  })
    .then(function (response) {
      console.log("Header With Authentication :" + response);
    })
    .catch(function (error) {
      console.log("Post Error : " + error);
    });
    */
}

getAccessToken();


module.exports = router;
