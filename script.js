"use strict"

var dotLength = 100;
var dashLength = dotLength*3;
var beep_object = T("saw", {freq:300, mul:0.1});

// keep track of events on the queue, so I can clear them.
var timeoutIds = [];

// user input
var textHolder;

// slider to adjust dotLength and dashLength
var rangeInput;

// display values of the slider
var dotLengthDisplay;
var dashLengthDisplay;

window.onload = function(){
  textHolder = document.getElementById("input");
  rangeInput = document.getElementById("slider");
  dotLengthDisplay = document.getElementById("dotLength");
  dashLengthDisplay = document.getElementById("dashLength");

  spanify(textHolder);

  rangeInput.addEventListener("input", updateSlider);
  updateSlider();
};

var MorseEngine = {
  queuedTime: 0,

  beep: function(time, i) {
    var i = i;
    setTimeoutWrapper(function() {
      if(i !== undefined) { addStyle(i) };
      return beep_core(time)
    }, this.queuedTime);
    this.queuedTime+=time;
  },

  sleep: function(time, i, done) {
    var i = i;
    var done = done;
    setTimeoutWrapper(function() {
      if(i !== undefined) { removeStyle(i, done) };
    }, this.queuedTime);
    this.queuedTime += time;
  },
}


function updateSlider() {
  dotLength = parseInt(rangeInput.value);
  dashLength = dotLength*3;

  dotLengthDisplay.innerHTML = '"dit" = ' + dotLength + "ms"
  dashLengthDisplay.innerHTML = '"dah" = ' + dashLength + "ms";
}

// this is a unction delcaration, it loads before code is executed
function addClickListener(id, fn) {
  document.getElementById(id).addEventListener("click", fn);
}

// so I can keep track of the IDs
function setTimeoutWrapper(fn, time) {
  timeoutIds.push(setTimeout(fn, time));
}

function beep_core(duration) {
  beep_object.play();
  setTimeout(function(){
    beep_object.pause()
  }, duration);
}

function addStyle(i){
  var letterHolder = document.getElementById("l" + i);
  letterHolder.style.transform = "translateY(-15px) scale(1.5)";
  letterHolder.style.color = "rgb(93, 193, 22)";
}

function removeStyle(i, done) {
  var letterHolder = document.getElementById("l" + i);
  if(done){ letterHolder.style.color = null }
  letterHolder.style.transform = null;
}

function isSpanified(element) {
  var children = element.childNodes;
  if(children.length < 1) { return false }

  for(var i = 0; i < children.length; i++) {
    if(children[i].nodeName != "SPAN") {
      return false;
     }
  }
  return true;
}

// Wrap each letter in a span, for the animations.
function spanify(element) {
  if(isSpanified(element)) {
    return;
  }

  var letters = element.innerText;
  var lettersArray = letters.split('');

  for(var i = 0; i < lettersArray.length; i++) {
    lettersArray[i]
  }

  element.innerHTML = letters.split('').map(function(letter, index){
    return "<span id='l" + index + "'>" + letter + "</span>"
  }).join('');
}

// unwrap the letters
function unspanify(element) {
  if(!isSpanified(element)) {
    return;
  }

  var children = element.childNodes;
  var text = "";

  // NodeList does not have Array.prototype properties
  for(var i = 0; i < children.length; i++) {
    text = text + children[i].innerHTML;
  }

  element.innerHTML = text;
}

function stop() {
  timeoutIds.forEach(function(id){
    window.clearTimeout(id);
  });

  timeoutIds = [];

  unspanify(textHolder);
}

addClickListener("stop", stop);

addClickListener("play", function(){
  stop();
  MorseEngine.queuedTime = 0; // reset the queued time.

  // reset styles and such for each letter
  unspanify(textHolder);
  var text = textHolder.innerHTML;
  spanify(textHolder);

  // for each letter in the text box
  for( var i = 0; i < text.length; i++ ) {

    // pause between words
    if(text[i] == " ") {
      MorseEngine.sleep(dashLength*2);
      continue;
    }

    var letter = morseTable[text[i].toLowerCase()]

    for( var n = 0; n < letter.length; n++) {
      if(letter[n] == "-") {
        MorseEngine.beep(dashLength, i);
      }
      else {
        MorseEngine.beep(dotLength, i);
      }
      MorseEngine.sleep(dotLength, i);
    }
    MorseEngine.sleep(dashLength, i, true);  // space between letters
  }
});

// thank you to https://gist.github.com/mohayonao/094c71af14fe4791c5dd
var morseTable = {
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "a": ".-",
  "b": "-...",
  "c": "-.-.",
  "d": "-..",
  "e": ".",
  "f": "..-.",
  "g": "--.",
  "h": "....",
  "i": "..",
  "j": ".---",
  "k": "-.-",
  "l": ".-..",
  "m": "--",
  "n": "-.",
  "o": "---",
  "p": ".--.",
  "q": "--.-",
  "r": ".-.",
  "s": "...",
  "t": "-",
  "u": "..-",
  "v": "...-",
  "w": ".--",
  "x": "-..-",
  "y": "-.--",
  "z": "--..",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "-": "-....-",
  "/": "-..-.",
  "@": ".--.-.",
  "(": "-.--.",
  ")": "-.--.-"
}
