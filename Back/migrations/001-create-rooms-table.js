exports.up = async function (DB) {
  await DB`
    CREATE TABLE rooms (
      id text PRIMARY KEY,
      host_player_id uuid NOT NULL REFERENCES users (id)
    )
  `;
};

exports.down = async function (DB) {
  await DB`DROP TABLE rooms`;
};
