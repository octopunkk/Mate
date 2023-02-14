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
  const authToken = ctx.header.authorization.split(" ")[1];
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

async function createRoom(ctx) {
  const authToken = ctx.header.authorization.split(" ")[1];
  const user = (await sql.userFromAuthToken(authToken))[0];
  if (user) {
    const res = await sql.getRoomFromHost(user.spotify_user_id);
    // console.log(res);
    ctx.body = {
      roomId: res[0].room_id,
    };
    ctx.status = 201;
  } else {
    ctx.body = "Authentification failed";
    ctx.status = 401;
  }
}

async function getPlayersInRoom(ctx) {
  const authToken = ctx.header.authorization.split(" ")[1];
  const user = (await sql.userFromAuthToken(authToken))[0];
  if (user) {
    const res = await sql.getPlayersFromRoom(ctx.params.roomId);
    ctx.body = res[0];
    ctx.status = 200;
  } else {
    ctx.body = "Authentification failed";
    ctx.status = 401;
  }
}
async function joinRoom(ctx) {
  const authToken = ctx.header.authorization.split(" ")[1];
  const user = (await sql.userFromAuthToken(authToken))[0];
  if (user) {
    const res = await sql.joinRoom(ctx.params.roomId, user.spotify_user_id);
    if (res) {
      ctx.body = res[0];
      ctx.status = 201;
    } else {
      ctx.body = "Room doesn't exist";
      ctx.status = 404;
    }
  } else {
    ctx.body = "Authentification failed";
    ctx.status = 401;
  }
}

module.exports = {
  getAuthURL,
  addUser,
  getUser,
  createRoom,
  getPlayersInRoom,
  joinRoom,
};
