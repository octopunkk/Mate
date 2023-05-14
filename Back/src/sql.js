const utils = require("./utils/utils");
const postgres = require("postgres");

const db = postgres(
  process.env.DATABASE_URL || {
    host: process.env.PGHOST,
    port: 5432,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  }
);

async function addUser(user) {
  const q = await db`
  INSERT INTO users (
    name, hashed_password, auth_token
  ) VALUES (
    ${user.name}, ${user.hash},${user.auth_token}
  )
  RETURNING *
`;
  return q[0];
}

async function userFromName(name) {
  const q = await db`
    SELECT * FROM users
    WHERE name = ${name}
  `;
  return q[0];
}

async function upsertUser(user) {
  const q = await db`
  INSERT INTO users (
    id, name, auth_token
  ) VALUES (
    ${user.id}, ${user.name},${user.auth_token}
  )
  ON CONFLICT DO NOTHING
  RETURNING *
`;
  const q2 = await db`
  SELECT * FROM users
  WHERE id = ${user.id}
  `;
  return q2;
}

async function userFromId(id) {
  const q = await db`
    SELECT * FROM users
    WHERE id = ${id}
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

async function addPlayerToRoom(id, room_id) {
  const q = await db`
    INSERT INTO players_in_rooms (
      room_id, player_id
    ) VALUES (
      ${room_id}, ${id}
    )
    ON CONFLICT DO NOTHING
    RETURNING *
    `;
  return { room_id: room_id };
}

async function getRoomFromHost(id) {
  const q = await db`
  SELECT * FROM rooms
  WHERE host_player_id = ${id}
  `;
  if (q[0]) {
    return q[0];
  }
  const roomId = utils.getRandomState(5);
  const q2 = await db`
    INSERT INTO rooms (
      id, host_player_id
    ) VALUES (
      ${roomId}, ${id}
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
  SELECT name, host_player_id FROM rooms
  JOIN users ON id = host_player_id
  WHERE id = ${room_id}
`;
  return q[0];
}

async function getPlayersFromRoom(room_id) {
  const q = await db`
    SELECT 
      users.id,
      users.name
    FROM players_in_rooms
    INNER JOIN users
    ON player_id = id
    WHERE room_id = ${room_id}
    UNION
    SELECT 
      users.id,
      users.name
    FROM rooms
    INNER JOIN users
    ON host_player_id = id
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

async function updateTracklist(tracklist, player_id) {
  return await db`
  UPDATE users
  SET info = (${JSON.stringify(tracklist)})
  WHERE id = ${player_id}
  `;
}
module.exports = {
  addUser,
  upsertUser,
  userFromAuthToken,
  userFromId,
  userFromName,
  getRoomFromHost,
  getRoomFromId,
  addPlayerToRoom,
  getPlayersFromRoom,
  joinRoom,
  getHost,
  quitRoom,
  updateTracklist,
};
