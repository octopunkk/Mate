const utils = require("./utils/utils");
const postgres = require("postgres");

const db = postgres({
  host: process.env.PGHOST,
  port: 5432,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

async function upsertUser(user) {
  const q = await db`
  INSERT INTO users (
    spotify_user_id, spotify_auth_token, spotify_refresh_token, spotify_expires_at, spotify_display_name, auth_token
  ) VALUES (
    ${user.spotify_user_id}, ${user.spotify_auth_token}, ${user.spotify_refresh_token}, ${user.spotify_expires_at}, ${user.spotify_display_name},${user.auth_token}
  )
  ON CONFLICT DO NOTHING
  RETURNING *
`;
  const q2 = await db`
  SELECT * FROM users
  WHERE spotify_user_id = ${user.spotify_user_id}
  `;
  return q2;
}

async function userFromId(spotify_user_id) {
  const q = await db`
    SELECT * FROM users
    WHERE spotify_user_id = ${spotify_user_id}
  `;
  return q[0];
}

async function userFromAuthToken(auth_token) {
  const q = await db`
    SELECT * FROM users
    WHERE auth_token = ${auth_token}
  `;
  return q;
}

async function refreshToken(credentials) {
  const q = await db`
  UPDATE users
  SET spotify_auth_token = ${credentials.spotify_auth_token}, spotify_expires_at = ${credentials.spotify_expires_at}
  WHERE spotify_user_id = ${credentials.spotify_user_id}
  `;
  return q;
}

async function addPlayerToRoom(spotify_user_id, room_id) {
  const q = await db`
    INSERT INTO players_in_rooms (
      room_id, player_id
    ) VALUES (
      ${room_id}, ${spotify_user_id}
    )
    ON CONFLICT DO NOTHING
    RETURNING *
    `;
  return { room_id: room_id };
}

async function getRoomFromHost(spotify_user_id) {
  const q = await db`
  SELECT * FROM rooms
  WHERE host_player_id = ${spotify_user_id}
  `;
  if (q[0]) {
    return q[0];
  }
  const roomId = utils.getRandomState(5);
  const q2 = await db`
    INSERT INTO rooms (
      id, host_player_id
    ) VALUES (
      ${roomId}, ${spotify_user_id}
    )
    RETURNING *
    `;
  return q2[0];
}

async function getRoomFromId(room_id) {
  const q = await db`
  SELECT * FROM rooms
  WHERE id = ${room_id}
`;
  return q;
}

async function getHost(room_id) {
  const q = await db`
  SELECT spotify_display_name, host_player_id FROM rooms
  JOIN users ON spotify_user_id = host_player_id
  WHERE id = ${room_id}
`;
  return q[0];
}

async function getPlayersFromRoom(room_id) {
  const q = await db`
    SELECT 
      users.spotify_user_id,
      users.spotify_display_name
    FROM players_in_rooms
    INNER JOIN users
    ON player_id = spotify_user_id
    WHERE room_id = ${room_id}
    UNION
    SELECT 
      users.spotify_user_id,
      users.spotify_display_name
    FROM rooms
    INNER JOIN users
    ON host_player_id = spotify_user_id
    WHERE id = ${room_id}
  `;
  return q;
}

async function joinRoom(room_id, player_id) {
  return await addPlayerToRoom(player_id, room_id);
}

async function quitRoom(room_id, player_id) {
  return await db`
  DELETE FROM players_in_rooms
  WHERE room_id = ${room_id} AND player_id = ${player_id}
`;
}
module.exports = {
  upsertUser,
  userFromAuthToken,
  userFromId,
  refreshToken,
  getRoomFromHost,
  getRoomFromId,
  addPlayerToRoom,
  getPlayersFromRoom,
  joinRoom,
  getHost,
  quitRoom,
};
