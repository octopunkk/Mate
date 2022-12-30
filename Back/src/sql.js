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

async function insertUser(user) {
  const q = await db`
  insert into users (
    spotify_user_id, spotify_auth_token, spotify_refresh_token, spotify_expires_at, auth_token
  ) values (
    ${user.spotify_user_id}, ${user.spotify_auth_token}, ${user.spotify_refresh_token}, ${user.spotify_expires_at}, ${user.auth_token}
  )
  returning *
`;
  return q;
}

async function findUser(spotify_user_id) {}
