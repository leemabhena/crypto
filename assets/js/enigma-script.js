import Enigma, {
  Keyboard,
  PlugBoard,
  rotorTurnoverNotches,
  rotors,
  Rotor,
  Reflector,
  reflectors,
} from "./enigma.js";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll("select");
  const instances = M.FormSelect.init(elems);
});

// setup the settings

function init() {
  const kB = new Keyboard();

  // plugboard
  const plugBoardEL = document.getElementById("plugboard");
  const value = plugBoardEL.value.trim().split(" ");
  // validate input
  for (let pair of value) {
    if (pair.length !== 2) {
      alert("Plugboard settings should be of form 'AB CD EF'");
      value = [];
      break;
    } else {
      const [first, second] = pair;
      if (!isLetter(first) || !isLetter(second)) {
        alert("Plugboard settings should be of form 'AB CD EF");
        value = [];
        break;
      }
    }
  }

  const pB = new PlugBoard(value);

  // move on to the reflector
  const whichReflector = document.getElementById("reflector").value;
  const posRe = "ABC".indexOf(whichReflector);

  const reflector = new Reflector(reflectors[posRe]);

  // rotor 1
  const rotor1El = document.getElementById("rotor1").value;
  const rotor1Pos = Number(rotor1El);
  const I = new Rotor(rotors[rotor1Pos], rotorTurnoverNotches[rotor1Pos]);

  // rotor 2
  const rotor2El = document.getElementById("rotor2").value;
  const rotor2Pos = Number(rotor2El);
  const II = new Rotor(rotors[rotor2Pos], rotorTurnoverNotches[rotor2Pos]);

  // rotor 3
  const rotor3El = document.getElementById("rotor3").value;
  const rotor3Pos = Number(rotor3El);
  const III = new Rotor(rotors[rotor3Pos], rotorTurnoverNotches[rotor3Pos]);

  return new Enigma(reflector, I, II, III, pB, kB);
}

let enigma = init();

// set rings

const ring1 = document.getElementById("ring1");
const ring2 = document.getElementById("ring2");
const ring3 = document.getElementById("ring3");
// if ring setting is undefined use 1
const ringSetting = [
  Number(ring1.value) || 1,
  Number(ring2.value) || 1,
  Number(ring3.value) || 1,
];

enigma.setRings(ringSetting);

// set the message key i.e the starting position of the rotors
const key1 = document.getElementById("key1");
const key2 = document.getElementById("key2");
const key3 = document.getElementById("key3");

const keySetting =
  LETTERS[Number(key1.value) - 1 || 11] +
  LETTERS[Number(key2.value) - 1 || 4] +
  LETTERS[Number(key3.value) - 1 || 4];

enigma.setKey(keySetting);

// when there is a change to the text area encrypt / decrypt
const enigmaTextEl = document.getElementById("enigma-text");
const enigmaBtn = document.getElementById("encrypt-btn");
enigmaBtn.addEventListener("click", () => {
  const text = enigmaTextEl.value.toUpperCase();
  let output = "";
  // encrypt each letter
  for (let i = 0; i < text.length; i++) {
    if (isLetter(text[i])) {
      output += enigma.encrypt(text[i]);
    } else {
      output += text[i];
    }
  }

  document.getElementById("display-text").textContent = output;
});

function isLetter(letter) {
  return LETTERS.indexOf(letter) != -1;
}

// add the characters for each letter
function showKey() {
  // print the char associated with each key
  const keys = document.querySelectorAll(".keys");
  keys.forEach((key) => {
    const value = Number(key.value) || 1;
    key.nextSibling.textContent = LETTERS[value - 1];
  });

  // print the char associated with each ring
  const rings = document.querySelectorAll(".rings");
  rings.forEach((ring) => {
    const value = Number(ring.value) || 1;
    ring.nextSibling.textContent = LETTERS[value - 1];
  });
}

showKey();

// when change the rings update the letter also
const keys = document.querySelectorAll(".keys");
keys.forEach((key) => {
  key.addEventListener("input", () => {
    // update the character next to it
    let val;
    if (Number(key.value) < 1) {
      val = 1;
    } else if (Number(key.value) > 26) {
      val = 26;
      key.value = 26;
    } else {
      val = Number(key.value);
    }
    key.nextSibling.textContent = LETTERS[val - 1];
  });
});

// when loses focus do error checking
keys.forEach((key) => {
  key.addEventListener("blur", () => {
    // update the character next to it
    let val;
    if (Number(key.value) < 1) {
      val = 1;
      key.value = val;
    } else if (Number(key.value) > 26) {
      val = 26;
      key.value = 26;
    } else {
      val = Number(key.value);
    }
    key.nextSibling.textContent = LETTERS[val - 1];
  });
});

const rings = document.querySelectorAll(".rings");

rings.forEach((ring) => {
  ring.addEventListener("input", () => {
    // update the character next to it
    let val;
    if (Number(ring.value) < 1) {
      val = 1;
    } else if (Number(ring.value) > 26) {
      val = 26;
      ring.value = 26;
    } else {
      val = Number(ring.value);
    }
    ring.nextSibling.textContent = LETTERS[val - 1];
  });
});

// when loses focus do error checking
rings.forEach((ring) => {
  ring.addEventListener("blur", () => {
    // update the character next to it
    let val;
    if (Number(ring.value) < 1) {
      val = 1;
      ring.value = val;
    } else if (Number(ring.value) > 26) {
      val = 26;
      ring.value = 26;
    } else {
      val = Number(ring.value);
    }
    ring.nextSibling.textContent = LETTERS[val - 1];
  });
});

const updateBtn = document.getElementById("update");
updateBtn.addEventListener("click", () => {
  enigma = init();
  // set the ring settings
  const ringSetting = [
    Number(ring1.value) || 1,
    Number(ring2.value) || 1,
    Number(ring3.value) || 1,
  ];

  enigma.setRings(ringSetting);
  // set key
  const keySetting =
    LETTERS[Number(key1.value) - 1 || 11] +
    LETTERS[Number(key2.value) - 1 || 4] +
    LETTERS[Number(key3.value) - 1 || 4];

  enigma.setKey(keySetting);

  // Give feedback on successful update
  M.toast({ html: "Updated Successfully!" });
});
