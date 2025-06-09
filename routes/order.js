import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByUserId,
} from "../services/orders.js";
const router = Router();
import Cart from "../models/cart.js";
import { validateOrderBody } from "../middlewares/validators.js";
import { authenticateUser } from "../middlewares/authorize.js";

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
router.get('/:userId', async (req, res, next) => {
    const orders = await getOrdersByUserId(req.params.userId);
    if(orders) {
        res.json({
            success : true,
            orders: orders
        });
    } else {
        next({
            success : 404,
            message : 'No orders found'
        });
    }
});


// POST new order
router.post("/", validateOrderBody, async (req, res, next) => {
  try {
    const { cartId } = req.body;
    const cart = await Cart.findOne({ cartId: cartId });
    if (!cartId) {
      res.json({
        success: false,
        message: "Cart not found",
      });
    }
    const order = await createOrder(cartId, cart.items);
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
