const URL = "http://127.0.0.1:8000/";

// async function getData() {
//   let data = await fetch(URLget, { method: "GET" });
//   let json = await data.json();
//   console.log(json);
// }

async function postAuthCode(authCode) {
  const response = await fetch(URL + "user", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "default",
    body: JSON.stringify({ authCode }),
  });
  let json = await response.json();
  localStorage.setItem("authToken", json.auth_token);
  localStorage.setItem("displayName", json.display_name);
  localStorage.setItem("profilePic", json.profile_pic);
}

async function postAuthToken(authToken) {
  const response = await fetch(URL + "authToken", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "default",
    body: JSON.stringify({ authToken }),
  });
  let json = await response.json();
  return json.ok;
}

export default { postAuthCode, postAuthToken };
