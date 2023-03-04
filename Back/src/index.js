const Koa = require("koa");
const parser = require("koa-bodyparser");
const cors = require("@koa/cors");
const router = require("./router");
const sql = require("./sql");
const { errorMiddleware } = require("./utils/errorMiddleware");
const App = new Koa();
const port = 8000;

const authMiddleware = async (ctx, next) => {
  if (ctx.header.authorization) {
    const authToken = ctx.header.authorization.split(" ")[1];
    if (authToken) {
      const user = (await sql.userFromAuthToken(authToken))[0];
      ctx.user = user;
    }
  }

  return next();
};

App.use(errorMiddleware)
  .use(parser())
  .use(cors())
  .use(authMiddleware)
  .use(router.routes())
  .listen(port, () => {
    console.log(`🚀 Server listening http://127.0.0.1:${port}/ 🚀`);
  });
