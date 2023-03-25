async function getAuthorizeURL() {
  const URL = "https://mate.apps.besson.co/get_auth_url";
  let data = await fetch(URL, { method: "GET" });
  let json = await data.json();
  return json.url;
}

const Spotify = { getAuthorizeURL };
export default Spotify;
