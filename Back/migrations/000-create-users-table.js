exports.up = async function (DB) {
  await DB`
    CREATE TABLE users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL UNIQUE,
      auth_token text NOT NULL,
      hashed_password text NOT NULL,
      info jsonb
    )
  `;
};

exports.down = async function (DB) {
  await DB`DROP TABLE users`;
};
