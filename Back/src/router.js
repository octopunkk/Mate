const Router = require("koa-router");
const router = new Router();
const {
  getAuthURL,
  addUser,
  getUser,
  createRoom,
} = require("./controllers/events.controllers");

router.get("/get_auth_url", getAuthURL);

router.post("/user", addUser);
router.get("/user", getUser);

router.post("/createRoom", createRoom);

module.exports = router;
