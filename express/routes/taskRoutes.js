const express = require("express");

const taskRouter = express.Router();

taskRouter.get("/", (req, res) => {
  if (!req.session.tasks) {
    req.session.tasks = [{ id: 1, name: "Task 1", completed: false, user: {id: 1, name: 'Guest'} }];
  }
  const tasks = req.session.tasks;
  res.json({ tasks });
});

taskRouter.put("/:id", (req, res) => {
  res.json({ message: "update tasks" });
});

taskRouter.post("/", (req, res) => {
  res.json({ message: "create tasks" });
});

taskRouter.delete("/:id", (req, res) => {
  res.json({ message: "delete tasks" });
});

module.exports = taskRouter;
