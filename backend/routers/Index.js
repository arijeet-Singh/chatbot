const express = require("express");
const router = express.Router();
const chatbotRouter = require("./Chatbot.js")

router.get("/", (req, res) => {
  res.send("Welcome to stackverflow clone api");
});

router.use("/chatbot", chatbotRouter);

module.exports = router;
