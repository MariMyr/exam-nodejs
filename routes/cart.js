import { Router } from "express";
import getAllCarts, { getCartById, updateCart } from "../services/cart.js";
import { getMenuItem } from "../services/menu.js";
import { v4 as uuid } from "uuid";

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

// GET cart by ID
router.get('/:cartId', async (req, res, next) => {
    const cart = await getCartById(req.params.cartId);
    if(cart) {
        res.json({
            success : true,
            cart : cart
        });
    } else {
        next({
            status : 404,
            message : 'No cart found'
        });
    }
})

// Update cart
router.put("/", async (req, res, next) => {
  try {
    const userId = global.user?.userId;
    const { guestId: bodyGuestId, prodId, qty } = req.body;
    const menuItem = await getMenuItem(prodId);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }
    if (userId) {
      const result = await updateCart(userId, {
        prodId: menuItem.prodId,
        title: menuItem.title,
        desc: menuItem.desc,
        price: menuItem.price,
        qty,
      });
      if (!result) {
        return res.status(500).json({
          success: false,
          message: "Failed to update cart",
        });
      }
      return res.json({
        success: true,
        cart: result,
      });
    } else {
      let guestId = bodyGuestId;
      if (!guestId) {
        guestId = `guest-${uuid().substring(0, 5)}`;
      }
      const result = await updateCart(guestId, {
        prodId: menuItem.prodId,
        title: menuItem.title,
        desc: menuItem.desc,
        price: menuItem.price,
        qty,
      });
      if (!result) {
        return res.status(500).json({
          success: false,
          message: "Failed to update guest cart",
        });
      }
      return res.json({
        success: true,
        guestId: guestId,
        cart: result,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
