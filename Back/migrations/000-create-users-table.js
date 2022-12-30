exports.up = async function (DB) {
  await DB`
    CREATE TABLE users (
      spotify_user_id text PRIMARY KEY,
      spotify_auth_token text NOT NULL,
      spotify_refresh_token text NOT NULL,
      spotify_expires_at DATE NOT NULL,
      auth_token text NOT NULL
    )
  `;
};

exports.down = async function (DB) {
  await DB`DROP TABLE users`;
};
