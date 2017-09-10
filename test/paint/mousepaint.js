mouseStroke = [];

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

(function () {
    $(document).ready(function () {
        var canvas = document.getElementById('mycanvas');
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

            if (e.type.indexOf('touch') != -1)
                ev = e.touches[0];
            else
                ev = e;

            mouse.x = ev.clientX - rect.left - borderWidth;
            mouse.y = ev.clientY - rect.top - borderWidth;
            /*
            pageX[Y], offsetLeft[Top]を使う場合
            mouse.x = e.pageX - canvas.offsetLeft - borderWidth;
            mouse.y = e.pageY - canvas.offsetTop - borderWidth;
            */

            //3.情報をinfoに出力
            //    document.getElementById("info").innerHTML =
            //" clientX = " + Math.floor(e.clientX) + "px" +
            //" clientY = " + Math.floor(e.clientY) + "px" + '<br>' +
            //" rect.left = " + Math.floor(rect.left) + "px" +
            //    " rect.top = " + Math.floor(rect.top) + "px" + '<br><br>' +
    
            //" pageX = " + Math.floor(e.pageX) + "px" +
            //" pageY = " + Math.floor(e.pageY) + "px" + '<br>' +
            //' offsetLeft = ' + Math.floor(canvas.offsetLeft) + "px" +
            //' offsetTop = ' + Math.floor(canvas.offsetTop) + "px" + '<br><br>' +
    
            //    " canvas x position = " + Math.floor(mouse.x) + "px" +
            //    " canvas y position = " + Math.floor(mouse.y) + "px" + '<br>';

            //4.isDrawがtrueのとき描画
            if (mouse.isDrawing) {

                mouseStroke.push(mouse.x);
                mouseStroke.push(mouse.y);

                if (mouseStroke.length == 0) return;

                var max = mouseStroke.length - 1; 
                var curX = mouseStroke[max - 1], curY = mouseStroke[max];
                var prevX = mouseStroke[max - 3], prevY = mouseStroke[max - 2];
 
                ctx.beginPath();
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

            var msg = mouseStroke.join(" ");

            var canvas = document.getElementById('mycanvas');
            conn.send(canvas.width + " " + canvas.height + " " + msg);
        };

        function cancel(e) {
            end(e);
        };

        function prevent(f, e) {
            e.preventDefault();
            f(e);
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

    });
})();