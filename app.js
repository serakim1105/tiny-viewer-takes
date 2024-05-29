import express from "express";
const app = express();
import configRoutes from "../routes/index.js";
import session from "express-session";
import exphbs from "express-handlebars";

app.use(express.json());

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  helpers: {
    eq: function (v1, v2) {
      return v1 === v2;
    },
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number") {
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
      }
      return new Handlebars.SafeString(JSON.stringify(obj));
    },
  },
});

app.use("/public", express.static("public"));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "AuthState",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 3600000,
    },
  })
);

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use((req, res, next) => {
  const isAuthenticated = req.session.user
    ? "Authenticated User"
    : "Non-Authenticated User";
  console.log(
    `[${new Date().toUTCString()}]: ${req.method} ${
      req.originalUrl
    } (${isAuthenticated})`
  );
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000/channels");
});

let newChannel;
let newUser;
