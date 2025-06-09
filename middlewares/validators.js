export function validateAuthBody(req, res, next) {
  const { username, password } = req.body;
  if (username && password) {
    next();
  } else {
    next({
      status: 400,
      message: "BOTH username AND password are required",
    });
  }
}

export function validateOrderBody(req, res, next) {
  const { cartId } = req.body;
  if (cartId) {
    next();
  } else {
    next({
      status: 400,
      message: "cartId is required",
    });
  }
}
