const { Router } = require("express")

const router = new Router();

router.get("/test", async (request, response, next) => {
    try {
        const testMessage = "test message has been received"; 
        console.log("test route has been accessed");

        return response.json(testMessage)
    }
    catch (error) {
        return next(error)
    }
})

module.exports = router