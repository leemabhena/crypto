"use strict";

// Set up the constants, num letters, letters and letters table
const NUM_LETTERS = 26;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// check if the random key was clicked

const randomBtn = document.querySelector(".random");

randomBtn.addEventListener("click", () => {
  const randomKeySize = Number(document.getElementById("key-size").value);

  if (randomKeySize <= 0) {
    alert("Invalid key");
  } else {
    const randomKey = getRandomKey(randomKeySize);
    document.getElementById("text-key").value = randomKey;
  }
});

// Do the encryption

const keyEL = document.getElementById("text-key");
const plaintext = document.getElementById("plain");
const outputEl = document.querySelector(".ciphertext");

plaintext.addEventListener("input", () => {
  // parse the text
  const showPunctuation = document.getElementById("punctuation").value;
  let cipher;
  if (showPunctuation === "show") {
    cipher = parseText(plaintext.value);
  } else {
    cipher = parseText(plaintext.value, true);
  }
  // grab the key
  if (keyEL.value.length <= 0) {
    // use CRYPTO as default
    outputEl.textContent = vigeneCipher(cipher, "CRYPTO", ENCODE);
  } else {
    outputEl.textContent = vigeneCipher(cipher, keyEL.value, ENCODE);
  }
});

// update the cipher text on change of the select
const showPunctuationEL = document.getElementById("punctuation");

showPunctuationEL.addEventListener("change", () => {
  if (plaintext.value.length > 0) {
    const state = showPunctuationEL.value;

    let cipher;
    if (state === "show") {
      cipher = parseText(plaintext.value);
    } else {
      cipher = parseText(plaintext.value, true);
    }
    if (keyEL.value.length <= 0) {
      // use CRYPTO as default
      outputEl.textContent = vigeneCipher(cipher, "CRYPTO", ENCODE);
    } else {
      outputEl.textContent = vigeneCipher(cipher, keyEL.value, ENCODE);
    }
  }
});

// update when there is a change in the key
keyEL.addEventListener("input", () => {
  if (plaintext.value.length > 0) {
    const state = showPunctuationEL.value;
    let cipher;
    if (state === "show") {
      cipher = parseText(plaintext.value);
    } else {
      cipher = parseText(plaintext.value, true);
    }

    if (keyEL.value.length <= 0) {
      // use CRYPTO as default
      outputEl.textContent = vigeneCipher(cipher, "CRYPTO", ENCODE);
    } else {
      outputEl.textContent = vigeneCipher(cipher, keyEL.value, ENCODE);
    }
  }
});

let ENCODE = true; // show if the text is to be hidden or shown

// handle the hide/show button clicks
const toggleButtonsCont = document.querySelector(".encrypt-buttons");

toggleButtonsCont.addEventListener("click", (event) => {
  // make sure the correct element is selected
  if (event.target.classList.contains("sh")) {
    // remove the active class from all the children
    for (let i = 0; i < toggleButtonsCont.children.length; i++) {
      toggleButtonsCont.children[i].classList.remove("active-btn");
    }

    // add the active class to clicked button
    event.target.classList.add("active-btn");

    // clear the textarea and the output p
    plaintext.value = "";
    outputEl.textContent = "";

    // show the correct section
    if (event.target.textContent === "Encode") {
      document.querySelector(".input-p").textContent = "Enter plaintext below";
      document.querySelector(".output-p").textContent = "Cipher text:";
      ENCODE = true;
    } else {
      document.querySelector(".input-p").textContent = "Enter ciphertext below";
      document.querySelector(".output-p").textContent = "Plain text:";
      ENCODE = false;
    }
  }
});

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

function getRandomKey(length) {
  let output = "";

  for (let i = 0; i < length; i++) {
    const pos = Math.floor(Math.random() * 26);
    output += LETTERS[pos];
  }

  return output;
}

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll("select");
  const instances = M.FormSelect.init(elems);
});
