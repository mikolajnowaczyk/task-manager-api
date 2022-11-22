const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Mikolaj",
      email: "mik@example.com",
      password: "MyPass777!",
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertion about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Mikolaj",
      email: "mik@example.com",
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe("MyPass777!");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  // Assert that the database was changed correctly
  const user = await User.findById(userOne._id);
  expect(user.tokens[1].token).toBe(response.body.token);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "definetlyNotCorrectPassword",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Shoud delete account for user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Shoud not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Shoud upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Shoud update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Pike",
      email: "pikee@example.com",
      password: "arroz123!!!",
      age: 25,
    })
    .expect(200);

  const user = await User.findById(userOne._id);
  // Assertion about the response
  expect(user).toMatchObject({
    name: "Pike",
    email: "pikee@example.com",
    age: 25,
  });
  expect(user.password).not.toBe("arroz123!!!");
});

test("Shoud not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Berlin",
    })
    .expect(400);
});

test("Shoud not signup user with invalid name/email/password", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "",
      email: "berlin@germany.de",
      password: "CorrectPass123!@#",
    })
    .expect(400);
  await request(app)
    .post("/users")
    .send({
      name: "validov",
      email: "berlin@germany",
      password: "CorrectPass123!@#",
    })
    .expect(400);

  await request(app)
    .post("/users")
    .send({
      name: "validov",
      email: "berlin@germany.de",
      password: "1234",
    })
    .expect(400);
});

test("Shoud not delete user if unauthenticated", async () => {
  await request(app)
    .delete("/users/me")
    .expect(401);
});


test("Shoud not update user with invalid name/email/password", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "",
      email: "berlin@germany.de",
      password: "CorrectPass123!@#",
    })
    .expect(400);
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "validov",
      email: "berlin@germany",
      password: "CorrectPass123!@#",
    })
    .expect(400);
    await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "validov",
      email: "berlin@germany",
      password: "admin",
    })
    .expect(400);
});

test("Shoud not delete user if unauthenticated", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401);
});