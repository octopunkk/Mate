exports.up = async function (DB) {
  await DB`
    CREATE TABLE playersInRooms (
      room_id text REFERENCES rooms(room_id),
      player_id text REFERENCES users (spotify_user_id),
      PRIMARY KEY (room_id, player_id)
    )
  `;
};

exports.down = async function (DB) {
  await DB`DROP TABLE playersInRooms`;
};
