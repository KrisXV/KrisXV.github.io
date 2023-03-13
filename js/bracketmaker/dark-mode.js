$(document).ready(function () {
    var ls = localStorage;
    if (ls.getItem('darkmode')) {
        $('.DivToScroll').addClass("dark");
        $('.body').addClass("dark-body");
    }
    $('#dark-mode').click(function () {
        var el = $('#dark-mode');
        if (el.is(':checked')) {
            ls.setItem('darkmode', true);
            $('.DivToScroll').addClass("dark");
            $('.body').addClass("dark-body");
        } else {
            ls.removeItem('darkmode');
            $('.DivToScroll').removeClass("dark");
            $('.body').removeClass("dark-body");
        }
    });
});
