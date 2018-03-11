var page_number;

// var BOARD_WIDTH_BASE = 1280;
// var BOARD_HEIGHT_BASE = 960;
var BOARD_WIDTH_BASE = 960;
var BOARD_HEIGHT_BASE = 1280;
var BOARD_COL = 1;
var BOARD_ROW = 1;
var BOARD_WIDTH = BOARD_WIDTH_BASE * BOARD_COL;
var BOARD_HEIGHT = BOARD_HEIGHT_BASE * BOARD_ROW;

function setCanvasSize(canvas) {
    canvas.height = BOARD_HEIGHT;
    canvas.width = BOARD_WIDTH;
}

//function resizeCanvas() {
//    var canvas = document.getElementById(mycanvas);
//    setCanvasSize(canvas);
//    console.log("canvas size: " + canvas.height + ", " + canvas.width);
//}

$(function() {
  var action_button_num = 6.0;
  var action = document.getElementById('actions');

  var container = document.getElementById('mycanvasdiv');
  sizing();

  function sizing() {

      //    resizeCanvas();

    // (3px (border) + 10px(padding)) * 2
      var margin = 23;
    $(".action_button").attr("width", action.offsetHeight - margin);
    $(".action_button").attr("height", action.offsetHeight - margin);
    $(".action_button").css("-webkit-border-radius", (action.offsetHeight) / 2.0);
  }

});

$(window).bind('orientationchange resize', function(event){
//$(window).bind('resize', function(event){
        //if (window.orientation == 90 || window.orientation == -90) {
        //            if (event.orientation == 'landscape') {
                var c = $('#' + mycanvas);
                rotate(c, -window.orientation);

                //            }
                //}
    });

function rotate(el, degs) {
    iedegs = degs/90;
    if (iedegs < 0) iedegs += 4;
    transform = 'rotate('+degs+'deg)';
    iefilter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+iedegs+')';
    styles = {
        transform: transform,
        '-webkit-transform': transform,
        '-moz-transform': transform,
        '-o-transform': transform,
        filter: iefilter,
        '-ms-filter': iefilter
    };
    $(el).css(styles);
}