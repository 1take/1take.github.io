$(function() {
  var action_button_num = 6.0;
  var action = document.getElementById('actions');

  var canvas = document.getElementById('mycanvas');
  var container = document.getElementById('mycanvasdiv');
  sizing();

  function sizing() {
    if (container.offsetHeight > container.offsetWidth * 4.0 / 3.0) {
      canvas.height = container.offsetWidth * 4.0 / 3.0;
      canvas.width = container.offsetWidth;
    } else {
      canvas.height = container.offsetHeight;
      canvas.width = container.offsetHeight * 3.0 / 4.0;
    }


    //var pencil = $("#pencil");
    //document.getElementById('pencil').width = 200; //container.offsetWidth / action_button_num;
    $(".action_button").attr("width", action.offsetWidth * 0.8 / action_button_num);
    $(".action_button").css("-webkit-border-radius", action.offsetWidth * 0.8 / action_button_num / 6.0);
    $(".action_button").css("margin", action.offsetWidth * 0.8 / action_button_num / 25.0);

  }

  window.addEventListener('resize', function() {
    (!window.requestAnimationFrame) ? setTimeout(sizing, 300): window.requestAnimationFrame(sizing);  
  });
});
