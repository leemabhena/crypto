"use strict";

// Set up the constants, num letters, letters and letters table
const NUM_LETTERS = 26;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const keyEL = document.getElementById("email_inline");
const plaintext = document.getElementById("ceasar-plain");
const outputEl = document.querySelector(".ceaser-cipher");

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
  const key = ENCODE ? Number(keyEL.value) : -1 * Number(keyEL.value);
  outputEl.textContent = caesarCipher(cipher, key);
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
    const key = ENCODE ? Number(keyEL.value) : -1 * Number(keyEL.value);
    outputEl.textContent = caesarCipher(cipher, key);
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

    const key = ENCODE ? Number(keyEL.value) : -1 * Number(keyEL.value);
    outputEl.textContent = caesarCipher(cipher, key);
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

    // clear the textarea and the outpu p
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

function caesarCipher(text, key = 3) {
  let output = "";

  // build the plain / cipher text
  for (let i = 0; i < text.length; i++) {
    // check if it is letter and add the key if so
    if (isLetter(text[i])) {
      const index = mod(LETTERS.indexOf(text[i]) + key, NUM_LETTERS);
      output += LETTERS[index];
    } else {
      // append the punctuation marks without change
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

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll("select");
  const instances = M.FormSelect.init(elems);
});
