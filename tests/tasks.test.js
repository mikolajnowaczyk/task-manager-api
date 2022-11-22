const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
  userOne,
  userTwo,
  setupDatabase,
  taskOne,
  taskTwo,
  taskThree,
  taskFour,
  taskFive,
  taskSix,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "From my test",
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should fetch user tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  expect(response.body).toHaveLength(2);
});

test("Should not delete other users tasks", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await Task.findById(taskTwo._id);
  expect(task).not.toBeNull();
});

test("Should not create task with invalid description", async () => {
  const response = await request(app)
    .post(`/tasks`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "",
    })
    .expect(400);
  const task = await Task.findById(response.body._id);
  expect(task).toBeNull();
});

test("Should not create task with invalid completed", async () => {
  const response = await request(app)
    .post(`/tasks`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "test description",
      completed: 1,
    })
    .expect(400);
  const task = await Task.findById(response.body._id);
  expect(task).toBeNull();
});

test("Should not update task with invalid description", async () => {
  const response = await request(app)
    .patch(`/tasks/${taskThree._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: 123,
    })
    .expect(500);
  expect(response.body._message).toBe("Task validation failed");
});

test("Should not update task with invalid completed", async () => {
  const response = await request(app)
    .patch(`/tasks/${taskThree._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      completed: 1,
    })
    .expect(500);
  expect(response.body._message).toBe("Task validation failed");
});

test("Should delete user task", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200);
  const task = await Task.findById(taskThree._id);
  expect(task).toBeNull();
});

test("Should not delete task if unauthenticated", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .expect(401);
  const task = await Task.findById(taskThree._id);
  expect(task).not.toBeNull();
  expect(response.body.error).toBe("User not authenticated");
});

test("Should not update other users task", async () => {
  const response = await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: "Kapperino",
    })
    .expect(404);
  const task = await Task.findById(taskThree._id);
  expect(task).not.toBeNull();
  expect(task.description).not.toBe("Kapperino");
});

test("Should fetch user task by id", async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  expect(response.body).not.toBeNull();
  expect(response.body).toMatchObject(JSON.parse(JSON.stringify(taskOne)));
});

test("Should not fetch user task by id", async () => {
  const response = await request(app).get(`/tasks/${taskOne._id}`).expect(401);
  expect(response.body.error).toBe("User not authenticated");
});

test("Should not fetch other users task by id", async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(404);
  expect(Object.keys(response.body).length).toBe(0);
});

test("Should fetch only completed tasks", async () => {
  const response = await request(app)
    .get(`/tasks`)
    .query({completed: true})
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200);
  const descriptions = response.body.map((task) => task.description);
  expect(descriptions).toContain(taskThree.description);
  expect(descriptions).toContain(taskFour.description);
  expect(descriptions).toContain(taskFive.description);
  expect(Object.keys(response.body).length).toBe(3);
});

test("Should fetch only incompleted tasks", async () => {
  const response = await request(app)
    .get(`/tasks`)
    .query({ completed: "false" })
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200);
  expect(response.body[0].description).toBe(taskSix.description);
  expect(Object.keys(response.body).length).toBe(1);
});

test("Should fetch page of tasks", async () => {
  const response = await request(app)
    .get(`/tasks`)
    .query({ limit: 2, skip: 1 })
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200);
  const descriptions = response.body.map((task) => task.description);
  expect(descriptions).toContain(taskFive.description);
  expect(descriptions).toContain(taskFour.description);
  expect(Object.keys(response.body).length).toBe(2);
});

test("Should sort tasks by creation time - ascending", async () => {
  const response = await request(app)
    .get(`/tasks`)
    .query({ sortBy: "createdAt:asc"})
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200);
  expect(response.body[0].description).toContain(taskThree.description);
  expect(response.body[1].description).toContain(taskFour.description);
  expect(response.body[2].description).toContain(taskFive.description);
  expect(response.body[3].description).toContain(taskSix.description);
  expect(Object.keys(response.body).length).toBe(4);
});

test("Should sort tasks by creation time - descending", async () => {
  const response = await request(app)
    .get(`/tasks`)
    .query({ sortBy: "createdAt:desc"})
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200);
  expect(response.body[3].description).toContain(taskThree.description);
  expect(response.body[2].description).toContain(taskFour.description);
  expect(response.body[1].description).toContain(taskFive.description);
  expect(response.body[0].description).toContain(taskSix.description);
  expect(Object.keys(response.body).length).toBe(4);
});

test("Should sort tasks by description - ascending", async () => {
  const response = await request(app)
    .get(`/tasks`)
    .query({ sortBy: "description:asc"})
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200);
  expect(response.body[0].description).toContain(taskFive.description);
  expect(response.body[1].description).toContain(taskFour.description);
  expect(response.body[2].description).toContain(taskSix.description);
  expect(response.body[3].description).toContain(taskThree.description);
  expect(Object.keys(response.body).length).toBe(4);
});

test("Should sort tasks by description - descending", async () => {
  const response = await request(app)
    .get(`/tasks`)
    .query({ sortBy: "description:desc"})
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200);
  expect(response.body[3].description).toContain(taskFive.description);
  expect(response.body[2].description).toContain(taskFour.description);
  expect(response.body[1].description).toContain(taskSix.description);
  expect(response.body[0].description).toContain(taskThree.description);
  expect(Object.keys(response.body).length).toBe(4);
});

test("Should sort tasks by completed - ascending", async () => {
  const response = await request(app)
    .get(`/tasks`)
    .query({ sortBy: "completed:asc"})
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200);
  expect(response.body.map(t=>t.description)).toEqual([taskSix.description, taskThree.description, taskFour.description, taskFive.description]);
  expect(Object.keys(response.body).length).toBe(4);
});

test("Should sort tasks by completed - descending", async () => {
  const response = await request(app)
    .get(`/tasks`)
    .query({ sortBy: "completed:desc"})
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200);
  expect(response.body.map(t=>t.description)).toEqual([taskThree.description, taskFour.description, taskFive.description, taskSix.description]);
  expect(Object.keys(response.body).length).toBe(4);
});