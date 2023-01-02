const Spotify = require("../utils/spotify");
const sql = require("../sql");

const getAuthURL = (ctx) => {
  ctx.body = { url: Spotify.authorizeURL() };
  ctx.status = 200;
};

async function addUser(ctx) {
  const userTokens = await Spotify.getUserTokens(ctx.request.body.authCode);
  const user = await Spotify.getUserData(userTokens);
  ctx.body = {
    auth_token: user.auth_token,
    display_name: user.spotify_display_name,
    profile_pic: user.spotify_profile_pic,
  };
  ctx.status = 201;
}

async function verifyAuthToken(ctx) {
  const user = await sql.userFromAuthToken(ctx.request.body.authToken);
  ctx.body = { ok: Boolean(user) };
  ctx.status = 201;
}

module.exports = {
  getAuthURL,
  addUser,
  verifyAuthToken,
};
