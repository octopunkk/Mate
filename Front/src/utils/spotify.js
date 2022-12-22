async function getAuthorizeURL() {
  const URL = "http://127.0.0.1:8000/get_auth_url";
  let data = await fetch(URL, { method: "GET" });
  let json = await data.json();
  return json.url;
}

const Spotify = { getAuthorizeURL };
export default Spotify;
