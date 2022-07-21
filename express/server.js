const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const session = require("express-session");
const sessionStore = require("express-session-rsdb");

const taskRouter = require("./routes/taskRoutes");

const app = express();
const port = 4000;

app.use(
  session({
    store: new sessionStore({
      data_storage_area: "./db",
      collection: "session",
      purge_interval: 700,
    }),
    secret: "There is no power, but what you have in your head",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
