$(function() {
  var canvas = document.getElementById('mycanvas');
  var container = document.getElementById('mycanvasdiv');
  sizing();

  function sizing() {
    if (container.offsetHeight > container.offsetWidth * 16.0 / 9.0) {
      canvas.height = container.offsetWidth * 16.0 / 9.0;
      canvas.width = container.offsetWidth;
    } else {
      canvas.height = container.offsetHeight;
      canvas.width = container.offsetHeight * 9.0 / 16.0;
    }
  }

  window.addEventListener('resize', function() {
    (!window.requestAnimationFrame) ? setTimeout(sizing, 300): window.requestAnimationFrame(sizing);  
  });
});
