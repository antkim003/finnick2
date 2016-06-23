'use strict';

module.exports = () =>
{

    var lastScrollTop = 0;
    var lastScrollLeft = 0;

    var scrollFunc = function () {
        var st = $(window).scrollTop();
        var sl = $(window).scrollLeft();
        $('[data-property=id]').css(
            {
                'margin-top': -$(window).scrollTop(),
                'margin-left': '-1px'
            }
        );
        $('.fixedHead').css(
            {
                'margin-left': -$(window).scrollLeft() - 13,
            }
        );
        if ($('thead')[0].getBoundingClientRect().top < 0) {
            $('.fixedHead').css({'display': 'block'})
            $('.navbar').css({'display': 'none' })
        } else {
            $('.fixedHead').css({'display': 'none' })
            $('.navbar').css({'display': 'block' })

        }
            _.each($('.fixedHead'), function (fh, i) {
                var wid = i == 0 ? 38 : 39;
                $(fh).css({'width': $(fh).parent().width() + wid, 'height': $(fh).parent().height()+10, 'visibility': 'visible'});

//            $(fh).css({ 'width': '1000%', 'height': $(fh).parent().height(), 'visibility': 'visible'});
            });


        if (st > lastScrollTop) {
//            $('article.pure-u-1 .controls:first-child').css({'position': 'relative', 'top': '0'})
            // downscroll code
        } else if (st < lastScrollTop) {
//            $('article.pure-u-1 .controls:first-child').css({'position': 'relative', 'top': '0'})

        } else if (st == lastScrollTop) {
//            if ($('h1')[0].getBoundingClientRect().right < 0 && $('thead')[0].getBoundingClientRect().top > 0) {
//                $('article.pure-u-1 .controls:first-child').css({'position': 'fixed', 'top': '0'})
//            } else {
//                $('article.pure-u-1 .controls:first-child').css({'position': 'relative', 'top': '0'})
//            }
            //side scroll
            if (sl > lastScrollLeft) {
            } else {
            }
        }
        lastScrollTop = st;
        lastScrollLeft = sl;
    }


//fixed headers and rows
    $(window).on('scroll', scrollFunc);

}