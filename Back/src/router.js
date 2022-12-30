const Router = require("koa-router");
const router = new Router();
const {
  getEvents,
  addEvent,
  getAuthURL,
  addUser,
} = require("./controllers/events.controllers");

router.get("/events_list", getEvents);
router.get("/get_auth_url", getAuthURL);

router.post("/add_event", addEvent);
router.post("/user", addUser);

module.exports = router;
