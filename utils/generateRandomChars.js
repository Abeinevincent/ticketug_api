// generate random 42 character number
function generateRandomCharacter() {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return characters.charAt(Math.floor(Math.random() * characters.length));
}

function generateRandomString() {
  let result = "";
  for (let i = 0; i < 42; i++) {
    result += generateRandomCharacter();
    if ((i + 1) % 6 === 0 && i !== 41) {
      result += "-";
    }
  }
  return result;
}

module.exports = { generateRandomString };
