const express = require("express");
const userRouter = express.Router();

let userIdInc = 0;

userRouter.get("/", (req, res) => {
  if(!req.session.users) {
    req.session.user = { id: userIdInc++, name: "Guest" };
  }

  res.json({user: req.session.user});
})

userRouter.post('/', (req, res) => {
  req.session.user = { id: userIdInc++, name: req.body.name || 'Guest' };
  
  res.json({user: req.session.user});
})
