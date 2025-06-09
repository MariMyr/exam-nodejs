import Cart from "../models/cart.js";

export async function getAllCarts() {
  try {
    const carts = await Cart.find();
    return carts;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function getOrCreateCart(userId) {
  try {
    let cart = await Cart.findOne({ cartId: userId });
    if (!cart) {
      cart = await Cart.create({
        cartId: userId,
        items: [],
      });
    }
    return cart;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function updateCart(userId, productItem) {
  try {
    const cart = await getOrCreateCart(userId);
    if (!cart) {
      throw new Error("Could not retrieve cart");
    }

    const item = cart.items.find((i) => i.prodId === productItem.prodId);
    if (item) {
      item.qty = productItem.qty;
    } else {
      cart.items.push(productItem);
    }

    if (productItem.qty === 0) {
      cart.items = cart.items.filter((i) => i.prodId !== productItem.prodId);
    }
    await cart.save();
    return cart;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function getCartById(cartId) {
  try {
    return await Cart.findOne({ cartId: cartId });
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

// export async function deleteCart(cartId) {
//     try {
//         let result = await Cart.deleteOne({ cartId : cartId });
//         return result;
//     } catch(error) {
//         console.log(error.message);
//         return null;
//     }
// }
