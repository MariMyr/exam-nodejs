import { Router } from "express";
import {
  deleteCart,
  getAllCarts,
  getCartById,
  updateCart,
} from "../services/cart.js";
import { getProduct } from "../services/menu.js";
import { v4 as uuid } from "uuid";
import { verifyToken } from "../utils/token.js";
import { getUserByUserId } from "../services/users.js";

const router = Router();

// GET all carts
router.get("/", async (req, res, next) => {
  const carts = await getAllCarts();
  if (carts) {
    res.json({
      success: true,
      carts: carts,
    });
  } else {
    next({
      status: 404,
      message: "No carts found",
    });
  }
});

// GET cart by cart-ID
router.get("/:cartId", async (req, res, next) => {
  const cart = await getCartById(req.params.cartId);
  if (cart) {
    res.json({
      success: true,
      cart: cart,
    });
  } else {
    next({
      status: 404,
      message: "No cart found",
    });
  }
});

// Update cart
router.put("/", async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const decodedToken = verifyToken(token);

      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }
      const user = await getUserByUserId(decodedToken.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User Not found",
        });
      }

      const { prodId, qty } = req.body;
      const productItem = await getProduct(prodId);

      const result = await updateCart(user.userId, {
        prodId: productItem.prodId,
        title: productItem.title,
        price: productItem.price,
        qty: qty,
      });
      res.json({
        success: true,
        cart: result,
      });
    } else {
      let { guestId, prodId, qty } = req.body;
      const productItem = await getProduct(prodId);
      if (!guestId) {
        guestId = `guest-${uuid().substring(0, 5)}`;
      }

      const result = await updateCart(guestId, {
        prodId: productItem.prodId,
        title: productItem.title,
        price: productItem.price,
        qty,
      });
      res.json({
        success: true,
        guestId: guestId,
        cart: result,
      });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
  }
});

// DELETE cart by cart-ID
router.delete("/:cartId", async (req, res, next) => {
  const cartId = req.params.cartId;
  try {
    const result = await deleteCart(cartId);
    if (result && result.deletedCount > 0) {
      res.json({
        success: true,
        message: "Cart deleted successfully",
        cart: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Cart not found with given ID",
      });
    }
  } catch (error) {
    console.log(error.message);
    return null;
  }
});

export default router;
