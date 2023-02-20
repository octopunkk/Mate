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
      ctx.body = res;
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

async function getHost(ctx) {
  const authToken = ctx.header.authorization.split(" ")[1];
  const user = (await sql.userFromAuthToken(authToken))[0];
  if (user) {
    const res = await sql.getHost(ctx.params.roomId);
    ctx.body = res[0];
    ctx.status = 200;
  } else {
    ctx.body = "Authentification failed";
    ctx.status = 401;
  }
}

async function quitRoom(ctx) {
  const authToken = ctx.header.authorization.split(" ")[1];
  const user = (await sql.userFromAuthToken(authToken))[0];
  if (user) {
    const res = await sql.quitRoom(ctx.params.roomId, user.spotify_user_id);
    if (res) {
      ctx.body = res;
      ctx.status = 200;
    } else {
      ctx.body = res;
      ctx.status = 404;
    }
  } else {
    ctx.body = "Authentification failed";
    ctx.status = 401;
  }
}
async function kickFromRoom(ctx) {
  const authToken = ctx.header.authorization.split(" ")[1];
  const user = (await sql.userFromAuthToken(authToken))[0];
  if (user) {
    const host = await sql.getHost(ctx.params.roomId);

    if (host[0].host_player_id == user.spotify_user_id) {
      const res = await sql.quitRoom(
        ctx.params.roomId,
        ctx.request.body.player_id
      );
      if (res) {
        ctx.body = res;
        ctx.status = 200;
      } else {
        ctx.body = res;
        ctx.status = 400;
      }
    } else {
      ctx.body = "Request unauthorized";
      ctx.status = 403;
    }
  } else {
    ctx.body = "Authentification failed";
    ctx.status = 401;
  }
}

async function getPlaylist(ctx) {
  const authToken = ctx.header.authorization.split(" ")[1];
  const user = (await sql.userFromAuthToken(authToken))[0];
  // check for correct authentication
  if (user) {
    const players = (await sql.getPlayersFromRoom(ctx.params.roomId))[0]
      .players;
    let playlist = [];
    // get top tracks ids for all players in the room
    await Promise.all(
      players.map(async (player) => {
        const topTracks = [];

        const playerTokens = (await sql.userFromId(player.spotify_user_id))[0];
        const playerTopTracks = await Spotify.getUserTopTracks(
          {
            access_token: playerTokens.spotify_auth_token,
            refresh_token: playerTokens.spotify_refresh_token,
            expire_date: playerTokens.spotify_expires_at,
          },
          player.spotify_user_id
        );
        playerTopTracks.forEach((track) => topTracks.push(track.id));
        playlist.push(
          playerTopTracks.filter((track) => !!track.preview).slice(0, 3)
        );
        // get recommendations based on these ids
        const recommendations = await Spotify.getRecommendations(
          {
            access_token: playerTokens.spotify_auth_token,
            refresh_token: playerTokens.spotify_refresh_token,
            expire_date: playerTokens.spotify_expires_at,
          },
          player.spotify_user_id,
          topTracks.slice(0, 5)
        );
        playlist.push(recommendations);
      })
    );
    ctx.body = playlist.flat().sort(() => 0.5 - Math.random());
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
  createRoom,
  getPlayersInRoom,
  joinRoom,
  getHost,
  quitRoom,
  kickFromRoom,
  getPlaylist,
};
