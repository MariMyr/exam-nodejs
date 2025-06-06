import { Router } from "express";
import { v4 as uuid } from "uuid";
import { getUser, registerUser } from "../services/users.js";
import { validateAuthBody } from "../middlewares/validators.js";
import { comparePasswords, hashPassword } from "../utils/index.js";

const router = Router();

// GET logout  ÄNDRA PÅ DENNA EFTER TOKENS
router.get("/logout", (req, res, next) => {
  if (global.user) {
    global.user = null;
    res.json({
      success: true,
      message: "User logged out successfully",
    });
  } else {
    next({
      status: 400,
      message: "No user is currently logged in",
    });
  }
});

// POST Register
router.post("/register", validateAuthBody, async (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const result = await registerUser({
    username: username,
    password: hashedPassword,
    role: "User", // role som man kan välja!
    userId: `user-${uuid().substring(0, 5)}`,
  });
  if (result) {
    res.status(201).json({
      success: true,
      message: "New user created successfully",
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Registration unsuccessful",
    });
  }
});

// POST login
router.post("/login", validateAuthBody, async (req, res, next) => {
  const { username, password } = req.body;
  const user = await getUser(username);
  if (user) {
    const correctPassword = await comparePasswords(password, user.password);
    if (correctPassword) {
      res.json({
        success: true,
        message: "User logged in successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Username and/or password are incorrect",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "No User found",
    });
  }
});

export default router;
