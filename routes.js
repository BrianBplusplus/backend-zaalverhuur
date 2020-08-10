const { Router } = require("express");
const axios = require("axios");
const qs = require("qs");

const router = new Router();

router.get("/test", async (request, response, next) => {
  try {
    const testMessage = "test message has been received";
    console.log("test route has been accessed");

    return response.json(testMessage);
  } catch (error) {
    return next(error);
  }
});

router.get("/api", async (request, response, next) => {
  try {
    return;
  } catch (error) {
    console.log(" -- error handler --");
    return next(error);
  }
});

const info = process.env.ENCRYPTED_INFO;

const stringifiedData = qs.stringify({ grant_type: "client_credentials" });

function HeaderPostAction() {
  axios({
    method: "post",
    url: "https://api.trs-suite.com:443//hosting/login/oauth",

    //withCredentials: true,
    data: stringifiedData,
    headers: {
      authorization: `Basic ${info}`,
    },
  })
    .then(function (response) {
      console.log("Header With Authentication :" + response);
    })
    .catch(function (error) {
      console.log("Post Error : " + error);
    });
}

HeaderPostAction();

module.exports = router;
