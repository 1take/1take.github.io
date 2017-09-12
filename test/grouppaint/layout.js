$(function() {
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
  }

  window.addEventListener('resize', function() {
    (!window.requestAnimationFrame) ? setTimeout(sizing, 300): window.requestAnimationFrame(sizing);  
  });
});
