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
    for (var i = 2; i < points.length; i += 2) {
        ctx.beginPath();
        var startX = points[i - 2], startY = points[i - 2 + 1];
        var endX = points[i], endY = points[i + 1];
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
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

    ctx.clearRect(0, 0, 640, 480);
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
            startX: 0,
            startY: 0,
            x: 0,
            y: 0,
            color: "black",
            isDrawing: false
        };
        var borderWidth = 1;

        function move(e) {
            //2.マウスが動いたら座標値を取得
            var rect = e.target.getBoundingClientRect();
            mouse.x = e.clientX - rect.left - borderWidth;
            mouse.y = e.clientY - rect.top - borderWidth;
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

                ctx.beginPath();
                ctx.moveTo(mouse.startX, mouse.startY);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = mouse.color;
                ctx.stroke();
                mouse.startX = mouse.x;
                mouse.startY = mouse.y;
            }
        };

        function start(e) {
            mouseStroke = [];

            mouse.isDrawing = true;
            mouse.startX = mouse.x;
            mouse.startY = mouse.y;            
        };

        function end(e) {
            mouse.isDrawing = false;

            var msg = mouseStroke.join(" ");
            conn.send(msg);
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
            prevent(move, e);
        });

        canvas.addEventListener("mousedown", function (e) {
            prevent(start, e);
        });
        canvas.addEventListener("touchstart", function (e) {
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