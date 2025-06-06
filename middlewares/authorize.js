import { verifyToken } from "../utils/index.js";

export function authenticateUser(req, res, next) {
  if(req.headers.authorization) {
    const token = req.headers.authorization.replace('Bearer ', '');
    const verification = verifyToken(token);
    if(verification) {
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid token"
    });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "No token provided"
    });
  }
}
