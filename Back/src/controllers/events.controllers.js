const Spotify = require("../utils/spotify");
const sql = require("../sql");
const { Unauthorized } = require("../utils/errorMiddleware");

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
  ctx.body = {
    displayName: ctx.user.spotify_display_name,
    userId: ctx.user.spotify_user_id,
  };
  ctx.status = 200;
}

async function createRoom(ctx) {
  const res = await sql.getRoomFromHost(ctx.user.spotify_user_id);
  ctx.body = res;
  ctx.status = 201;
}

async function getRoomInfo(ctx) {
  const players = await sql.getPlayersFromRoom(ctx.params.id);
  const host = await sql.getHost(ctx.params.id);
  ctx.body = { players: players, host: host };
  ctx.status = 200;
}

async function joinRoom(ctx) {
  const res = await sql.joinRoom(ctx.params.id, ctx.user.spotify_user_id);
  if (res) {
    ctx.body = res;
    ctx.status = 201;
  } else {
    ctx.body = "Room doesn't exist";
    ctx.status = 404;
  }
}

async function quitRoom(ctx) {
  const res = await sql.quitRoom(ctx.params.id, ctx.user.spotify_user_id);
  if (res) {
    ctx.body = res;
    ctx.status = 200;
  } else {
    ctx.body = res;
    ctx.status = 404;
  }
}
async function kickFromRoom(ctx) {
  const host = await sql.getHost(ctx.params.id);
  if (host.host_player_id !== ctx.user.spotify_user_id) {
    ctx.body = "Request unauthorized";
    ctx.status = 403;
    return;
  }
  const res = await sql.quitRoom(ctx.params.id, ctx.params.playerId);
  if (!res) {
    ctx.body = res;
    ctx.status = 400;
    return;
  }
  ctx.body = res;
  ctx.status = 200;
}

const assertIsHost = (ctx, hostId) => {
  if (hostId !== ctx.user.spotify_user_id) {
    throw new Unauthorized("is not game host");
  }
};

async function getPlaylist(ctx) {
  const host = await sql.getHost(ctx.params.id);
  assertIsHost(ctx, host.host_player_id);

  const players = await sql.getPlayersFromRoom(ctx.params.id);
  const tracks = await Promise.all(
    players.map(async (player) => {
      const playerData = await sql.userFromId(player.spotify_user_id);
      const playerTopTracks = await Spotify.getUserTopTracks(playerData);
      const recommendations = await Spotify.getRecommendations(
        playerData,
        playerTopTracks
          .map((track) => track.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)
      );
      return [
        ...playerTopTracks
          .filter((track) => !!track.preview)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3),
        ...recommendations,
      ];
    })
  );

  // TODO : use removeDuplicates(array, track => track.id) func from utils instead
  let playlist = [];
  tracks.flat().forEach((track) => {
    if (!playlist.some((e) => e.id == track.id)) {
      playlist.push(track);
    }
  });

  ctx.body = playlist.sort(() => 0.5 - Math.random());
  ctx.status = 200;
}

module.exports = {
  getAuthURL,
  addUser,
  getUser,
  createRoom,
  joinRoom,
  getRoomInfo,
  quitRoom,
  kickFromRoom,
  getPlaylist,
};
