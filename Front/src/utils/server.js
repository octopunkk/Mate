const URL = "https://mate.apps.besson.co/";

const postData = async (data, endpoint, authToken) => {
  const response = await fetch(URL + endpoint, {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },

    cache: "default",
    body: JSON.stringify(data),
  });
  if (response.ok) {
    return await response.json();
  } else {
    console.log(response.statusText);
    throw new Error(response.statusText);
  }
};

const getData = async (endpoint, authToken) => {
  const response = await fetch(URL + endpoint, {
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    cache: "default",
  });
  return await response.json();
};

const deleteData = async (data, endpoint, authToken) => {
  const response = await fetch(URL + endpoint, {
    method: "DELETE",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },

    cache: "default",
    body: JSON.stringify(data),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(response.statusText);
  }
};

const postAuthCode = async (authCode) => {
  const response = await postData({ authCode }, "user");
  localStorage.setItem("authToken", response.auth_token);
  return response;
};

const getUser = async (authToken) => {
  const response = await getData("user/me", authToken);
  return response;
};

const createRoom = async (authToken) => {
  const response = await postData({}, "room", authToken);
  return response;
};

const getRoomInfo = async (authToken, roomId) => {
  const response = await getData("room/" + roomId, authToken);
  return response;
};

const joinRoom = async (authToken, roomId) => {
  return await postData({}, "room/" + roomId + "/join", authToken);
};

const quitRoom = async (authToken, roomId) => {
  return await postData({}, "room/" + roomId + "/quit", authToken);
};

const kickFromRoom = async (authToken, roomId, playerId) => {
  return await deleteData(
    {},
    "room/" + roomId + "/players/" + playerId,
    authToken
  );
};

const getPlaylist = async (authToken, roomId) => {
  return await getData("room/" + roomId + "/playlist", authToken);
};

export default {
  postAuthCode,
  getUser,
  createRoom,
  getRoomInfo,
  joinRoom,
  quitRoom,
  kickFromRoom,
  getPlaylist,
};
