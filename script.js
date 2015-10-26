var dotLength = 100;
var dashLength = dotLength*3;
var beep_object = T("saw", {freq:300, mul:0.1});
var timeoutIds = []; // so I can clear them

var textHolder;
var rangeInput;
window.onload = function(){
  textHolder = document.getElementById("input");
  spanify(textHolder);

  sliderValue = document.getElementById("sliderValue");
  rangeInput = document.getElementById("slider");

  rangeInput.value = dotLength;
  sliderValue.innerHTML = dotLength;

  rangeInput.addEventListener('input', function(){
    sliderValue.innerHTML = this.value;
    dotLength = parseInt(this.value);
    dashLength = dotLength*3;
  });
};

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
  letterHolder = document.getElementById("l" + i);
  letterHolder.style.transform = "translateY(-15px) scale(1.5)";
  letterHolder.style.color = "rgb(93, 193, 22)";
}

function removeStyle(i, done) {
  letterHolder = document.getElementById("l" + i);
  if(done){ letterHolder.style.color = null }
  letterHolder.style.transform = null;
}


queuedTime = 0; //TODO: get this into the MorseEngine class/prototype thingy
MorseEngine = {
  beep: function(time, i) {
    console.log(i);
    var i = i;
    setTimeoutWrapper(function() {
      if(i !== undefined) { addStyle(i) };
      return beep_core(time)
    }, queuedTime);
    queuedTime+=time;
  },

  sleep: function(time, i, done) {
    var i = i;
    var done = done;
    setTimeoutWrapper(function() {
      if(i !== undefined) { removeStyle(i, done) };
    }, queuedTime);
    queuedTime += time;
  },
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

// wrap each letter in a span
function spanify(element) {
  if(isSpanified(element)) {
    console.log("already spanified");
    return;
  }

  letters = element.innerText;
  lettersArray = letters.split('');

  for(var i = 0; i < lettersArray.length; i++) {
    lettersArray[i]
  }

  element.innerHTML = letters.split('').map(function(letter, index){
    return "<span id='l" + index + "'>" + letter + "</span>"
  }).join('');

}

function unspanify(element) {
  if(!isSpanified(element)) {
    console.log("nothing to unspanify");
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

addClickListener("stop", function(){
  timeoutIds.forEach(function(id){
    window.clearTimeout(id);
  });

  timeoutIds = [];

  unspanify(textHolder);
});

addClickListener("play", function(){
  queuedTime = 0; // reset the queued time.

  // reset styles and such for each letter
  unspanify(textHolder);
  text = textHolder.innerHTML;
  spanify(textHolder);

  // for each letter in the text box
  for( var i = 0; i < text.length; i++ ) {

    if(text[i] == " ") {
      MorseEngine.sleep(dashLength*2);
      continue;
    }

    letter = morseTable[text[i].toLowerCase()]

    for( var n = 0; n < letter.length; n++) {
      if(letter[n] == "-") {
        MorseEngine.beep(dashLength, i);
      }
      else {
        MorseEngine.beep(dotLength, i);
      }
      MorseEngine.sleep(dotLength, i);
    }
    MorseEngine.sleep(dashLength, i, true);
  }
});


// thank you to https://gist.github.com/mohayonao/094c71af14fe4791c5dd
morseTable = {
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
