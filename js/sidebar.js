$(function () {
    $('.ui.sidebar').sidebar('attach events', '.menu .sidebar.item');
});

$(window).resize(function () {
    if (window.matchMedia('(min-width: 768px)').matches) {
        $(".ui.sidebar.menu.visible").sidebar('hide');
    }
});