const Router = require("koa-router");
const router = new Router();
const {
  getAuthURL,
  addUser,
  verifyAuthToken,
} = require("./controllers/events.controllers");

router.get("/get_auth_url", getAuthURL);

router.post("/user", addUser);
router.post("/authToken", verifyAuthToken);

module.exports = router;
