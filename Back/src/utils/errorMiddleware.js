const errorMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof MateError) {
      ctx.status = e.status;
      ctx.message = e.message;
      return;
    }

    console.log("IS ANTOHER ERROR");

    throw e;
  }
};

class MateError extends Error {
  static status = 500;
}

class Unauthorized extends MateError {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

module.exports = {
  errorMiddleware,
  Unauthorized,
};
