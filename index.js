const express = require("express");
require("./src/db/mongoose");
const User = require("./src/models/user");
const Task = require("./src/models/task");
const userRouter = require("./src/routers/user");
const taskRouter = require("./src/routers/task");
const cors = require("cors")
const path = require("path")

const app = express();
const port = process.env.PORT;

require("dotenv").config()

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(cors({credentials: true}));
app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});