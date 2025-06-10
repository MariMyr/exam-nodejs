import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByUserId,
} from "../services/orders.js";
import Cart from "../models/cart.js";
import { validateOrderBody } from "../middlewares/validators.js";

const router = Router();

// GET all orders
router.get("/", async (req, res, next) => {
  const orders = await getAllOrders();
  if (orders) {
    res.json({
      success: true,
      orders: orders,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "No orders found",
    });
  }
});

// GET order by user-ID
router.get("/:userId", async (req, res, next) => {
  try {
    const orders = await getOrdersByUserId(req.params.userId);
    if (orders && orders.length > 0) {
      res.json({
        success: true,
        orders: orders,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }
  } catch (error) {
    console.log(error.message);
    return null;
  }
});

// POST new order (with optional note)
router.post("/", validateOrderBody, async (req, res, next) => {
  try {
    const { cartId, note } = req.body;
    const cart = await Cart.findOne({ cartId: cartId });
    if (!cartId) {
      res.json({
        success: false,
        message: "Cart not found",
      });
    }
    const order = await createOrder(cartId, cart.items, note);
    order.orderItems.push(...cart.items);
    await order.save();
    res.json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      message: error.status,
    });
  }
});

export default router;
