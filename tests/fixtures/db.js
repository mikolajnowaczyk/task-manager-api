const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "mike@example.com",
  password: "56what!!!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Bike",
  email: "bike@example.com",
  password: "12fusrodah!!!",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First task",
  completed: false,
  owner: userOne._id
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second task",
  completed: true,
  owner: userOne._id
}

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Third task",
  completed: true,
  owner: userTwo._id
}

const taskFour = {
  _id: new mongoose.Types.ObjectId(),
  description: "Fourth task",
  completed: true,
  owner: userTwo._id
}

const taskFive = {
  _id: new mongoose.Types.ObjectId(),
  description: "Fifth task",
  completed: true,
  owner: userTwo._id
}

const taskSix = {
  _id: new mongoose.Types.ObjectId(),
  description: "Sixth task",
  completed: false,
  owner: userTwo._id
}

const setupDatabase = async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
  await new Task(taskFour).save();
  await new Task(taskFive).save();
  await new Task(taskSix).save();
}

module.exports = {
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  taskFour,
  taskFive,
  taskSix,
  setupDatabase
}