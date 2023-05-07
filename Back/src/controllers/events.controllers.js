const Spotify = require("../utils/spotify");
const sql = require("../sql");
const { Unauthorized } = require("../utils/errorMiddleware");
const bcrypt = require("bcrypt");
const utils = require("../utils/utils");

async function addUser(ctx) {
  console.log("adding user");
  console.log(ctx.request.body);
  const hash = await bcrypt.hash(ctx.request.body.password, 5);
  try {
    const user = await sql.addUser({
      name: ctx.request.body.name,
      hash: hash,
      auth_token: utils.generateAuthToken(),
    });
    ctx.body = {
      auth_token: user.auth_token,
    };
    ctx.status = 201;
  } catch (err) {
    ctx.status = 409;
  }
}

async function connectUser(ctx) {
  console.log("login user");
  const user = await sql.userFromName(ctx.request.body.name);
  console.log(user);
  const correctPassword = await bcrypt.compare(
    ctx.request.body.password,
    user.hashed_password
  );
  if (correctPassword) {
    ctx.status = 200;
    ctx.body = { auth_token: user.auth_token };
  } else {
    ctx.status = 403;
  }
}

async function getUser(ctx) {
  ctx.body = {
    displayName: ctx.user.name,
    userId: ctx.user.id,
  };
  ctx.status = 200;
}

async function createRoom(ctx) {
  const res = await sql.getRoomFromHost(ctx.user.id);
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
  const res = await sql.joinRoom(ctx.params.id, ctx.user.id);
  if (res) {
    ctx.body = res;
    ctx.status = 201;
  } else {
    ctx.body = "Room doesn't exist";
    ctx.status = 404;
  }
}

async function quitRoom(ctx) {
  const res = await sql.quitRoom(ctx.params.id, ctx.user.id);
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
  if (host.host_player_id !== ctx.user.id) {
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
  if (hostId !== ctx.user.id) {
    throw new Unauthorized("is not game host");
  }
};

async function getPlaylist(ctx) {
  const host = await sql.getHost(ctx.params.id);
  assertIsHost(ctx, host.host_player_id);

  const players = await sql.getPlayersFromRoom(ctx.params.id);
  const tracks = await Promise.all(
    players.map(async (player) => {
      const playerData = await sql.userFromId(player.id);
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
  addUser,
  connectUser,
  getUser,
  createRoom,
  joinRoom,
  getRoomInfo,
  quitRoom,
  kickFromRoom,
  getPlaylist,
};
