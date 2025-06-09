import { getUserByUserId } from "../services/users.js";
import { verifyToken, extractToken } from "../utils/token.js";

export async function authenticateUser(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }
  const decoded = verifyToken(token);
  if (!decoded?.userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
  const user = await getUserByUserId(decoded.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  req.user = user;
  console.log("AUTHENTICATED USER:", user);
  console.log("USER ROLE:", user.role);
  next();
}

export function adminsOnly(req, res, next) {
  console.log("CHECKING ROLE:", req.user?.role);
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied, admins only",
    });
  }
  next();
}
