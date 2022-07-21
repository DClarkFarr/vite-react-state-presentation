const express = require("express");

const taskRouter = express.Router();

taskRouter.get("/", (req, res) => {
  if (!req.session.tasks) {
    req.session.tasks = [{ id: 1, title: "Task 1", completed: false, user: {id: 1, name: 'Guest'} }];
  }
  const tasks = req.session.tasks;
  res.json({ tasks });
});

taskRouter.post("/", (req, res) => {
  if (!req.session.tasks) {
    req.session.tasks = [{ id: 1, title: "Task 1", completed: false, user: {id: 1, name: 'Guest'} }];
  }
  const tasks = req.session.tasks;

  const task = {
    id: tasks.length + 1,
    title: req.body.title || 'Unnamed task',
    completed: false,
    user: req.session.user || {id: 1, name: 'Guest'}
  }

  tasks.push(task)
  req.session.tasks = tasks;
  
  res.json({ task: task });
});

taskRouter.put("/:id", (req, res) => {
  res.json({ message: "update tasks" });
});

taskRouter.delete("/:id", (req, res) => {
  res.json({ message: "delete tasks" });
});

module.exports = taskRouter;
