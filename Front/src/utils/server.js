const URL = "http://127.0.0.1:8000/";

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

const postAuthCode = async (authCode) => {
  const response = await postData({ authCode }, "user");
  localStorage.setItem("authToken", response.auth_token);
  return response;
};

const getUser = async (authToken) => {
  try {
    const response = await getData("user", authToken);
    return response;
  } catch {
    return 0;
  }
};

const createRoom = async (authToken) => {
  try {
    const response = await postData({}, "createRoom", authToken);
    return response;
  } catch {
    return 0;
  }
};

const getPlayersInRoom = async (authToken, roomId) => {
  try {
    const response = await getData("getPlayersInRoom/" + roomId, authToken);
    return response;
  } catch {
    return 0;
  }
};

const joinRoom = async (authToken, roomId) => {
  return await postData({}, "join/" + roomId, authToken);
};

export default {
  postAuthCode,
  getUser,
  createRoom,
  getPlayersInRoom,
  joinRoom,
};
