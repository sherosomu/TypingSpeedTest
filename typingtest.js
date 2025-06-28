let testing = false;

let timer = document.getElementById("timer");
let quoteDisplay = document.getElementById("quoteDisplay");
let result = document.getElementById("result");
let quoteInput = document.getElementById("quoteInput");
let submitBtn = document.getElementById("submitBtn");
let resetBtn = document.getElementById("resetBtn");
let spinner = document.getElementById("spinner");
let speedel = document.getElementById("speed");
let hspeedel = document.getElementById("hspeed");
let avgspeedel = document.getElementById("avgspeed");

let intervalId;
let countdown = 0;
let curquote = "";
let hspeed = 0;
let speed_data = [];

timer.textContent = "0";
resetBtn.textContent = "Start";
quoteDisplay.textContent = `"The sentence to be typed will be displayed here."`;

// Utility Functions
function countWords(str) {
  return str.trim().split(/\s+/).length;
}

function getAverage(arr) {
  return arr.length ? Math.ceil(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
}

// Quote Fetcher
function getQuote() {
  spinner.classList.remove("d-none");
  quoteDisplay.classList.add("d-none");

  fetch("https://apis.ccbp.in/random-quote")
    .then(res => res.json())
    .then(data => {
      curquote = data.content;
      quoteDisplay.textContent = curquote;
      spinner.classList.add("d-none");
      quoteDisplay.classList.remove("d-none");
    });
}

// Timer Starter
function startTimer() {
  countdown = 0;
  timer.textContent = "0";
  intervalId = setInterval(() => {
    countdown += 1;
    timer.textContent = countdown;
  }, 1000);
}

// Resetting Function
function resetTypingTest() {
  quoteInput.value = "";
  result.textContent = "";
  speedel.textContent = "- WPM";
  hspeedel.textContent = hspeed + " WPM";
  avgspeedel.textContent = getAverage(speed_data) + " WPM";

  clearInterval(intervalId);
  getQuote();
  startTimer();
  resetBtn.textContent = "Reset";
}

// Submit Handler
function submitInput() {
  if (resetBtn.textContent === "Start") {
    result.textContent = "Press Start button to begin the typing test.";
    return;
  }

  if (quoteInput.value === curquote) {
    clearInterval(intervalId);

    const wordCount = countWords(quoteInput.value);
    const timeTaken = countdown || 1; // avoid division by 0
    const curSpeed = Math.floor((wordCount * 60) / timeTaken);

    result.textContent = `You typed in ${timeTaken} seconds.`;
    speed_data.push(curSpeed);

    // Animate WPM Counter
    let animatedSpeed = 0;
    const displaySpeed = setInterval(() => {
      if (animatedSpeed >= curSpeed) {
        clearInterval(displaySpeed);
        speedel.textContent = curSpeed + " WPM";
      } else {
        animatedSpeed += 1;
        speedel.textContent = animatedSpeed + " WPM";
      }
    }, 10);

    // High Score
    if (curSpeed > hspeed) hspeed = curSpeed;
    hspeedel.textContent = hspeed + " WPM";

    // Average Speed
    avgspeedel.textContent = getAverage(speed_data) + " WPM";

    countdown = 0;
  } else {
    result.textContent = "You typed an incorrect sentence.";
  }
}

// Event Listeners
resetBtn.addEventListener("click", () => {
  resetTypingTest();
});

submitBtn.addEventListener("click", submitInput);

quoteInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitBtn.click();
  } else if (event.altKey && event.key.toLowerCase() === "r") {
    event.preventDefault();
    resetBtn.click();
  }
});

// Load a quote on page open
window.addEventListener("load", getQuote);
