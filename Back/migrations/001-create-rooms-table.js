exports.up = async function (DB) {
  await DB`
    CREATE TABLE rooms (
      id text PRIMARY KEY,
      host_player_id text NOT NULL REFERENCES users (spotify_user_id)
    )
  `;
};

exports.down = async function (DB) {
  await DB`DROP TABLE rooms`;
};
