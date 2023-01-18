"use strict";

// CONSTANTS
const WIDTH = 300;
const HEIGHT = 300;
let ISHIDING = true; // show if the text is to be hidden or shown

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

    // show the correct section
    if (event.target.textContent === "Hide") {
      document.querySelector(".hide-row").classList.remove("hidden");
      document.querySelector(".show-row").classList.add("hidden");
      ISHIDING = true;
    } else {
      document.querySelector(".hide-row").classList.add("hidden");
      document.querySelector(".show-row").classList.remove("hidden");
      ISHIDING = false;
    }
  }
});

// add focus to the textarea
const textEL = document.getElementById("plaintext");

// The user has to type atleast 5 characters long
textEL.addEventListener("blur", (e) => {
  // check if there was input if not alert of an error
  if (textEL.value.length < 5) {
    textEL.classList.add("error");
    textEL.value = "Please enter text of at-least 5 characters.";
  }
});

// delete if the user clicks the textarea
textEL.addEventListener("focus", () => {
  if (textEL.classList.contains("error")) {
    textEL.classList.remove("error");
    textEL.value = "";
  }
});

// show the file upload once the user has entered the correct text
textEL.addEventListener("input", () => {
  if (textEL.value.length >= 5) {
    document.getElementById("cover-img").classList.remove("hidden");
    document.querySelector(".file-p").classList.add("hidden");
  } else {
    document.getElementById("cover-img").classList.add("hidden");
    document.querySelector(".file-p").classList.remove("hidden");
  }
});

// allow the user to upload the cover image and get the imageUrl
function readImageURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    // once the image had loaded get hold of the url
    reader.onload = function (e) {
      image.src = e.target.result;
    };

    // read the uamge as URL
    reader.readAsDataURL(input.files[0]);
  }
}

//////////////////        //////////////// //////////
// get image data, in format rgba total of 32 bytes
////////////////            ////////////  //////////

// initialize the canvas
const canvas = document.getElementById("canvas-image-cover");
canvas.height = HEIGHT;
canvas.width = WIDTH;
const ctx = canvas.getContext("2d");

// set up the image object
const image = new Image();

// draw an image once it loads
image.onload = function () {
  drawImage(this);
};

// function to draw the image
function drawImage(imageObj) {
  // decide whether to hide / show image
  if (ISHIDING) {
    ctx.drawImage(imageObj, 0, 0, WIDTH, HEIGHT);
    // get the image data
    const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT).data;
    console.log(imageData);
    // hide the text in the image
    const text = document.getElementById("plaintext").value;

    encode(imageData, text);
  } else {
    // show text from the image

    // show the image first in the canvas
    const canvas3 = document.getElementById("canvas-show-text");
    canvas3.height = HEIGHT;
    canvas3.width = WIDTH;
    const ctx3 = canvas3.getContext("2d");
    ctx3.drawImage(imageObj, 0, 0, WIDTH, HEIGHT);

    // grab image data
    const imageData = ctx3.getImageData(0, 0, WIDTH, HEIGHT).data;
    console.log(imageData);

    // display the text hidden in textarea
    const results = decode(imageData);

    document.getElementById("shown-text").value = results;
  }
}

// using 2 least significant bits of the image encode the message

function encode(imageData, plaintext) {
  let index = 0;

  // Number of pixels encoding -> rgba
  const length = plaintext.length * 4;

  // add a character per each pixel
  for (let i = 0; i < length; i += 4) {
    const textASCII = plaintext.charCodeAt(index);
    imageData[i] = (imageData[i] & 252) | ((textASCII & 192) >>> 6); // red
    imageData[i + 1] = (imageData[i + 1] & 252) | ((textASCII & 48) >>> 4); // green
    imageData[i + 2] = (imageData[i + 2] & 252) | ((textASCII & 12) >>> 2); // blue
    imageData[i + 3] = (imageData[i + 3] & 252) | (textASCII & 3); // alpha
    index++;
  }

  // update the lower bytes of the next length + 1 pixel to show end of string, use null or 0000
  imageData[length] = imageData[length] & 252; // red
  imageData[length + 1] = imageData[length + 1] & 252; // green
  imageData[length + 2] = imageData[length + 2] & 252; // blue
  imageData[length + 3] = imageData[length + 3] & 252; // alpha

  // draw the updated image
  const canvas2 = document.getElementById("canvas-image-output");
  const ctx2 = canvas2.getContext("2d");
  canvas2.height = HEIGHT;
  canvas2.width = WIDTH;

  ctx2.putImageData(new ImageData(imageData, WIDTH, HEIGHT), 0, 0);
}

function decode(imageData) {
  // calculate the length of hidden text
  const textLength = calculateTextLength(imageData) * 4;

  console.log(textLength);

  let output = "";

  // handle case when the uploaded text as not prepared using this program
  if (textLength >= HEIGHT * WIDTH) {
    output = `Error: seems like the image uploaded was not used with this program. 
    Try hiding the plaintext again and adjusting the length of your plaintext as it doesn't fully hide texts of length >= (${
      HEIGHT * WIDTH
    }). If error persist please reach out to me with the error so it can be fixed`;
    return output;
  }

  for (let i = 0; i < textLength; i += 4) {
    const red = (imageData[i] & 3) << 6; // red
    const green = (imageData[i + 1] & 3) << 4; // green
    const blue = (imageData[i + 2] & 3) << 2; // blue
    const alpha = imageData[i + 3] & 3; // alpha

    // generate the ascii value from values above
    const asciiValue = red | green | blue | alpha;
    output += String.fromCharCode(asciiValue);
  }

  return output;
}

function calculateTextLength(imageData) {
  let count = 0;
  for (let i = 0; i < imageData.length; i += 4) {
    const red = imageData[i] & 3; // red
    const green = imageData[i + 1] & 3; // green
    const blue = imageData[i + 2] & 3; // blue
    const alpha = imageData[i + 3] & 3; // alpha

    // if the character is null that marks the end of cipher text
    if (!red && !green && !blue && !alpha) {
      break;
    }

    count++;
  }

  return count;
}
