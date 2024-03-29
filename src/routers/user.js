const User = require("../models/user");
const auth = require("../middleware/auth");
const express = require("express");
const multer = require("multer");
const router = new express.Router();
const sharp = require("sharp");
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account');

//create user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//login user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//logout all sessions
router.post("/users/logoutAll", auth, async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//get my user
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//update my profile
router.patch("/users/me", auth, async (req, res) => {
  const allowedUpdates = ["email", "password", "name", "age"];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((item) => allowedUpdates.includes(item));

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update!" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//delete user
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email,req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image file"));
    }
    cb(undefined, true);
  },
});

//avatar
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//delete avatar
router.delete("/users/me/avatar", auth, async(req,res)=>{
  try{
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
  }catch(e){
    res.status(500).send({error: "Something went wrong"});
  }
})

//get avatar
router.get("/users/me/avatar", auth, async (req,res)=>{
  try{  
    res.set("Content-Type", "image/png");
    res.send(req.user.avatar);
  }catch(e){
    res.status(404).send();
  }
});
module.exports = router;
