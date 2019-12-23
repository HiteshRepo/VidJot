const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");

const app = express();

// connect to mongoose
mongoose
  .connect("mongodb://localhost/vidjot-dev", { useMongoClient: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Cannot connect"));

// Handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Method override middleware
app.use(methodOverride("_method"));

// Express session midleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// flash messaging middleware
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//How middleware works
// app.use(function(req, res, next) {
//   //console.log(Date.now());
//   req.name = "Hitesh";
//   next();
// });

// Index route
app.get("/", (req, res) => {
  //res.send(`Index2 Route ${req.name}`);
  const title = "Index";
  res.render("index", {
    title: title
  });
});

// About route
app.get("/about", (req, res) => {
  res.render("about");
});

// load ideas routers
const ideas = require("./routes/ideas");
app.use("/ideas", ideas);

// load users routers
const users = require("./routes/users");
app.use("/users", users);

const port = 5000;

app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});
