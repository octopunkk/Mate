const SpotifyWebApi = require("spotify-web-api-node");
const utils = require("../utils/utils");
const sql = require("../sql");

const mainSpotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const scopes = ["user-top-read"];

const authorizeURL = () => {
  return mainSpotifyApi.createAuthorizeURL(scopes, utils.getRandomState(10));
};

async function getUserTokens(code) {
  const data = await mainSpotifyApi.authorizationCodeGrant(code);
  return {
    expire_date: utils.getExpireDate(data.body["expires_in"]),
    access_token: data.body["access_token"],
    refresh_token: data.body["refresh_token"],
  };
}

async function refreshSpotifyToken(userSpotifyApi, expire_date) {
  let newExpireDate = false;
  try {
    if (!expire_date || Date.now() > Date.parse(expire_date)) {
      const data = await userSpotifyApi.refreshAccessToken();
      userSpotifyApi.setAccessToken(data.body["access_token"]);
      newExpireDate = utils.getExpireDate(data.body["expires_in"]);
    }
  } catch (err) {
    console.log("Could not refresh access token", err);
  }
  return newExpireDate;
}

async function createUserSpotifyApi(userTokens) {
  return new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    accessToken: userTokens.access_token,
    refreshToken: userTokens.refresh_token,
  });
}

async function getUserData(userTokens) {
  let userSpotifyApi = await createUserSpotifyApi(userTokens);
  const newExpireDate = await refreshSpotifyToken(
    userSpotifyApi,
    userTokens.expire_date
  );
  const userData = await userSpotifyApi.getMe();
  if (newExpireDate) {
    userTokens.expire_date = newExpireDate;
    sql.refreshToken(
      userData.body.id,
      userSpotifyApi.getAccessToken(),
      newExpireDate
    );
  }
  let user = {
    spotify_user_id: userData.body.id,
    spotify_auth_token: userSpotifyApi.getAccessToken(),
    spotify_refresh_token: userSpotifyApi.getRefreshToken(),
    spotify_expires_at: userTokens.expire_date,
    spotify_display_name: userData.body.display_name,
    auth_token: utils.generateAuthToken(),
  };
  user = await sql.upsertUser(user);
  return user[0];
}

module.exports = { authorizeURL, getUserTokens, getUserData };
