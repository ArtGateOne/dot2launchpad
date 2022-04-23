//dot2launchpad by ArtGateOne - version 1.3 22.04.2022

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
var get_feadback = 1;


//----------------------------------------------------------------------------------------------
var faderTime = [0, 0];
const NS_PER_SEC = 1e9;



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
var session = 0;
var request = 0;

var exec = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121];
var exec_bwing = [300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815]
for (i = 0; i <= 21; i++) { //fader time set
  faderTime[i] = process.hrtime();
}


function interval() {
  if (session > 0) {
    client.send('{"requestType":"playbacks","startIndex":[0,100,200],"itemsCount":[22,22,22],"pageIndex":0,"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + session + ',"maxRequests":1}');
    client.send('{"requestType":"playbacks","startIndex":[300,400,500,600,700,800],"itemsCount":[16,16,16,16,16,16],"pageIndex":0,"itemsType":[3,3,3,3,3,3],"view":3,"execButtonViewMode":2,"buttonsViewMode":0,"session":' + session + ',"maxRequests":1}');
    if (request == 10) {
      client.send('{"requestType":"getdata","data":"set,clear,high","session":' + session + ',"maxRequests":1}');
    }
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



input.on('cc', function (msg) {
  /*diff = process.hrtime(faderTime[msg.controller]);
  if ((diff[0] * NS_PER_SEC + diff[1]) >= 10000000 | msg.value == 0 | msg.value == 127) {
    faderTime[msg.controller] = process.hrtime();
    client.send('{"requestType":"playbacks_userInput","execIndex":' + (msg.controller) + ',"pageIndex":0,"faderValue":' + (msg.value / 127) + ',"type":1,"session":' + session + ',"maxRequests":0}');
  }*/
  client.send('{"requestType":"playbacks_userInput","execIndex":' + (msg.controller) + ',"pageIndex":0,"faderValue":' + (msg.value / 127) + ',"type":1,"session":' + session + ',"maxRequests":0}');
});

input.on('noteon', function (msg) {
  if (msg.channel < 2) {
    if (msg.note <= 21) {
      if (msg.velocity == 127) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + msg.note + ',"pageIndex":0,"buttonId":' + msg.channel + ',"pressed":true,"released":false,"type":0,"session":' + session + ',"maxRequests":0}');
      } else {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + msg.note + ',"pageIndex":0,"buttonId":' + msg.channel + ',"pressed":false,"released":true,"type":0,"session":' + session + ',"maxRequests":0}');
      }
    } else if (msg.note > 21 && msg.note < 127) {
      if (msg.velocity == 127) {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + (exec[msg.note]) + ',"pageIndex":0,"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + session + ',"maxRequests":0}');
      } else {
        client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + (exec[msg.note]) + ',"pageIndex":0,"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + session + ',"maxRequests":0}');
      }
    }
  } else if (msg.channel == 2) {
    if (msg.velocity == 127) {
      client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + (exec_bwing[msg.note]) + ',"pageIndex":0,"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + session + ',"maxRequests":0}');
    } else {
      client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + (exec_bwing[msg.note]) + ',"pageIndex":0,"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + session + ',"maxRequests":0}');
    }
  }
});








//WEBSOCKET-------------------

client.onerror = function () {
  console.log('Connection Error');
};

client.onopen = function () {
  console.log('WebSocket Client Connected');


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
  setInterval(interval, 0);
  console.log('Client Closed');
  /*
    for (i = 0; i <= 127; i++) {//clear led status
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
    }*/

  input.close();
  output.close();
  process.exit();
};

client.onmessage = function (e) {

  request++;

  if (request >= 10) {
    client.send('{"session":' + session + '}');
    //client.send('{"requestType":"getdata","data":"set,clear,high","session":' + session + ',"maxRequests":1}');
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
    }


    if (obj.responseType == "getdata") {
      //console.log(e.data);
    }



    if (obj.responseType == "playbacks") {//recive data from dot & send to Launchpad
      if (obj.responseSubType == 2) {



        for (var i = 0; i <= 21; i++) {
          if (get_feadback == 1) {//send fader feedback
            var value = (obj.itemGroups[0].items[i][0].executorBlocks[0].fader.v) * 127;
            output.send('cc', { value: (value), controller: (i), channel: 0 });//fader feedback
            if (i == 21) {
              get_feadback = 0;
            }
          }
          output.send('noteon', { note: (i), velocity: (obj.itemGroups[0].items[i][0].isRun), channel: 0 });//executor bottom feedback
          output.send('noteon', { note: (i), velocity: (obj.itemGroups[0].items[i][0].isRun), channel: 1 });//executor bottom feedback

          output.send('noteon', { note: (i + 22), velocity: (obj.itemGroups[2].items[i][0].isRun), channel: 0 });//executor top feedback
          output.send('noteon', { note: (i + 44), velocity: (obj.itemGroups[1].items[i][0].isRun), channel: 0 });//executor top feedback
        }
      };
      if (obj.responseSubType == 3) {

        for (var i = 0; i < 16; i++) {

          output.send('noteon', { note: (i), velocity: (obj.itemGroups[0].items[i][0].isRun), channel: 2 });//executor 301
          output.send('noteon', { note: (i + 16), velocity: (obj.itemGroups[1].items[i][0].isRun), channel: 2 });//executor 401
          output.send('noteon', { note: (i + 32), velocity: (obj.itemGroups[2].items[i][0].isRun), channel: 2 });//executor 501
          output.send('noteon', { note: (i + 48), velocity: (obj.itemGroups[3].items[i][0].isRun), channel: 2 });//executor 601
          output.send('noteon', { note: (i + 64), velocity: (obj.itemGroups[4].items[i][0].isRun), channel: 2 });//executor 701
          output.send('noteon', { note: (i + 80), velocity: (obj.itemGroups[5].items[i][0].isRun), channel: 2 });//executor 801

        }


      };
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