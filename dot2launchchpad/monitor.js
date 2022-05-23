var easymidi = require('easymidi');


//display all midi devices
console.log("Midi IN");
console.log(easymidi.getInputs());
console.log("Midi OUT");
console.log(easymidi.getOutputs());
console.log(" ");




// Monitor all MIDI inputs with a single "message" listener
easymidi.getInputs().forEach(function(inputName){
  var input = new easymidi.Input(inputName);
  input.on('message', function (msg) {
    var vals = Object.keys(msg).map(function(key){return key+": "+msg[key];});
    console.log(inputName+": "+vals.join(', '));
  });
});


