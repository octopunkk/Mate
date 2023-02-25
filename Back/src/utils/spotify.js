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

async function refreshSpotifyToken(userSpotifyApi, expire_date, userId) {
  let newExpireDate = expire_date;
  try {
    if (!expire_date || Date.now() > Date.parse(expire_date) + 60000) {
      const data = await userSpotifyApi.refreshAccessToken();
      userSpotifyApi.setAccessToken(data.body["access_token"]);
      newExpireDate = utils.getExpireDate(data.body["expires_in"]);
      if (userId) {
        await sql.refreshToken({
          spotify_user_id: userId,
          spotify_auth_token: userSpotifyApi.getAccessToken(),
          spotify_expires_at: newExpireDate,
        });
      }
    }
  } catch (err) {
    console.log("Could not refresh access token", err);
  }
  return newExpireDate;
}

async function createUserSpotifyApi(userTokens, userId) {
  const userSpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    accessToken: userTokens.access_token,
    refreshToken: userTokens.refresh_token,
  });
  if (userId) {
    await refreshSpotifyToken(userSpotifyApi, userTokens.expire_date, userId);
  }
  return userSpotifyApi;
}

async function getUserTopTracks(userData) {
  const userTokens = {
    access_token: userData.spotify_auth_token,
    refresh_token: userData.spotify_refresh_token,
    expire_date: userData.spotify_expires_at,
  };
  const userId = userData.spotify_user_id;
  const userSpotifyApi = await createUserSpotifyApi(userTokens, userId);
  const topTracks = await userSpotifyApi.getMyTopTracks();
  return topTracks.body.items.map((track) => {
    return {
      name: track.name,
      album: track.album.name,
      artist: track.artists[0].name,
      id: track.id,
      cover: track.album.images[0].url,
      preview: track.preview_url,
    };
  });
}

async function getUserTopArtists(userData) {
  const userTokens = {
    access_token: userData.spotify_auth_token,
    refresh_token: userData.spotify_refresh_token,
    expire_date: userData.spotify_expires_at,
  };
  const userId = userData.spotify_user_id;
  const userSpotifyApi = await createUserSpotifyApi(userTokens, userId);
  const topArtists = await userSpotifyApi.getMyTopArtists({ limit: 10 });
  return topArtists.body.items.map((e) => e.id);
}

async function getUserData(userTokens) {
  const userSpotifyApi = await createUserSpotifyApi(userTokens, null);
  const newExpireDate = await refreshSpotifyToken(
    userSpotifyApi,
    userTokens.expire_date
  );
  const userData = await userSpotifyApi.getMe();
  if (newExpireDate) {
    userTokens.expire_date = newExpireDate;
    await sql.refreshToken({
      spotify_user_id: userData.body.id,
      spotify_auth_token: userSpotifyApi.getAccessToken(),
      spotify_expires_at: newExpireDate,
    });
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

async function getRecommendations(userData, ids) {
  const userTokens = {
    access_token: userData.spotify_auth_token,
    refresh_token: userData.spotify_refresh_token,
    expire_date: userData.spotify_expires_at,
  };
  const userId = userData.spotify_user_id;
  const userSpotifyApi = await createUserSpotifyApi(userTokens, userId);
  const recoTracks = await userSpotifyApi.getRecommendations({
    seed_tracks: ids,
    min_popularity: 70,
    limit: 10,
    market: "FR",
  });
  const topArtists = await getUserTopArtists(userData);
  const recoArtists = await userSpotifyApi.getRecommendations({
    seed_artists: topArtists.sort(() => 0.5 - Math.random()).slice(0, 5),
    min_popularity: 70,
    limit: 10,
    market: "FR",
  });
  const reco = [...recoArtists.body.tracks, ...recoTracks.body.tracks];
  return reco
    .map((track) => {
      return {
        name: track.name,
        album: track.album.name,
        artist: track.artists[0].name,
        id: track.id,
        cover: track.album.images[0].url,
        preview: track.preview_url,
      };
    })
    .filter((track) => !!track.preview);
}

module.exports = {
  authorizeURL,
  getUserTokens,
  getUserData,
  getUserTopTracks,
  getRecommendations,
  getUserTopArtists,
};
