const Router = require("koa-router");
const {
  getAuthURL,
  addUser,
  getUser,
  createRoom,
  joinRoom,
  getRoomInfo,
  quitRoom,
  kickFromRoom,
  getPlaylist,
} = require("./controllers/events.controllers");

const router = new Router();

const requiresAuthUser = (ctx, next) => {
  if (!ctx.user) {
    ctx.body = "Authentification failed";
    ctx.status = 401;
    return;
  }
  return next();
};

router.get("/get_auth_url", getAuthURL);

router.post("/user", addUser);
router.get("/user/me", requiresAuthUser, getUser);

router.post("/room", requiresAuthUser, createRoom);

router.get("/room/:id", requiresAuthUser, getRoomInfo);

router.post("/room/:id/join", requiresAuthUser, joinRoom);

router.post("/room/:id/quit", requiresAuthUser, quitRoom);
router.delete("/room/:id/players/:playerId", requiresAuthUser, kickFromRoom);

router.get("/room/:id/playlist", requiresAuthUser, getPlaylist);
module.exports = router;
