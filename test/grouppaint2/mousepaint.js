mouseStroke = [];

var DESTINATION_OUT = false;
var PEN_WIDTH = 5;
var ERASER_WIDTH = 80;

function writeByMsg(msg) {
    var canvas = document.getElementById('mycanvas');
    if (!canvas || !canvas.getContext) {
        return false;
    }
    var ctx = canvas.getContext('2d');

    //マウスの座標を取得
    var borderWidth = 1;

    var points = msg.split(" ");

    var type = points[0];

    if (type == -1) {
        clearCanvas();
        return;
    }

    var w_ratio = canvas.width / points[1];
    var h_ratio = canvas.height / points[2];
    for (var i = 3; i < points.length - 2; i += 2) {
        var start = {x: points[i] * w_ratio,
                     y: points[i + 1] * h_ratio};
        var end = {x: points[i + 2] * w_ratio,
                   y: points[i + 2 +1] * h_ratio};

        if (type == 0) {
            drawWithEraser(ctx, start, end);
        } else if (type == 1) {
            drawWithPen(ctx, start, end);
        }
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

var pinching = false;
var zoom0 = 1;
var d0 = 1;
var d1 = 1;
var scroll0 = {l: 0, t: 0};
var p0 = {x: 0, y: 0};
var p1 = {x: 0, y: 0};

var pinchTarget = "#mycanvas";

var scrollLeftTarget = "#mycanvasdiv";
var scrollTopTarget = "";

function getScrollTopTarget() {
    var targets = ['html', // chrome (61.0 or later)
                   'body']; // chrome, safari
    for (var i = 0; i < targets.length; i++) {
        var s = 1;
        var t = targets[i];
        $(t).scrollTop(s);
        console.log("try scrollTopTarget: " + t + " " + $(t).scrollTop());
        if ($(t).scrollTop() == s) {
            console.log("scrollTopTarget: " + t);
            scrollTopTarget = t;
            $(t).scrollTop(0);
            return;
        }
    }
}

function customZoomMove(e) {
  if (scrollTopTarget == "") getScrollTopTarget();

  if (e.touches.length == 2) {

      if (!pinching) {
          pinching = true;
          d0 = Math.sqrt(
                         Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) +
                         Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)
                         );
          p0 = {x: (e.touches[1].clientX + e.touches[0].clientX) / 2,
                y: (e.touches[1].clientY + e.touches[0].clientY) / 2};

          zoom0 = document.querySelector(pinchTarget).style.zoom;

          scroll0 = {l: $(scrollLeftTarget).scrollLeft(),
                     t: $(scrollTopTarget).scrollTop()};
      } else {
          d1 = Math.sqrt(
                         Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) +
                         Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)
                         );
           p1 = {x: (e.touches[1].clientX + e.touches[0].clientX) / 2,
                 y: (e.touches[1].clientY + e.touches[0].clientY) / 2};

          var zoom1 = Math.min(Math.max(d1 / d0 * zoom0, 1), 3.0);
          document.querySelector(pinchTarget).style.zoom = zoom1;

          var scroll1 = {l: zoom1 / zoom0 * (p0.x + scroll0.l) - p1.x,
                         t: zoom1 / zoom0 * (p0.y + scroll0.t) - p1.y};
          /*
          console.log(zoom1 + " " +
                      p1.x + "," + p1.y + " " +
                      scroll1.l + "," + scroll1.t);
          */

          $(scrollLeftTarget).scrollLeft(scroll1.l);
          $(scrollTopTarget).scrollTop(scroll1.t);

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
    // ctx.arc(curX, curY, PEN_WIDTH, 0, Math.PI*2, false);
    // ctx.fill();
    ctx.lineWidth = PEN_WIDTH;
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(cur.x, cur.y);
    // ctx.strokeStyle = mouse.color;
    ctx.stroke();
}

function drawWithEraser(ctx, prev, cur) {
    ctx.beginPath();
    ctx.globalCompositeOperation = "destination-out";
    // ctx.arc(curX, curY, ERASER_WIDTH, 0, Math.PI*2, false);
    // ctx.fill();
    ctx.lineWidth = ERASER_WIDTH;
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(cur.x, cur.y);
    // ctx.strokeStyle = mouse.color;
    ctx.stroke();
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

        var zoom = document.querySelector(pinchTarget).style.zoom;
        /* console.log("zoom:" + zoom + " pageY: " + ev.pageY +
                    ", offsettop:" + ev.target.offsetParent.offsetTop +
                    ", scrolltop: " + ev.target.offsetParent.scrollTop); */

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
        mouse.x -= 10; // border, margin
        mouse.y -= 10; // border, margin

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
        mouse.isDrawing = true;
        move(e);
        move(e);
    };
    function end(e) {
        console.log("end is called");
        mouse.isDrawing = false;
        if (mouseStroke.length > 3) {
            var msg = mouseStroke.join(" ");
            var canvas = document.getElementById(mycanvas);
            msg = (DESTINATION_OUT ? 0 : 1) + " " +
                canvas.width + " " + canvas.height + " " +
                msg;
            sendMsg(msg);
            console.log("sendMsg is called");
        }
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

(function () {
    $(document).ready(function () {
      addPaintingListener('mycanvas');

      addCustomZoom('mycanvas');
      //// test
	document.querySelector(pinchTarget).style.zoom = 1;
    });
})();
