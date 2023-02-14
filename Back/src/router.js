const Router = require("koa-router");
const router = new Router();
const {
  getAuthURL,
  addUser,
  getUser,
  createRoom,
  getPlayersInRoom,
  joinRoom,
} = require("./controllers/events.controllers");

router.get("/get_auth_url", getAuthURL);

router.post("/user", addUser);
router.get("/user", getUser);

router.post("/createRoom", createRoom);

router.get("/getPlayersInRoom/:roomId", getPlayersInRoom);

router.post("/join/:roomId", joinRoom);

module.exports = router;
