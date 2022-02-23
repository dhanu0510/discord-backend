const express = require("express");
const router = express.Router();

const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(12).required(),
  password: Joi.string().min(6).max(12).required(),
  mail: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).max(12).required(),
  mail: Joi.string().email().required(),
});

//
const authController = require("../controllers/auth/authControllers.js");

router.post(
  "/register",
  validator.body(registerSchema),
  authController.controller.postRegister
);

router.post(
  "/login",
  validator.body(loginSchema),
  authController.controller.postLogin
);

module.exports = router;
