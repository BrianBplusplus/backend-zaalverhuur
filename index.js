const express = require("express");
const app = express();
const port = 4000;

const dotenv = require("dotenv");
dotenv.config();

//const cors = require("cors");
//const corsMiddleware = cors();
//app.use(corsMiddleware);

const routes = require("./routes");
app.use(routes);

app.use(express.static(__dirname + "/build/"));

app.listen(process.env.PORT || port, () =>
  console.log(`
// ---- denieuwebibliotheek Express app ---- //
// ---- Listening on port ${process.env.PORT || port} ---- //`)
);
