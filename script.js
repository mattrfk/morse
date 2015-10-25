var dotLength = 100;
var dashLength = dotLength*3;

// this is a unction delcaration, it loads before code is executed
function addClickListener(id, fn) {
  document.getElementById(id).addEventListener("click", fn);
}

beep_object = T("saw", {freq:100, mul:0.1});

function beep_core(duration) {

  beep_object.play();

  setTimeout(function(){
    // console.log("stopping after " + duration);
    beep_object.pause()
  }, duration);
}


function addStyle(i){
  letterHolder = document.getElementById("l" + i).style.color = "red";
}

function removeStyle(i) {
  letterHolder = document.getElementById("l" + i).style.color = null;
}


queuedTime = 0; //TODO: get this into the MorseEngine class/prototype thingy
MorseEngine = {
  beep: function(time, i) {
    console.log(i);
    var i = i;
    setTimeout(function() {
      if(i !== undefined) { addStyle(i) };
      return beep_core(time)
    }, queuedTime);
    queuedTime+=time;
  },

  sleep: function(time, i) {
    var i = i;
    setTimeout(function() {
      if(i !== undefined) { removeStyle(i) };
    }, queuedTime);
    queuedTime += time;
  },
}

addClickListener("spanify", function(){
  element = document.getElementById("input");
  spanify(element);
});

addClickListener("unspanify", function(){
  element = document.getElementById("input");
  unspanify(element);
});


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

  letters = element.innerHTML;
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

addClickListener("play", function(){
  queuedTime = 0; // reset the queued time.

  textHolder = document.getElementById("input");
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
    MorseEngine.sleep(dashLength, i);
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
