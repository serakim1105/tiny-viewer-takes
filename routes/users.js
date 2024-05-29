import { Router } from "express";
import { userData } from "../data/index.js";
import validation from "../data/validation.js";
import xss from "xss";

const router = Router();

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/channels");
  }
  res.render("register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  let {
    firstNameInput,
    lastNameInput,
    emailAddressInput,
    passwordInput,
    confirmPasswordInput,
  } = req.body;

  firstNameInput = xss(firstNameInput);
  lastNameInput = xss(lastNameInput);
  emailAddressInput = xss(emailAddressInput);
  passwordInput = xss(passwordInput);
  confirmPasswordInput = xss(confirmPasswordInput);

  if (passwordInput !== confirmPasswordInput) {
    return res.status(400).render("register", {
      error: "Password does not match",
      title: "Register",
    });
  }

  try {
    firstNameInput = validation.validateString(firstNameInput, "First Name");
    lastNameInput = validation.validateString(lastNameInput, "Last Name");
    emailAddressInput = validation.validateString(emailAddressInput);
    passwordInput = validation.validateString(passwordInput);
    confirmPasswordInput = validation.validateString(confirmPasswordInput);

    const result = await userData.registerUser(
      firstNameInput,
      lastNameInput,
      emailAddressInput,
      passwordInput,
      confirmPasswordInput
    );

    return res.redirect("/login");
  } catch (e) {
    return res.status(400).render("register", {
      error: e.toString(),
      title: "Register",
      data: req.body,
    });
  }
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/channels");
  }
  res.render("login", { title: "Login" });
});

router.post("/login", async (req, res) => {
  let { emailAddressInput, passwordInput } = req.body;

  emailAddressInput = xss(emailAddressInput);
  passwordInput = xss(passwordInput);

  try {
    validation.checkEmail(emailAddressInput);
    validation.checkPassword(passwordInput);
    const user = await userData.loginUser(emailAddressInput, passwordInput);

    req.session.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    };
    res.redirect("/channels");
  } catch (e) {
    return res.status(400).render("login", {
      error: "Invalid email address or password.",
      title: "Login",
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;
