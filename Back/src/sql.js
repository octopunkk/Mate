const utils = require("./utils/utils");
const postgres = require("postgres");

const db = postgres({
  host: process.env.PGHOST,
  port: 5432,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

async function displayUsers() {
  const users = await db`
    select * from users
  `;
  console.log(users);
  return users;
}

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
  return q;
}

async function userFromAuthToken(auth_token) {
  const q = await db`
    SELECT * FROM users
    WHERE auth_token = ${auth_token}
  `;
  return q;
}

async function refreshToken(
  spotify_user_id,
  spotify_auth_token,
  spotify_expires_at
) {
  const q = await db`
  UPDATE users
  SET spotify_auth_token = ${spotify_auth_token}, spotify_expires_at = ${spotify_expires_at}
  WHERE spotify_user_id = ${spotify_user_id}
  `;
  return q;
}

async function addPlayerToRoom(spotify_user_id, room_id) {
  const q = await db`
    INSERT INTO playersInRooms (
      room_id, player_id
    ) VALUES (
      ${room_id}, ${spotify_user_id}
    )
    RETURNING *
    `;
  return q;
}

async function getRoomFromHost(spotify_user_id) {
  const q = await db`
  SELECT * FROM rooms
  WHERE host_player_id = ${spotify_user_id}
  `;
  if (q[0]) {
    return q;
  } else {
    const roomId = utils.getRandomState(5);
    const q2 = await db`
    INSERT INTO rooms (
      room_id, host_player_id
    ) VALUES (
      ${roomId}, ${spotify_user_id}
    )
    RETURNING *
    `;
    addPlayerToRoom(spotify_user_id, roomId);
    return q2;
  }
}

async function getRoomFromId(room_id) {
  const q = await db`
  SELECT * FROM rooms
  WHERE room_id = ${room_id}
`;
  return q;
}

async function getPlayersFromRoom(room_id) {
  const q = await db`
  SELECT 
    jsonb_agg(to_jsonb(users) - 'spotify_auth_token' - 'spotify_refresh_token' - 'spotify_expires_at' - 'auth_token') AS players
  FROM playersInRooms
  INNER JOIN users
  ON player_id = spotify_user_id
  WHERE room_id = ${room_id}
  GROUP BY room_id
`;
  return q;
}

async function joinRoom(room_id, player_id) {
  if ((await getRoomFromId(room_id))[0]) {
    return await addPlayerToRoom(player_id, room_id);
  }
}

module.exports = {
  upsertUser,
  displayUsers,
  userFromAuthToken,
  userFromId,
  refreshToken,
  getRoomFromHost,
  getRoomFromId,
  addPlayerToRoom,
  getPlayersFromRoom,
  joinRoom,
};
