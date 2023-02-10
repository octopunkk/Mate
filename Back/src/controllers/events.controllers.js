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
  };
  ctx.status = 201;
}

async function getUser(ctx) {
  authToken = ctx.header.authorization.split(" ")[1];
  const user = (await sql.userFromAuthToken(authToken))[0];
  if (user) {
    ctx.body = {
      displayName: user.spotify_display_name,
      userId: user.spotify_user_id,
    };
    ctx.status = 200;
  } else {
    ctx.body = "Authentification failed";
    ctx.status = 401;
  }
}

module.exports = {
  getAuthURL,
  addUser,
  getUser,
};
