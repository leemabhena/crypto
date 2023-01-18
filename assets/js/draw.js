// module to draw enigma to the screen
// Constants
const COMPONENTWIDTH = 150;
const COMPONENTHEIGHT = 560;
const COMPONENTPADDING = 20;
const COMPONENTSPACING = 50;
const LETTERBOX = 20;
const BOXSPACING = 100;
const TITLES = [
  "Reflector",
  "Rotor 1",
  "Rotor 2",
  "Rotor 3",
  "PlugBoard",
  "Key/Lamp Board",
];

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = 660;
const ctx = canvas.getContext("2d");

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// draw rectangles for the components

function drawComponent(ctx, x, y, left, right) {
  ctx.strokeRect(x, y, COMPONENTWIDTH, COMPONENTHEIGHT);
  // draw texts on left
  const startingPos = y + COMPONENTPADDING;
  for (let i = 0; i < 26; i++) {
    ctx.fillText(left[i], x + COMPONENTPADDING, startingPos + i * LETTERBOX);
  }

  // draw the right text
  for (let i = 0; i < 26; i++) {
    ctx.fillText(
      right[i],
      x + COMPONENTPADDING + BOXSPACING,
      startingPos + LETTERBOX * i
    );
  }
}

function drawKeyboard(ctx, x, y, text) {
  ctx.strokeRect(x, y, 50, COMPONENTHEIGHT);
  const startingPos = y + COMPONENTPADDING;
  for (let i = 0; i < 26; i++) {
    ctx.fillText(text[i], x + COMPONENTPADDING, startingPos + i * LETTERBOX);
  }
}

function addTitles(ctx, x, y, titles) {
  const startingPos = y - COMPONENTPADDING;
  for (let i = 0; i < titles.length; i++) {
    ctx.fillText(
      titles[i],
      x + (COMPONENTSPACING + COMPONENTWIDTH) * i,
      startingPos
    );
  }
}

// draw the reflectors and the routers

for (let i = 0; i < 5; i++) {
  drawComponent(
    ctx,
    50 + (COMPONENTSPACING + COMPONENTWIDTH) * i,
    50,
    LETTERS,
    LETTERS
  );
}

// draw the plugboard or lamb board
const plugBoardXpos = 50 + (COMPONENTSPACING + COMPONENTWIDTH) * 5;
drawKeyboard(ctx, plugBoardXpos, 50, LETTERS);

// add titles
addTitles(ctx, 50, 50, TITLES);
