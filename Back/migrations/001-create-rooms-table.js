exports.up = async function (DB) {
  await DB`
    CREATE TABLE rooms (
      room_id text PRIMARY KEY,
      host_player_id text,
      players text[],
      playlist text[]
    )
  `;
};

exports.down = async function (DB) {
  await DB`DROP TABLE rooms`;
};
