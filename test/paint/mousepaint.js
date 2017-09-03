mouseStroke = [];

function writeByMsg(msg) {
    var canvas = document.getElementById('mycanvas');
    if (!canvas || !canvas.getContext) {
        return false;
    }
    var ctx = canvas.getContext('2d');

    //�}�E�X�̍��W���擾
    var borderWidth = 1;

    var points = msg.split(" ");
    for (var i = 2; i < points.length; i += 2) {
        ctx.beginPath();
        var startX = points[i - 2], startY = points[i - 2 + 1];
        var endX = points[i], endY = points[i + 1];
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }
}

(function () {
    $(document).ready(function () {
        var canvas = document.getElementById('mycanvas');
        if (!canvas || !canvas.getContext) {
            return false;
        }
        var ctx = canvas.getContext('2d');

        //�}�E�X�̍��W���擾
        var mouse = {
            startX: 0,
            startY: 0,
            x: 0,
            y: 0,
            color: "black",
            isDrawing: false
        };
        var borderWidth = 1;

        canvas.addEventListener("mousemove", function (e) {
            //2.�}�E�X������������W�l���擾
            var rect = e.target.getBoundingClientRect();
            mouse.x = e.clientX - rect.left - borderWidth;
            mouse.y = e.clientY - rect.top - borderWidth;
            /*
            pageX[Y], offsetLeft[Top]���g���ꍇ
            mouse.x = e.pageX - canvas.offsetLeft - borderWidth;
            mouse.y = e.pageY - canvas.offsetTop - borderWidth;
            */

            //3.����info�ɏo��
            document.getElementById("info").innerHTML =
        " clientX = " + Math.floor(e.clientX) + "px" +
        " clientY = " + Math.floor(e.clientY) + "px" + '<br>' +
        " rect.left = " + Math.floor(rect.left) + "px" +
            " rect.top = " + Math.floor(rect.top) + "px" + '<br><br>' +

        " pageX = " + Math.floor(e.pageX) + "px" +
        " pageY = " + Math.floor(e.pageY) + "px" + '<br>' +
        ' offsetLeft = ' + Math.floor(canvas.offsetLeft) + "px" +
        ' offsetTop = ' + Math.floor(canvas.offsetTop) + "px" + '<br><br>' +

            " canvas x position = " + Math.floor(mouse.x) + "px" +
            " canvas y position = " + Math.floor(mouse.y) + "px" + '<br>';

            //4.isDraw��true�̂Ƃ��`��
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
        });

        //5.�}�E�X����������A�`��OK(myDraw��true)
        canvas.addEventListener("mousedown", function (e) {
            mouseStroke = [];

            mouse.isDrawing = true;
            mouse.startX = mouse.x;
            mouse.startY = mouse.y;
        });

        //6.�}�E�X���グ����A�`��֎~(myDraw��false)
        canvas.addEventListener("mouseup", function (e) {
            mouse.isDrawing = false;

            var msg = mouseStroke.join(" ");
            $('#messages').append('<br>Your Mouse:<br>' + msg);
            conn.send(msg);

        });

        canvas.addEventListener('mouseleave', function (e) {
            mouse.isDrawing = false;

            var msg = mouseStroke.join(" ");
            $('#messages').append('<br>Your Mouse:<br>' + msg);
            conn.send(msg);

        });
    });
})();