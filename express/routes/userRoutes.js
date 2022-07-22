const express = require("express");
const userRouter = express.Router();

let userIdInc = 1;

userRouter.get("/", (req, res) => {
  if(!req.session.user) {
    req.session.user = { id: userIdInc++, name: "Guest" };
  }

  res.json({user: req.session.user});
})

userRouter.post('/', (req, res) => {
  req.session.user = { id: userIdInc++, name: req.body.name || 'Guest' };
  
  res.json({user: req.session.user});
})


module.exports = userRouter;
