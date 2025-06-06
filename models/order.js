import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    prodId: String,
    title: String,
    desc: String,
    price: Number,
    qty: Number
});

const orderSchema = new Schema(
  {
    cartId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    orderItems: [orderItemSchema],
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
