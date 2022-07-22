const express = require("express");
const { pick } = require('lodash')

const taskRouter = express.Router();

taskRouter.get("/", (req, res) => {
  if (!req.session.tasks) {
    console.log('get: no tasks found');
    req.session.tasks = [{ id: 1, title: "Task 1", completed: false, user: {id: 1, name: 'Guest'} }];
  }
  let tasks = [...req.session.tasks];

  if(req.query.userId){
    tasks = tasks.filter(task => task.user.id === parseInt(req.query.userId));
  }
  if(typeof req.query.completed === 'string'){
    tasks = tasks.filter(task => task.completed === req.query.completed === 'true');
  }
  res.json({ tasks });
});

taskRouter.post("/", (req, res) => {
  if (!req.session.tasks) {
    console.log('create: no tasks found');
    req.session.tasks = [{ id: 1, title: "Task 1", completed: false, user: {id: 1, name: 'Guest'} }];
  }
  const tasks = [...req.session.tasks];

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
  if (!req.session.tasks) {
    console.log('update: no tasks found');
    req.session.tasks = [{ id: 1, title: "Task 1", completed: false, user: {id: 1, name: 'Guest'} }];
  }
  const tasks = [...req.session.tasks];

  const index = tasks.findIndex(task => task.id === parseInt(req.params.id));

  if(index === -1){
    return res.status(404).json({ error: 'Task not found' });
  }

  const toSet = pick(req.body, ['title', 'completed']);

  tasks[index] = { ...tasks[index], ...toSet };

  req.session.tasks = tasks;

  res.json({ task: tasks[index] });
});

taskRouter.delete("/:id", (req, res) => {
  res.json({ message: "delete tasks" });
});

module.exports = taskRouter;
