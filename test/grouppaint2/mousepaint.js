var isDrawEnable = true;
mouseStroke = [];

var DESTINATION_OUT = false;
var PEN_WIDTH = 3;
var ERASER_WIDTH = 45;

var mycanvas = 'mycanvas0';

function executeMsg(msg) {
    var m = msg.split(" ");

    var uid = m[0];
    m.shift();
    var cmd = m[0];
    m.shift();
    var target = m[0];
    m.shift();

    if (cmd == "point") {
        position(uid, target, m);
    } else if (cmd == "hide") {
        hide(uid);
    } else if (cmd == "draw") {
        draw(cmd, uid, target, m);
    } else if (cmd == "erase") {
        erase(cmd, uid, target, m);
    } else if (cmd == "clear") {
        clear(uid, target, m);
    } else if (cmd == "create") {
        create(uid, target);
    } else if (cmd == "sync") {
        sync(uid, target, m[0]);
    }
}

function position(uid, target, m) {
    if (target != mycanvas) return;

    moveCursor(uid, m);
}

function hide(uid) {
    hideCursor(uid);
}

function showPointer(msg) {
}

function getContext(target) {
    var canvas = document.getElementById(target);
    if (!canvas || !canvas.getContext) {
        return false;
    }
    var ctx = canvas.getContext('2d');
    return {canvas: canvas, ctx: ctx};
}

function clear(uid, target, info) {
    clearCanvas(target);
    return;
}

function create(uid, target) {
    createCanvas(target);
}

function setupCanvas(canvas) {
    canvas.classList.add("canvas");
    canvas.classList.add("unfocus");
    setCanvasSize(canvas);

    // fill with white
    var ctx = canvas.getContext('2d');
    ctx.fillStyle="white";
    ctx.fillRect(0,0,BOARD_WIDTH,BOARD_HEIGHT);

    addPaintingListener(canvas.id);
    // addCustomZoom(canvas.id);
    document.querySelector("#" + canvas.id).style.zoom = 1;
}

function createCanvas(target) {
    canvas = document.createElement("canvas");
    canvas.id = target;
    document.getElementById('mycanvasdiv').appendChild(canvas);
    setupCanvas(canvas);

    app.max++;
    Vue.toasted.show('New Page Created !!');
}

function getNewCanvasId() {
    return "mycanvas" + getNumOfCanvas();
}

function createNewCanvas() {
    var newcanvas = getNewCanvasId();
    createCanvas(newcanvas);
    return newcanvas;
}

function getNumOfCanvas() {
    return $("canvas").length;
}

function changeCanvasFocus(i) {
    var curi =
        Number(mycanvas.slice("mycanvas".length));
    var newi = Math.max(0, Math.min(curi + i, getNumOfCanvas() - 1));

    var newfocus = "mycanvas" + newi;
    // console.log(mycanvas + " " + newfocus);

    if (mycanvas != newfocus) {

        $("canvas").addClass("unfocus");
        $("#" + mycanvas).removeClass("focus");

        mycanvas = newfocus;
        $("#" + mycanvas).removeClass("unfocus");
        $("#" + mycanvas).addClass("focus");
        
        app.cur = newi + 1;

        return true;
    } else {
        return false;
    }

}

function erase(cmd, uid, target, info) {
    draw(cmd, uid, target, info);
}

function draw(cmd, uid, target, info) {
    var c = getContext(target);

    var points = info;
    var w_ratio = c.canvas.width / points[0];
    points.shift();
    var h_ratio = c.canvas.height / points[0];
    points.shift();
    drawStroke(cmd, c.ctx, points, w_ratio, h_ratio);
}

function drawStroke(cmd, ctx, points, w_ratio, h_ratio) {
    for (var i = 0; i < points.length - 2; i += 2) {
        var start = {x: points[i] * w_ratio,
                     y: points[i + 1] * h_ratio};
        var end = {x: points[i + 2] * w_ratio,
                   y: points[i + 2 +1] * h_ratio};

        if (cmd == "erase") {
            drawWithEraser(ctx, start, end);
        } else if (cmd == "draw") {
            drawWithPen(ctx, start, end);
        }
    }
}

function clearCanvas(target) {
    var c = getContext(target);

    c.ctx.fillStyle="white";
    c.ctx.fillRect(0,0,BOARD_WIDTH,BOARD_HEIGHT);

    //c.ctx.clearRect(0, 0, c.canvas.width, c.canvas.height);
}

var pinching = false;
var zoom0 = 1;
var d0 = 1;
var d1 = 1;
var scroll0 = {l: 0, t: 0};
var p0 = {x: 0, y: 0};
var p1 = {x: 0, y: 0};

//var pinchTarget = "#mycanvas";

var scrollTarget = "#mycanvasdiv";
var scrollLeftTarget = "#mycanvasdiv";
var scrollTopTarget = "";

function customZoomMove(e) {

  if (e.touches.length == 2) {

      if (!pinching) {
          pinching = true;
          d0 = Math.sqrt(
                         Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) +
                         Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)
                         );
          p0 = {x: (e.touches[1].clientX + e.touches[0].clientX) / 2,
                y: (e.touches[1].clientY + e.touches[0].clientY) / 2};

          zoom0 = document.querySelector("#" + mycanvas).style.zoom;

          scroll0 = {l: $(scrollTarget).css("left").slice(0, -2),
                     t: $(scrollTarget).css("top").slice(0, -2)};
      } else {
          d1 = Math.sqrt(
                         Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) +
                         Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)
                         );
           p1 = {x: (e.touches[1].clientX + e.touches[0].clientX) / 2,
                 y: (e.touches[1].clientY + e.touches[0].clientY) / 2};


          var zoom1 = Math.min(Math.max(d1 / d0 * zoom0, 0.5), 3.0);
          document.querySelector("#" + mycanvas).style.zoom = zoom1;

          var scroll1 = {l: -(zoom1 / zoom0 * (p0.x - scroll0.l) - p1.x),
                         t: -(zoom1 / zoom0 * (p0.y - scroll0.t) - p1.y)};

          console.log(zoom1 + " " +
                      p1.x + "," + p1.y + " " +
                      scroll1.l + "," + scroll1.t);

          $(scrollTarget).css("left", scroll1.l);
          $(scrollTarget).css("top", scroll1.t);

      }
  }
}

function customZoomEnd() {
    pinching = false;
}

function addCustomZoom(target) {
document.getElementById(target).addEventListener("touchstart", function (e) {
     e.preventDefault();
});
document.getElementById(target).addEventListener("touchmove", function (e) {
     e.preventDefault();
     customZoomMove(e);
});
document.getElementById(target).addEventListener("touchend", function (e) {
     e.preventDefault();
     customZoomEnd(e);
});
}

function drawWithPen(ctx, prev, cur) {
    ctx.beginPath();
    ctx.globalCompositeOperation = "source-over";

    if (PEN_WIDTH / 2 - 2 > 0) {
        ctx.lineWidth = 1;
        ctx.arc(cur.x, cur.y, PEN_WIDTH / 2 - 2, 0, Math.PI*2, false);
        ctx.fill();
    }

    ctx.lineWidth = PEN_WIDTH;
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(cur.x, cur.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function drawWithEraser(ctx, prev, cur) {
    ctx.beginPath();
    ctx.globalCompositeOperation = "source-over";
    //ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 1;
    ctx.arc(cur.x, cur.y, ERASER_WIDTH / 2, 0, Math.PI*2, false);
    ctx.fill();

    ctx.lineWidth = ERASER_WIDTH;
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(cur.x, cur.y);
    if (ctx.globalCompositeOperation == "source-over")
      ctx.strokeStyle = "white";
    ctx.stroke();
}

function addCursorElm(uid) {
    var cursorid = 'cursor' + uid;
    cursor = document.createElement("img");
    cursor.id = cursorid;
    cursor.src = "../../asset/pointer-blue-trans.png";
    cursor.classList.add("cursor");
    cursor.classList.add("rotate");
    document.getElementById('mycanvasdiv').appendChild(cursor);
    changeIconHue(uid, cursorid);
}

function hideCursor(uid) {
    var cursorid = 'cursor' + uid;
    $('#' + cursorid).css("display", "none");
}

function moveCursor(uid, clientPos) {
    var cursorid = 'cursor' + uid;
    var cursor = document.getElementById(cursorid);
    
    if (!cursor) {
        addCursorElm(uid);
    }

    var zoom = document.querySelector("#" + mycanvas).style.zoom;

    $('#' + cursorid).css("display", "");
    $('#' + cursorid).css("left", 
                          Number(clientPos[0]) * zoom);
    $('#' + cursorid).css("top", 
                          Number(clientPos[1]) * zoom);

}

function encodeBase64(canvas) {
    var base64 = $("#" + canvas)[0].toDataURL('image/png');
    return base64;
}

function decodeBase64(target, base64) {
    var canvas = document.getElementById(target);
    if (!canvas) {
        var canvasid = createNewCanvas(target);
        canvas = document.getElementById(canvasid);
    }
    var ctx = canvas.getContext("2d");
    var image = new Image();
    image.onload = function(){
        ctx.drawImage(image, 0, 0);
    }
    image.src  = base64;
}

function sync(uid, target, base64) {
    decodeBase64(target, base64);
}

function sendCanvasAsImage() {
    var c = $(".canvas");
    for (i = 0; i < c.length; i++) {
        var base64 = encodeBase64(c[i].id);
        sendMsg(myid + " " +
                "sync" + " " +
                c[i].id + " " +
                base64);
    }
}

function addPaintingListener(mycanvas) {
    var canvas = document.getElementById(mycanvas);
    if (!canvas || !canvas.getContext) {
        return false;
    }
    var ctx = canvas.getContext('2d');
    //マウスの座標を取得
    var mouse = {
        x: 0,
        y: 0,
        color: "black",
        isDrawing: false
    };
    var borderWidth = 1;
    function getOffset(evt) {
        var el = evt.target,
            x = 0,
            y = 0;

        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft;// - el.scrollLeft;
            y += el.offsetTop;// - el.scrollTop;
            el = el.offsetParent;
        }
        x = evt.clientX / 3 - x;
        y = evt.clientY / 3;

        return { x: x, y: y };
    }
    function move(e) {
        //2.マウスが動いたら座標値を取得
        var rect = e.target.getBoundingClientRect();
        var cx, cy, ev;
        if (e.type.indexOf('touch') != -1) {
            ev = e.touches[0];
        } else {
            ev = e;
	}

        var zoom = document.querySelector("#" + mycanvas).style.zoom;

        mouse.x = ev.pageX - ev.target.offsetParent.offsetLeft;
        mouse.y = ev.pageY - ev.target.offsetParent.offsetTop;

        mouse.x += ev.target.offsetParent.scrollLeft;
        if (zoom != 1) {
            mouse.y += ev.target.offsetParent.scrollTop;
        } else {
            // mouse.y += -112;
        }
        mouse.x /= zoom;
        mouse.y /= zoom;
        mouse.x -= 5; // border, margin
        mouse.y -= 5; // border, margin

        var clientPos = [ev.clientX - $(scrollTarget).css("left").slice(0, -2),
                         ev.clientY - $(scrollTarget).css("top").slice(0, -2)];
        clientPos[0] /= zoom;
        clientPos[1] /= zoom;

        p = convertPointFromPageToNode(ev.target, ev.pageX, ev.pageY);
        mouse.x = p.x;
        mouse.y = p.y;
        clientPos[0] = p.x;
        clientPos[1] = p.y;

        if (!isDrawEnable) // show local cursor when pointing mode
            moveCursor(myid, clientPos);
        if (mouseStroke.length < 4 || mouseStroke.length % 4) {
            sendMsg(myid + " " +
                    "point" + " " +
                    mycanvas + " " +
                    clientPos.join(" "));
        }

        //4.isDrawがtrueのとき描画
        if (mouse.isDrawing) {
            mouseStroke.push(mouse.x);
            mouseStroke.push(mouse.y);
            if (mouseStroke.length == 0) return;
            var max = mouseStroke.length - 1;
            var cur = {x: mouseStroke[max - 1], y:  mouseStroke[max]};
            var prev = {x: mouseStroke[max - 3], y: mouseStroke[max - 2]};

            if (!DESTINATION_OUT) {
                drawWithPen(ctx, prev, cur);
            } else {
                drawWithEraser(ctx, prev, cur);
            }
        }
    };
    function start(e) {
        mouseStroke = [];
        if (isDrawEnable)
            mouse.isDrawing = true;
        move(e);
        move(e);
    };
    function end(e) {
        console.log("end is called");
        mouse.isDrawing = false;
        // draw
        if (mouseStroke.length > 3) {
            var msg = mouseStroke.join(" ");
            var canvas = document.getElementById(mycanvas);
            msg = myid + " " +
                (DESTINATION_OUT ? "erase" : "draw") + " " +
                mycanvas + " " +
                canvas.width + " " + canvas.height + " " +
                msg;
            sendMsg(msg);
            console.log("sendMsg is called");
        }
        // hide cursor
        hideCursor(myid);
        msg = myid + " " +
            "hide" + " ";
        sendMsg(msg);
    };
    function cancel(e) {
        end(e);
    };
    function prevent(f, e) {
        e.preventDefault();
        if (e.touches.length < 2) {
            f(e);
        }
    }
    canvas.addEventListener("mousemove", function (e) {
        prevent(move, e);
    });
    canvas.addEventListener("touchmove", function (e) {
        $('#messages').append('<br>Event:<br>' + "move");
        prevent(move, e);
    });
    canvas.addEventListener("mousedown", function (e) {
        prevent(start, e);
    });
    canvas.addEventListener("touchstart", function (e) {
        $('#messages').append('<br>Event:<br>' + "start");
        prevent(start, e);
    });
    canvas.addEventListener("mouseup", function (e) {
        prevent(end, e);
    });
    canvas.addEventListener("touchend", function (e) {
        prevent(end, e);
    });
    canvas.addEventListener('mouseleave', function (e) {
        prevent(cancel, e);
    });
    canvas.addEventListener('touchcancel', function (e) {
        prevent(cancel, e);
    });
}

window.onload = function() {
 Vue.component('modal', {
         template: '#modal-template'
     });

  appstatus = new Vue({
          el: "#appstatus",
          data: {
              num_member: 0,
              connected: 'font_green',
              disconnected: 'font_red'
          },
          computed: {
              is_connected: function () {
                  return this.num_member > 0;
              }, 
              sync_icon: function () {
                  if (this.num_member == 0)
                      return 'sync_problem'
                  else if (this.num_member == 1)
                      return 'sync'
                  else if (this.num_member > 1)
                      return 'people'
              }
          }
      });

  app = new Vue({
          el: "#app",
          data: {
              cur: 0,
              max: 0,
              showModal: false
          },
          computed: {
              go_icon_src: function () {
                  var base = "../../asset/";
                  if (this.cur == this.max)
                      return base + "plus.bmp";
                  else
                      return base + "go.bmp";
              }
          },
          methods: {
              go: function(e) {
                  console.log("touchstarted");

                  e.preventDefault();

                  if (!changeCanvasFocus(1)) {
                      var newcanvas = createNewCanvas();
                      msg = myid + " " + "create" +  " " + newcanvas;
                      sendMsg(msg);

                      changeCanvasFocus(1); 
                  }
              },
              back: function(e) {
                  e.preventDefault();
                  changeCanvasFocus(-1);
              }
          }
      });

  mycanvas = createNewCanvas();
  var canvas = $("#"+mycanvas)[0]; 
  canvas.classList.remove("unfocus");
  canvas.classList.add("focus");
  app.cur = 1;
};