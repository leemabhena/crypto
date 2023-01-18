"use strict";

const LETTERS_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// rotor settings
export const rotors = [
  "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
  "AJDKSIRUXBLHWTMCQGZNPYFVOE",
  "BDFHJLCPRTXVZNYEIWGAKMUSQO",
  "ESOVPZJAYQUIRHXLNFTGKDCMWB",
  "VZBRGITYUPSDNHLXAWMJQOFECK",
];

export const rotorTurnoverNotches = ["Q", "E", "V", "J", "Z"];

// Will use three reflectors A, B, C
export const reflectors = [
  "EJMZALYXVBWFCRQUONTSPIKHGD",
  "YRUHQSLDPXNGOKMIEBFZCWVJAT",
  "FVPJIAOYEDRZXWGCTKUQSBNMHL",
];

export class Keyboard {
  forward(letter) {
    // returns a signal
    return LETTERS_UPPER.indexOf(letter);
  }

  backward(signal) {
    // returns a letter
    return LETTERS_UPPER[signal];
  }
}

export class PlugBoard {
  constructor(pairs) {
    this.left = LETTERS_UPPER;
    this.right = LETTERS_UPPER;

    // do the swaps for the pair of letters given
    for (let pair of pairs) {
      pair = pair.toUpperCase();
      const from = pair[0];
      const to = pair[1];
      const from_pos = this.left.indexOf(from);
      const to_pos = this.left.indexOf(to);
      this.left =
        this.left.substring(0, from_pos) +
        to +
        this.left.substring(from_pos + 1);
      this.left =
        this.left.substring(0, to_pos) + from + this.left.substring(to_pos + 1);
    }
  }

  forward(signal) {
    const letter = this.right[signal];
    return this.left.indexOf(letter);
  }

  backward(signal) {
    const letter = this.left[signal];
    return this.right.indexOf(letter);
  }
}

export class Rotor {
  constructor(wiring, notch) {
    this.left = LETTERS_UPPER;
    this.right = wiring;
    this.notch = notch;
  }

  forward(signal) {
    const letter = this.right[signal];
    return this.left.indexOf(letter);
  }

  backward(signal) {
    const letter = this.left[signal];
    return this.right.indexOf(letter);
  }

  rotate(numRotations = 1, forward = true) {
    for (let i = 0; i < numRotations; i++) {
      if (forward) {
        this.left = this.left.substring(1) + this.left[0];
        this.right = this.right.substring(1) + this.right[0];
      } else {
        this.left =
          this.left[LETTERS_UPPER.length - 1] +
          this.left.substring(0, LETTERS_UPPER.length - 1);
        this.right =
          this.right[LETTERS_UPPER.length - 1] +
          this.right.substring(0, LETTERS_UPPER.length - 1);
      }
    }
  }

  rotateToLetter(letter) {
    const numRotations = LETTERS_UPPER.indexOf(letter);
    this.rotate(numRotations);
  }

  setRing(ring) {
    // rotate the rotor backwards, note rings where 1 indexed but js is 0 indexed so need ring - 1
    this.rotate(ring - 1, false);

    // adjust the turnover notch in relationship to wiring
    const nNotch = LETTERS_UPPER.indexOf(this.notch);

    // avoid cases of negative index, can add 1 to n if doesnt work
    // was nNotch - n changed it to nNotch - 1
    const index = Rotor.mod(nNotch - 1, LETTERS_UPPER.length);
    this.notch = LETTERS_UPPER[index];
  }

  static mod(n, m) {
    // evaluate the mod
    return ((n % m) + m) % m;
  }
}

export class Reflector {
  constructor(wiring) {
    this.left = LETTERS_UPPER;
    this.right = wiring;
  }

  reflect(signal) {
    const letter = this.right[signal];
    return this.left.indexOf(letter);
  }
}

const III = new Rotor(rotors[2], rotorTurnoverNotches[2]);
const II = new Rotor(rotors[1], rotorTurnoverNotches[1]);
const I = new Rotor(rotors[0], rotorTurnoverNotches[0]);

const KB = new Keyboard();

const A = new Reflector(reflectors[0]);

const PB = new PlugBoard(["AR", "GK", "OX"]);

export default class Enigma {
  constructor(re, r1, r2, r3, pb, kb) {
    this.reflector = re;
    this.rotor1 = r1;
    this.rotor2 = r2;
    this.rotor3 = r3;
    this.plugBoard = pb;
    this.keyBoard = kb;
  }

  setRings(rings) {
    this.rotor1.setRing(rings[0]);
    this.rotor2.setRing(rings[1]);
    this.rotor3.setRing(rings[2]);
  }

  setKey(key) {
    // returns 1 if set key successful or 0 otherwise
    // key should be a three letter key word
    if (key.length < 3) {
      // log error
      return 0;
    }

    this.rotor1.rotateToLetter(key[0]);
    this.rotor2.rotateToLetter(key[1]);
    this.rotor3.rotateToLetter(key[2]);

    return 1;
  }

  encrypt(letter) {
    // rotate the rotors

    // case when all three rotors rotate, double step anomaly
    if (
      this.rotor2.left === this.rotor2.notch &&
      this.rotor3.left === this.rotor3.notch
    ) {
      this.rotor1.rotate();
      this.rotor2.rotate();
      this.rotor3.rotate();
    } else if (this.rotor2.left === this.rotor2.notch) {
      // case when the second rotor is at its notch
      this.rotor1.rotate();
      this.rotor2.rotate();
      this.rotor3.rotate();
    } else if (this.rotor3.left === this.rotor3.notch) {
      // last 2 rotate
      this.rotor2.rotate();
      this.rotor3.rotate();
    } else {
      this.rotor3.rotate();
    }

    // path taken by the signal
    const path = [];

    // pass signal through machine
    let signal = this.keyBoard.forward(letter);
    path.push(signal);
    signal = this.plugBoard.forward(signal);
    path.push(signal);
    signal = this.rotor3.forward(signal);
    path.push(signal);
    signal = this.rotor2.forward(signal);
    path.push(signal);
    signal = this.rotor1.forward(signal);
    path.push(signal);
    signal = this.reflector.reflect(signal);
    path.push(signal);
    signal = this.rotor1.backward(signal);
    path.push(signal);
    signal = this.rotor2.backward(signal);
    path.push(signal);
    signal = this.rotor3.backward(signal);
    path.push(signal);
    signal = this.plugBoard.backward(signal);
    path.push(signal);
    letter = this.keyBoard.backward(signal);

    return letter; // can also return path and letter
  }
}

const enigma = new Enigma(A, I, II, III, PB, KB);
// set rings
// set key
// encrypt
