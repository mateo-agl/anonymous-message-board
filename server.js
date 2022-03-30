const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api.js");
const helmet = require("helmet");
const app = express();

app.use(
  helmet({
    frameguard: { action: "sameorigin" },
    dnsPrefetchControl: { allow: false },
    referrerPolicy: { policy: "same-origin" },
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./build"));

app.get("/b/*", (req, res) => {
  res.sendFile(process.cwd() + "/build/index.html");
});

apiRoutes(app);

mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log("Your app is running on http://localhost:" + listener.address().port);
    });
  })
  .catch((e) => console.error(e));