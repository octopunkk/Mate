exports.up = async function (DB) {
  await DB`
    CREATE TABLE rooms (
      room_id text PRIMARY KEY,
      host_player_id text REFERENCES users (spotify_user_id),
      playlist text[]
    )
  `;
};

exports.down = async function (DB) {
  await DB`DROP TABLE rooms`;
};
