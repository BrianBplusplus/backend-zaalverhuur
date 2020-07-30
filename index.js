const express = require("express");

const app = express();
const port = 4000;

const cors = require("cors");
const corsMiddleware = cors();
app.use(corsMiddleware);

const routes = require("./routes")
app.use(routes);

app.listen(port, () => console.log(`Listening on port ${port}`))