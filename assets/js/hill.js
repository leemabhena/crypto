"use strict";

class HillCipher {
  constructor(key, text, order = 2) {
    this.key = key;
    this.text = text;
    this.order = order;
    this.keyMatrix = this._keyMatrix();
  }

  _keyMatrix() {
    // Evaluates the matrix of a key
    const keyArr = this.key.trim().split(" ");
    const numRows = this.order;

    let output = [];
    for (let i = 0; i < keyArr.length; i += numRows) {
      const currArr = [];
      for (let j = 0; j < numRows; j++) {
        currArr.push(Number(keyArr[i + j]));
      }
      output.push(currArr);
    }

    return output;
  }

  _calcDeterminant() {
    // calculate the determinant in Z26.
    return mod(math.det(this.keyMatrix), NUM_LETTERS);
  }

  _inverseMatrix() {}

  canEncrypt() {
    // check if the encryption works
    const keyDet = this._calcDeterminant();
    return !(keyDet === 2 || keyDet === 13);
  }

  encrypt() {
    // encrypt everything save for the last n - order letters if not divisible by order
    const n = Math.floor(this.text / this.order);

    let output = [];
    for (let i = 0; i < this.text.length - this.order; i++) {
      // build the matrix of characters
      const matrix = [];
      let j = this.order;
      while (j > 0) {
        if (isLetter(this.text[j + i])) {
          matrix.push(LETTERS.indexOf(this.text[j + i]));
          j--;
        } else {
          output += this.text[j + i];
          i++;
        }
      }

      // multiply key matrix with the matrix
      const result = math.multiply(this.keyMatrix, matrix);

      // loop through the result array and add it to the output
      for (let num of result) {
        const index = mod(num, NUM_LETTERS);
        output += LETTERS[index];
      }
    }

    // add the remaining letters of the word if it wasnt divisible by the order

    return output;
  }
}
