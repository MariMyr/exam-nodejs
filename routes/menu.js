import { Router } from "express";
import { createNewProduct, deleteProduct, getMenu, getProductByQuery, updateProduct } from "../services/menu.js";
import { adminsOnly, authenticateUser } from "../middlewares/authorize.js";
import { v4 as uuid } from "uuid";

const router = Router();

// GET all products from menu
router.get("/", async (req, res, next) => {
  const menu = await getMenu();
  if (menu) {
    res.json({
      success: true,
      menu: menu,
    });
  } else {
    next({
      status: 404,
      message: "No product items found",
    });
  }
});

// POST add new product to menu
router.post("/", authenticateUser, adminsOnly, async (req, res, next) => {
  try {
    const { title, desc, price } = req.body;
    if (title && desc && price) {
      const prodId = `prod-${uuid().substring(0, 5)}`;
      const newProduct = await createNewProduct({
        prodId: prodId,
        title: title,
        desc: desc,
        price: price,
      });
      if (newProduct) {
        res.status(201).json({
          success: true,
          message: "New product added successfully",
        });
      } else {
        next({
          status: 400,
          message: "No product added",
        });
      }
    } else {
      next({
        status: 400,
        message: "Must fill in title, desctiption AND price",
      });
    }
  } catch (error) {
    console.log(error.message);
    return null;
  }
});

// PUT update existing product
router.put("/:prodid", authenticateUser, adminsOnly, async (req, res, next) => {
  const prodId = req.params.prodid;
  const { title, desc, price } = req.body;
  const updatedData = {};
  if (title) updatedData.title = title;
  if (desc) updatedData.desc = desc;
  if (price) updatedData.price = price;

  updatedData.modifiedAt = new Date();
  const result = await updateProduct(prodId, updatedData);

  if (result) {
    res.json({
      success: true,
      message: "Product updated successfully",
      product: result,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Could not update product",
    });
  }
});

// DELETE product from menu
router.delete("/:prodid", authenticateUser, adminsOnly, async (req, res, next) => {
    const prodId = req.params.prodid;
    try {
      const result = await deleteProduct(prodId);
      if (result) {
        res.json({
          success: true,
          message: "Product deleted successfully",
          product: result,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Product not found with given ID",
        });
      }
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
);

// GET with query parameter
router.get("/search", async (req, res, next) => {
  let query = req.query.query;
  try {
    const result = await getProductByQuery(query);
    if(result && result.length > 0) {
      res.json({
        success: true,
        result: result
      });
    } else {
        res.status(404).json({
          success: false,
          message: "No products found matching the query"
        });
    }
  } catch(error) {
    console.log(error.message);
    return null;
  }
});

export default router;
