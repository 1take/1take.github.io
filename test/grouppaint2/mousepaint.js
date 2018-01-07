mouseStroke = [];

var LINE_WIDTH = 5;

function writeByMsg(msg) {
    var canvas = document.getElementById('mycanvas');
    if (!canvas || !canvas.getContext) {
        return false;
    }
    var ctx = canvas.getContext('2d');

    //マウスの座標を取得
    var borderWidth = 1;

    var points = msg.split(" ");
    var w_rate = canvas.width / points[0];
    var h_rate = canvas.height / points[1];
    for (var i = 4; i < points.length; i += 2) {
        ctx.beginPath();
	ctx.lineWidth = LINE_WIDTH;
        var startX = points[i - 2], startY = points[i - 2 + 1];
        var endX = points[i], endY = points[i + 1];
        ctx.moveTo(startX * w_rate, startY * h_rate);
        ctx.lineTo(endX * w_rate, endY * h_rate);
        ctx.strokeStyle = "blue";
        ctx.stroke();
    }
}

function clearCanvas() {
    var canvas = document.getElementById('mycanvas');
    if (!canvas || !canvas.getContext) {
        return false;
    }
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var BROWSER_DEFAULT_ENABLED = true;
function toggleBrowserDefault() {
  BROWSER_DEFAULT_ENABLED = !BROWSER_DEFAULT_ENABLED;
}
function enableBrowserDefault() {
  BROWSER_DEFAULT_ENABLED = true;
}
function disableBrowserDefault() {
  BROWSER_DEFAULT_ENABLED = false;
}

var pinching = false;
var d0 = 1;
var d1 = 1;
var pinchTarget = "#mycanvas";

var pinchtest = false;

function customZoomMove(e) {
  if (!BROWSER_DEFAULT_ENABLED) return;

  if (!pinchtest) {
      if (e.touches.length == 2) {
	  alert("in touch length 2");
	  if (!pinching) {
	      pinching = true;
	      d0 = Math.sqrt(
		  Math.pow(e.touches[1].screenX - e.touches[0].screenX, 2) +
		      Math.pow(e.touches[1].screenY - e.touches[0].screenY, 2)
	      );
	      alert("in touch length 2 - pinch false");
	  } else {
	      d1 = Math.sqrt(
		  Math.pow(e.touches[1].screenX - e.touches[0].screenX, 2) +
		      Math.pow(e.touches[1].screenY - e.touches[0].screenY, 2)
	      );
	      document.querySelector(pinchTarget).style.zoom = d1 / d0;
	      alert("in touch length 2 - pinch true");
	  }
      }
  } else {
      if (!pinching) {
	  pinching = true
      }
      document.querySelector(pinchTarget).style.zoom = 2;
  }
}
function customZoomEnd() {
    if (!BROWSER_DEFAULT_ENABLED) return;

    pinching = false;
    if (pinchtest) {
	document.querySelector(pinchTarget).style.zoom = "";
    }
}

document.addEventListener("touchstart", function (e) {
     customZoomMove(e);
});
document.addEventListener("touchend", function (e) {
     customZoomEnd(e);
});

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
    function move(e) {
        //2.マウスが動いたら座標値を取得
        var rect = e.target.getBoundingClientRect();
        var cx, cy, ev;
        if (e.type.indexOf('touch') != -1) {
            ev = e.touches[0];
        } else {
            ev = e;
	}
        mouse.x = ev.clientX - rect.left - borderWidth;
        mouse.y = ev.clientY - rect.top - borderWidth;
        //4.isDrawがtrueのとき描画
        if (mouse.isDrawing) {
            mouseStroke.push(mouse.x);
            mouseStroke.push(mouse.y);
            if (mouseStroke.length == 0) return;
            var max = mouseStroke.length - 1;
            var curX = mouseStroke[max - 1], curY = mouseStroke[max];
            var prevX = mouseStroke[max - 3], prevY = mouseStroke[max - 2];
            ctx.beginPath();
	    ctx.lineWidth = LINE_WIDTH;
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(curX, curY);
            ctx.strokeStyle = mouse.color;
            ctx.stroke();
        }
    };
    function start(e) {
        mouseStroke = [];
        mouse.isDrawing = true;
    };
    function end(e) {
        mouse.isDrawing = false;
        if (mouseStroke.length > 3) {
            var msg = mouseStroke.join(" ");
            var canvas = document.getElementById(mycanvas);
            msg = canvas.width + " " + canvas.height + " " + msg;
            sendMsg(msg);
        }
    };
    function cancel(e) {
        end(e);
    };
    function prevent(f, e) {
	if (!BROWSER_DEFAULT_ENABLED) {
            e.preventDefault();
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

(function () {
    $(document).ready(function () {
      addPaintingListener('mycanvas');
    });
})();
