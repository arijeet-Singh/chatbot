const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const router = require("./routers");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/api", router);

app.use("/upload", express.static(path.join(__dirname, "/../uploads")));
app.use(express.static(path.join(__dirname, "/../frontend/build")));
app.get("*", (req, res) => {
  try {
    res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
  } catch (e) {
    res.send("Error Occurred");
  }
});

app.use(cors());

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
