const Router = require("koa-router");
const router = new Router();
const {
  getAuthURL,
  addUser,
  getUser,
  createRoom,
  getPlayersInRoom,
  joinRoom,
  getHost,
  quitRoom,
  kickFromRoom,
} = require("./controllers/events.controllers");

router.get("/get_auth_url", getAuthURL);

router.post("/user", addUser);
router.get("/user", getUser);

router.post("/createRoom", createRoom);

router.get("/getPlayersInRoom/:roomId", getPlayersInRoom);
router.get("/host/:roomId", getHost);

router.post("/join/:roomId", joinRoom);

router.post("/quit/:roomId", quitRoom);
router.post("/kick/:roomId", kickFromRoom);
module.exports = router;
