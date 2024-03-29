const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) throw new Error("Age must be a positive number");
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    required: true,
    type: String,
    minlength: 7,
    trim: true,
    match: new RegExp("^((?!password).)*$"),
  },
  tokens: [
    {
      token: {
        type: String,
        require: true,
      },
    },
  ],
  avatar:{
    type: Buffer
  }
},
{
  timestamps: true
});

userSchema.virtual('tasks', {
  ref:'Task',
  localField:"_id",
  foreignField:"owner"
})

//generate token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = [...user.tokens, { token }];
  await user.save();
  return token;
};

// hide sensetive data
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

//hash the plain password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//delete tasks when user is removed
userSchema.pre("remove", async function(next){
  const user = this;
  await Task.deleteMany({owner: user._id});
  next();
})

const User = mongoose.model("Users", userSchema);

module.exports = User;
