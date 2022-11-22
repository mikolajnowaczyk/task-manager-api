const express = require("express");
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const cors = require("cors")
const path = require("path")

const app = express();

require("dotenv").config()

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(cors({credentials: true}));
app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

module.exports = app