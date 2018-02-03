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

function resizeCanvas() {
    var canvas = document.getElementById(mycanvas);
    setCanvasSize(canvas);
    console.log("canvas size: " + canvas.height + ", " + canvas.width);
}

$(function() {
  var action_button_num = 6.0;
  var action = document.getElementById('actions');

  var container = document.getElementById('mycanvasdiv');
  sizing();

  function sizing() {

      resizeCanvas();

    // (3px (border) + 10px(padding)) * 2
    var margin = 13;
    $(".action_button").attr("width", action.offsetHeight - margin);
    $(".action_button").attr("height", action.offsetHeight - margin);
    $(".action_button").css("-webkit-border-radius", (action.offsetHeight) / 2.0);
  }

});
