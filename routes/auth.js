import { Router } from "express";
import { v4 as uuid } from "uuid";
import { getUser, registerUser } from "../services/users.js";
import { validateAuthBody } from "../middlewares/validators.js";
import { signToken } from "../utils/token.js";
import { hashPassword, comparePasswords } from "../utils/hash.js";

const router = Router();

// GET logout
router.get("/logout", (req, res, next) => {
    res.json({
      success: true,
      message: "User logged out successfully",
    });
});

// POST Register
router.post("/register", validateAuthBody, async (req, res, next) => {
  const { username, password, role } = req.body;
  const hashedPassword = await hashPassword(password);
  const result = await registerUser({
    username: username,
    password: hashedPassword,
    role: role.toLowerCase(),
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
      const token = signToken({userId : user.userId, role: user.role});
      res.json({
        success: true,
        message: "User logged in successfully",
        token: `Bearer ${token}`
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
