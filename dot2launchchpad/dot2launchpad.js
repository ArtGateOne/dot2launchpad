//dot2launchpad by ArtGateOne - version 1.2 20.04.2022

var easymidi = require('easymidi');
var W3CWebSocket = require('websocket')
  .w3cwebsocket;
var client = new W3CWebSocket('ws://localhost:80/'); //U can change localhost(127.0.0.1) to Your console IP address


//config
var midi_in = 'LPMiniMK3 MIDI';      //set correct midi in device name
var midi_out = 'LPMiniMK3 MIDI';     //set correct midi out device name
var page_sw = 1;              //Auto Page switch on dot2  1 = ON, 0 = OFF
var blackout_toggle_mode = 0; //BlackOut toggle mode    1 = ON, 0 = OFF
var executors_view = 0;       //default executors view   0 = bottom, 1 = top


//----------------------------------------------------------------------------------------------


var testnote = 0;
var exec_time = 0;
var prog_time = 0;
var set = 0;
var clear = 0;
var high = 0;
var clear_button = 0;
var speedmaster1 = 60;
var speedmaster2 = 60;
var speedmaster3 = 60;
var speedmaster4 = 60;
var blackout = 0;
var grandmaster = 100;
var gmvalue = 43;
var session = 0;
var pageIndex = 0;
var wing = 0;
var request = 0;
var controller = 0;
var matrix = [213, 212, 211, 210, 209, 208, 207, 206, 113, 112, 111, 110, 109, 108, 107, 106, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
var exec = JSON.parse('{"index":[[5,4,3,2,1,0,0,0],[13,12,11,10,9,8,7,6],[21,20,19,18,17,16,15,14]]}');


//{"requestType":"playbacks","startIndex":[300,400,500,600,700,800],"itemsCount":[16,16,16,16,16,16],"pageIndex":0,"itemsType":[3,3,3,3,3,3],"view":3,"execButtonViewMode":2,"buttonsViewMode":0,"session":22,"maxRequests":1}
function interval() {
  if (session > 0) {
    client.send('{"requestType":"playbacks","startIndex":[0,100,200],"itemsCount":[20,20,20],"pageIndex":' + pageIndex + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + session + ',"maxRequests":1}');
  }
};

//setInterval(interval, 100);


//display info
console.log("LaunchpadMK3 .2 WING ");
console.log(" ");

//display all midi devices
console.log("Midi IN");
console.log(easymidi.getInputs());
console.log("Midi OUT");
console.log(easymidi.getOutputs());

console.log(" ");

console.log("Connecting to midi device " + midi_in);

//open midi device
var input = new easymidi.Input(midi_in);
var output = new easymidi.Output(midi_out);






//{"requestType":"getdata","data":"set,clear,high","session":22,"maxRequests":1}

//WEBSOCKET-------------------

client.onerror = function () {
  console.log('Connection Error');
};

client.onopen = function () {
  console.log('WebSocket Client Connected');
  setInterval(interval, 0);//80

  function sendNumber() {
    if (client.readyState === client.OPEN) {
      var number = Math.round(Math.random() * 0xFFFFFF);
      client.send(number.toString());
      setTimeout(sendNumber, 1000);
    }
  }
  //sendNumber();
};

client.onclose = function () {
  console.log('Client Closed');

  for (i = 0; i <= 127; i++) {
    output.send('noteon', { note: i, velocity: 0, channel: 0 });
    sleep(10, function () { });
  }

  for (i = 0; i <= 127; i++) {
    output.send('cc', { controller: i, value: 0, channel: 0 });
    sleep(10, function () { });
  }


  for (i = 0; i <= 7; i++) {
    output.send('pitch', { value: 0, channel: i });
    sleep(10, function () { });
  }


  input.close();
  output.close();
  //process.exit();
};

client.onmessage = function (e) {

  request = request + 1;

  if (request > 9) {
    client.send('{"session":' + session + '}');

    client.send('{"requestType":"getdata","data":"set,clear,high","session":' + session + ',"maxRequests":1}');

    request = 0;
  }


  if (typeof e.data === 'string') {
    //console.log("Received: '" + e.data + "'");
    //console.log("-----------------");
    //console.log(e.data);

    obj = JSON.parse(e.data);


    if (obj.status == "server ready") {
      client.send('{"session":0}')
    }
    if (obj.forceLogin === true) {
      session = (obj.session);
      client.send('{"requestType":"login","username":"remote","password":"2c18e486683a3db1e645ad8523223b72","session":' + session + ',"maxRequests":10}')
    }

    if (obj.session) {
      session = (obj.session);
    }


    if (obj.responseType == "login" && obj.result === true) {
      setInterval(interval, 100);//80
      console.log("...LOGGED");
      console.log("SESSION " + session);
      if (page_sw == 1) {
        client.send('{"command":"Page ' + (pageIndex + 1) + '","session":' + session + ',"requestType":"command","maxRequests":0}');
      }
      //client.send('{"requestType":"playbacks","startIndex":[6,106,206],"itemsCount":[8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + session + ',"maxRequests":1}');
    }


    if (obj.responseType == "getdata") {
      //"data":[{"set":"0"}],"worldIndex":0}){
      //console.log(e.data);
    }



    if (obj.responseType == "playbacks") {//recive data from dot & send to Launchpad
      var channel = 7;
      for (var i = 0; i <= 5; i++) {
        /*
        if (executors_view == 0) {
          output.send('noteon', { note: (channel), velocity: ((obj.itemGroups[2].items[i][0].isRun) * 127), channel: 0 });//executor top 
          output.send('noteon', { note: ((channel) + 8), velocity: ((obj.itemGroups[1].items[i][0].isRun) * 127), channel: 0 });//executor top
          output.send('noteon', { note: ((channel) + 16), velocity: ((obj.itemGroups[0].items[i][0].isRun)), channel: 0 });//executor fader bottom 1
          output.send('noteon', { note: ((channel) + 24), velocity: ((obj.itemGroups[0].items[i][0].isRun) * 127), channel: 0 });//executor fader bottom 0
        } else {
          output.send('noteon', { note: (channel), velocity: ((obj.itemGroups[2].items[i][0].isRun) * 127), channel: 0 });//executor top 
          output.send('noteon', { note: ((channel) + 8), velocity: ((obj.itemGroups[1].items[i][0].isRun) * 127), channel: 0 });//executor top
          output.send('noteon', { note: ((channel) + 24), velocity: ((obj.itemGroups[2].items[i][0].isRun) * 127), channel: 0 });//executor top 
          output.send('noteon', { note: ((channel) + 16), velocity: ((obj.itemGroups[1].items[i][0].isRun) * 127), channel: 0 });//executor top

        }*/
        var value = (obj.itemGroups[0].items[i][0].executorBlocks[0].fader.v) * 127;//fader
        //console.log(obj.itemGroups[0].items[i][0]);

        output.send('cc', { value: (value), controller: (i) });
        //channel--;

      }

    }

  }

}

//sleep function
function sleep(time, callback) {
  var stop = new Date()
    .getTime();
  while (new Date()
    .getTime() < stop + time) {
    ;
  }
  callback();
}
