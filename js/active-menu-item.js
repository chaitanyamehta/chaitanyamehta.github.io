$(function () {
    $('.ui.menu a[href^="/' + location.pathname.split("/")[1] + '"].item').addClass('active');
});