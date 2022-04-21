var easymidi = require('easymidi');
var midi_in = 'LPMiniMK3 MIDI';      //set correct midi in device name
var midi_out = 'LPMiniMK3 MIDI';     //set correct midi out device name
var testnote = 0;

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


var input = new easymidi.Input(midi_in);
var output = new easymidi.Output(midi_out);

for (var i = 0; i <=127; i++){
output.send('cc', { controller: i, value: 0, channel: 0 });
    output.send('noteon', { note: i, velocity:  i, channel: 0 });
}


input.on('noteon', function (msg) {

  
  if (msg.note == 36 && msg.velocity == 127) {//encoder 1 click
    output.send('cc', { controller: 7, value: testnote, channel: 0 });
    output.send('noteon', { note: testnote, velocity:  58, channel: 0 });//led clear blink
    testnote++;
    console.log(testnote);
  }
});