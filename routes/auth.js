import { Router } from "express";
import { v4 as uuid } from "uuid";
import { getUser, registerUser } from "../services/users.js";
import { validateAuthBody } from "../middlewares/validators.js";

const router = Router();

// GET logout
router.get('/logout', (req, res, next) => {
    if(global.user) {
        global.user = null;
        res.json({
            success: true,
            message: 'User logged out successfully'
        });
    } else {
        next({
            status: 400,
            message: 'No user is currently logged in'
        });
    }
});

// POST login
router.post("/login", validateAuthBody, async (req, res, next) => {
  const { username, password } = req.body;
  const user = await getUser(username);
    if (user) {
      if (user.password === password) {
        global.user = user;
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

// POST Register
router.post("/register", validateAuthBody, async (req, res, next) => {
  const { username, password } = req.body;
  const result = await registerUser({
      username: username,
      password: password,
      role: "User",
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
        message: "User could not be created.",
      });
    }
});

export default router;
