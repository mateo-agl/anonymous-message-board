import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import apiRoutes from "./routes/api.js";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./src/App.jsx";
import { StaticRouter } from "react-router-dom/server";
const app = express();

if(process.env.MODE === "production") {
  app.use("/b/*", (req, res) => {
    fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Some error happened");
      }
      return res.send(
        data.replace(
          '<div id="root"></div>',
          `<div id="root">${ReactDOMServer.renderToString(<StaticRouter location={req.url}><App /></StaticRouter>)}</div>`
        )
      );
    });
  });
  app.use(express.static("./build"));
} else {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
  });
}

app.use(
  helmet({
    frameguard: { action: "sameorigin" },
    dnsPrefetchControl: { allow: false },
    referrerPolicy: { policy: "same-origin" },
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

apiRoutes(app);

mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const listener = app.listen(process.env.PORT || 8080, () => {
      console.log("Listening on port " + listener.address().port);
    });
  })
  .catch((e) => console.error(e));