// var BOARD_WIDTH_BASE = 1280;
// var BOARD_HEIGHT_BASE = 960;
var BOARD_WIDTH_BASE = 960;
var BOARD_HEIGHT_BASE = 1280;
var BOARD_COL = 1;
var BOARD_ROW = 1;
var BOARD_WIDTH = BOARD_WIDTH_BASE * BOARD_COL;
var BOARD_HEIGHT = BOARD_HEIGHT_BASE * BOARD_ROW;

$(function() {
  var action_button_num = 6.0;
  var action = document.getElementById('actions');

  var canvas = document.getElementById('mycanvas');
  var container = document.getElementById('mycanvasdiv');
  sizing();

  function sizing() {

    canvas.height = BOARD_HEIGHT;
    canvas.width = BOARD_WIDTH;

    console.log("canvas size: " + canvas.height + ", " + canvas.width);

    // (3px (border) + 10px(padding)) * 2
    var margin = 26;
    $(".action_button").attr("width", action.offsetHeight - margin);
    $(".action_button").attr("height", action.offsetHeight - margin);
    $(".action_button").css("-webkit-border-radius", (action.offsetHeight - margin) / 6.0);
  }

});
