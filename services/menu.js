import Product from "../models/product.js";

export async function getMenu() {
  try {
    const menu = await Product.find();
    return menu;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function getproductItem(prodId) {
  try {
    const product = await Product.findOne({ prodId: prodId });
    return product;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function createNewProduct(product) {
  try {
    const result = await Product.create(product)
    return result;
  } catch(error) {
    console.log(error.message);
    return null;
  }
}

export async function updateProduct(prodId, updatedProduct) {
  try {
    const product = await Product.findOneAndUpdate({ prodId: prodId }, updatedProduct, { new: true });
    if (!product) throw new Error("Prdouct not found");
    return product;
  } catch(error) {
    console.log(error.message);
    return null;
  }
}

export async function deleteProduct(prodId) {
  try {
    const result = await Product.findOneAndDelete({prodId: prodId});
    return result;
  } catch(error) {
    console.log(error.message);
    return null;
  }
}