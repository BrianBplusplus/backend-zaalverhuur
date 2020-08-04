const { Router } = require("express");
const axios = require("axios");

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
    const params = {
      headers: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      },
    };

    console.log(params);

    const apiResponse = await axios.post(
      `https://api.trs-suite.com:443//hosting/login/oauth`,
      params
    );
    response.json(apiResponse);
  } catch (error) {
    console.log(" -- error handler --");
    return next(error);
  }
});

module.exports = router;
