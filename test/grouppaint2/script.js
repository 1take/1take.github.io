//import Toasted from 'vue-toasted';
var toastOpt =
{position: "bottom-right",
 duration: 2000};
Vue.use(Toasted, toastOpt)

window.__SKYWAY_KEY__ = '44eecc33-4adb-4e87-a4a1-cd7aa03ff9e2';

// Connect to SkyWay, have server assign an ID instead of providing one
// Showing off some of the configs available with SkyWay :).
const peer = new Peer({
  // Set API key for cloud server (you don't need this if you're running your
  // own.
  key:         window.__SKYWAY_KEY__,
  // Set highest debug level (log everything!).
  debug:       3,
  // Set a logging function:
  logFunction: args => {
    const copy = [...args].join(' ');
    $('.log').append(copy + '<br>');
  },
});
const connectedPeers = {};

var myid;
var hash;

function getHashFromUid(uid) {
    code = uid.charCodeAt(0);

    console.log(myid + " " + code);

    /* map ["0":"9"] => [1:10] */
    if (48 <= code && code <= 57) {
        code -= 47;
    /* map ["A":"z"] => [11:62] */
    } else if (65 <= code && code <= 122) {
        code -= 64;
        code += 10;
    }

    hash = code / (10 + 26 * 2);
    return hash;
}

function changeIconHue(uid, elm) {
    degree = 360 * getHashFromUid(uid);
    console.log("degree:" + degree);
    $("#" + elm).css({"-webkit-filter": "hue-rotate(" + degree + "deg)",
                     "-moz-filter": "hue-rotate(" + degree + "deg)",
                     "-o-filter": "hue-rotate(" + degree + "deg)",
                     "-ms-filter": "hue-rotate(" + degree + "deg)",
                     "filter": "hue-rotate(" + degree + "deg)"});
}

function changeButtonSelected(ev) {
    var cur = $(".selected");
    cur.removeClass("selected");
    cur.addClass("unselected");
    $("#" + ev.target.id).removeClass("unselected");
    $("#" + ev.target.id).addClass("selected");
}

/* eslint-disable require-jsdoc */
$(function() {

  // Show this peer's ID.
  peer.on('open', id => {
    $('#pid').text(id);
    myid = id;
    doConnect();
  });
  // Await connections from others
  peer.on('connection', connect);
  peer.on('disconneted', id => {
          console.log(err)
          window.alert("peer.on disconneted: " + id);
      });
  peer.on('close', id => {
          console.log(err)
          window.alert("Please Reload Browser (peer.on closed: " + id + ")");
      });
  peer.on('error', err => {
          console.log(err)
          window.alert("Please Reload Browser (peer.on error -  " + err + ")");
      });

  // Prepare file drop box.
  const box = $('#box');
  box.on('dragenter', doNothing);
  box.on('dragover', doNothing);
  box.on('drop', e => {
    e.originalEvent.preventDefault();
    const [file] = e.originalEvent.dataTransfer.files;
    eachActiveRoom((room, $c) => {
      room.send(file);
      $c.find('.messages').append('<div><span class="file">You sent a file.</span></div>');
    });
  });

  function doNothing(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  //$('#roomName').focus();

  function doConnect() {
    var roomName = $('#roomName').val();
    if (!roomName) {
      var arr = location.href.split("/");
      roomName = arr[arr.length - 2];
      // return;
    }
    if (!connectedPeers[roomName]) {
      // Create 2 connections, one labelled chat and another labelled file.
      const room = peer.joinRoom(roomName, {mode: 'sfu'});
      room.on('open', function() {
        connect(room);
        connectedPeers[roomName] = room;
      });
      room.on('close', function() {
        window.alert("Please Reload Browser (room.on close)");
      });

    }
  }

  // Send a chat message to all active connections.
  $('#send').on('submit', e => {
    e.preventDefault();
    // For each active connection, send the message.
    const msg = $('#text').val();

    sendMsg(msg);

    $('#text').val('');
    // $('#text').focus();
  });

  $('#pen').on('touchstart', e => {
    console.log("touchstarted");
    e.preventDefault();
    DESTINATION_OUT = false;
    isDrawEnable = true;
    changeButtonSelected(e);
  });

  $('#pointer').on('touchstart', e => {
    console.log("touchstarted");
    e.preventDefault();
    isDrawEnable = false;
    changeButtonSelected(e);
  });

  $('#eraser').on('touchstart', e => {
    e.preventDefault();
    DESTINATION_OUT = true;
    isDrawEnable = true;
    changeButtonSelected(e);
  });

  $('#trash').on('touchstart', e => {
    e.preventDefault();

    msg = myid + " " + "clear" +  " " + mycanvas;
    sendMsg(msg); // clear canvas
    clearCanvas(mycanvas);
  });

  $('#pdf').on('touchstart', e => {
    e.preventDefault();      

    // only jpeg is supported by jsPDF
    var px2mm = 0.1;
    var w = BOARD_WIDTH * px2mm, h = BOARD_HEIGHT * px2mm;
    var pdf = new jsPDF('', 'mm', [w, h]);
    var c = $(".canvas");
    for (i = 0; i < c.length; i++) {
         if (i > 0) pdf.addPage();
         var canvas = c[i];
         var imgData = canvas.toDataURL("image/jpeg", 1.0);
         pdf.addImage(imgData, 'JPEG', 0, 0, w, h);
    }
    pdf.save("canvas_download.pdf");
  });


  $('#sync').on('touchstart', e => {
    e.preventDefault();
    sendCanvasAsImage();
  });

  // Show browser version
  $('#browsers').text(navigator.userAgent);

  // Make sure things clean up properly.
  window.onunload = window.onbeforeunload = () => {
    if (!!peer && !peer.destroyed) {
      peer.destroy();
    }
  };

  // Handle a connection object.
  function connect(room) {
    // Handle a chat connection.
    //$('#text').focus();

    //$('#connect').attr("src", "../../asset/connect_on.bmp");
    $('#connecticon').text("people");
    $('#num_member').text("with yours");
    changeIconHue(myid, 'connect');

    const chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', room.name);
    const roomName = room.name.replace('sfu_text_', '');
    const header = $('<h1></h1>').html('Room: <strong>' + roomName + '</strong>');
    const messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
    chatbox.append(header);
    chatbox.append(messages);
    // Select connection handler.
    chatbox.on('click', () => {
      chatbox.toggleClass('active');
    });

    $('.filler').hide();
    $('#connections').append(chatbox);

    room.getLog();
    room.once('log', logs => {
      for (let i = 0; i < logs.length; i++) {
        const log = JSON.parse(logs[i]);

        switch (log.messageType) {
          case 'ROOM_DATA':
            messages.append('<div><span class="peer">' + log.message.src + '</span>: ' + log.message.data + '</div>');
            break;
          case 'ROOM_USER_JOIN':
            if (log.message.src === peer.id) {
              break;
            }
            messages.append('<div><span class="peer">' + log.message.src + '</span>: has joined the room </div>');
            break;
          case 'ROOM_USER_LEAVE':
            if (log.message.src === peer.id) {
              break;
            }
            messages.append('<div><span class="peer">' + log.message.src + '</span>: has left the room </div>');
            break;
        }
      }
    });

    room.on('data', message => {
      if (message.data instanceof ArrayBuffer) {
        const dataView = new Uint8Array(message.data);
        const dataBlob = new Blob([dataView]);
        const url = URL.createObjectURL(dataBlob);
        messages.append('<div><span class="file">' +
          message.src + ' has sent you a <a target="_blank" href="' + url + '">file</a>.</span></div>');
      } else {
        // console.log(message.data);
        executeMsg(message.data);
        messages.append('<div><span class="peer">' + message.src + '</span>: ' + message.data + '</div>');
      }
    });

    room.on('peerJoin', peerId => {
      console.log("peerJoin: " + peerId);
      messages.append('<div><span class="peer">' + peerId + '</span>: has joined the room </div>');
      sendCanvasAsImage();
    });

    room.on('peerLeave', peerId => {
      messages.append('<div><span class="peer">' + peerId + '</span>: has left the room </div>');
    });
  }
});

function sendMsg(msg) {
  // console.log(msg);
  eachActiveRoom((room, $c) => {
    room.send(msg);
    $c.find('.messages').append('<div><span class="you">You: </span>' + msg
      + '</div>');
  });
}

function sendPing() {
  sendMsg("ping");
}

setInterval(function () {
  sendPing();
}, 2000);

// Goes through each active peer and calls FN on its connections.
function eachActiveRoom(fn) {
  const actives = $('.active');
  const checkedIds = {};
  actives.each((_, el) => {
    const peerId = $(el).attr('id');
    if (!checkedIds[peerId]) {
      const room = peer.rooms[peerId];
      fn(room, $(el));
    }
    checkedIds[peerId] = 1;
  });
}
