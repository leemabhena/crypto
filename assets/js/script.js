function vigeneCipher(text, key, encrypt = true) {
  // if key is not >= text length assume its not running key
  const updatedKey = "".padEnd(text.length, key);

  let output = "";

  // generate the cipher text by adding the key and text
  for (let i = 0; i < text.length; i++) {
    // if it is a character
    if (isLetter(text[i])) {
      const textNum = LETTERS.indexOf(text[i]);
      const keyNum = LETTERS.indexOf(updatedKey[i]);
      const newValue = encrypt
        ? mod(textNum + keyNum, NUM_LETTERS)
        : mod(textNum - keyNum, NUM_LETTERS);
      output += LETTERS[newValue];
    } else {
      output += text[i];
    }
  }

  return output;
}

function isLetter(letter) {
  return LETTERS.indexOf(letter) != -1;
}

function parseText(text, punctuation = false) {
  text = text.toUpperCase();

  // do not have to remove punctuation
  if (!punctuation) {
    return text;
  }

  // remove the punctuation in text
  let output = "";
  for (let i = 0; i < text.length; i++) {
    if (isLetter(text[i])) {
      output += text[i];
    }
  }

  return output;
}

function mod(n, m) {
  // evaluate the mod
  return ((n % m) + m) % m;
}
