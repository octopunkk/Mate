const SpotifyWebApi = require("spotify-web-api-node");
const utils = require("../utils/utils");
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const scopes = ["user-top-read"];

const authorizeURL = () => {
  return spotifyApi.createAuthorizeURL(scopes, utils.getRandomState(10));
};

async function getAuthorizationTokens(code) {
  const data = await spotifyApi.authorizationCodeGrant(code);
  console.log("The token expires in " + data.body["expires_in"]);
  console.log("The access token is " + data.body["access_token"]);
  console.log("The refresh token is " + data.body["refresh_token"]);

  // spotifyApi.setAccessToken(data.body['access_token']);
  // spotifyApi.setRefreshToken(data.body['refresh_token']);
}
module.exports = { authorizeURL, getAuthorizationTokens };
