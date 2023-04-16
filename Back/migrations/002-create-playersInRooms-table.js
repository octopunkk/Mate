exports.up = async function (DB) {
  await DB`
    CREATE TABLE players_in_rooms (
      room_id text REFERENCES rooms(id),
      player_id uuid REFERENCES users(id),
      PRIMARY KEY (room_id, player_id)
    )
  `;
};

exports.down = async function (DB) {
  await DB`DROP TABLE players_in_rooms`;
};
