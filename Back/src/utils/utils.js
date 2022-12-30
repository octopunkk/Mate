const getRandomState = (num) => {
  let state = "";
  for (let i = 0; i < num; i++) {
    charCode = Math.floor(Math.random() * 26) + 65;
    state += String.fromCharCode(charCode);
  }
  return state;
};

const getExpireDate = (expires_in) => {
  return new Date() + expires_in;
};

module.exports = { getRandomState, getExpireDate };
