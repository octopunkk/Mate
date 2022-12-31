const Spotify = require("../utils/spotify");

// Probably should update this soon to switch to an actual DB

const events_db = [{ k1: "a" }];

const getAuthURL = (ctx) => {
  ctx.body = { url: Spotify.authorizeURL() };
  ctx.status = 200;
};

const getEvents = (ctx) => {
  ctx.body = events_db;
  ctx.status = 200;
};

async function addUser(ctx) {
  const userTokens = await Spotify.getUserTokens(ctx.request.body.authCode);
  const user = await Spotify.getUserData(userTokens);
  console.log(user);
  ctx.body = {
    auth_token: user.auth_token,
    display_name: user.spotify_display_name,
    profile_pic: user.spotify_profile_pic,
  };
  ctx.status = 201;
}
const addEvent = (ctx) => {
  events_db.push(ctx.request.body);
  ctx.body = "Event Created!";
  ctx.status = 201;
};

module.exports = {
  getEvents,
  addEvent,
  getAuthURL,
  addUser,
};
