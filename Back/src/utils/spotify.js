const SpotifyWebApi = require("spotify-web-api-node");
const utils = require("../utils/utils");

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
    expires_in: utils.getExpireDate(data.body["expires_in"]),
    access_token: data.body["access_token"],
    refresh_token: data.body["refresh_token"],
  };
}

async function refreshSpotifyToken(userSpotifyApi, expire_date) {
  try {
    if (!expire_date || Date.now() > expire_date) {
      const data = await userSpotifyApi.refreshAccessToken();
      userSpotifyApi.setAccessToken(data.body["access_token"]);
    }
  } catch (err) {
    console.log("Could not refresh access token", err);
  }
  return userSpotifyApi;
}

async function getUserSpotifyId(userTokens) {
  let userSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    accessToken: userTokens.access_token,
    refreshToken: userTokens.refresh_token,
  });
  userSpotifyApi = await refreshSpotifyToken(
    userSpotifyApi,
    userTokens.expire_date
  );
  console.log(userSpotifyApi);
  const userData = await userSpotifyApi.getMe();
  console.log(userData);
  return userData;
}

module.exports = { authorizeURL, getUserTokens, getUserSpotifyId };
