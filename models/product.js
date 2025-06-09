import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    prodId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    modifiedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const product = mongoose.model("product", productSchema, "menu");
export default product;
