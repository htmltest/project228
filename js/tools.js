$(document).ready(function() {

    $('.notices-more a').click(function(e) {
        $('.notices-list').toggleClass('open');
        e.preventDefault();
    });

    $('.notice-link').click(function(e) {
        $('.notices-list').addClass('open');
        var curID = $(this).attr('data-id');
        var curNotice = $('.notices-item[data-id="' + curID + '"]');
        if (curNotice.length == 1) {
            $('html, body').animate({'scrollTop': curNotice.offset().top - $('header').outerHeight() - 20});
        }
        e.preventDefault();
    });

    $('.section-buy-box-variants-menu a').click(function(e) {
        var curItem = $(this);
        if (!curItem.hasClass('active')) {
            $('.section-buy-box-variants-menu a.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = $('.section-buy-box-variants-menu a').index(curItem);
            $('.section-buy-box-variant.active').removeClass('active');
            $('.section-buy-box-variant').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    var isPageClick = false;

    $('.articles-tags form').each(function() {
        var curForm = $(this);
        curForm.submit(function(e) {
            $('.articles-container').addClass('loading');

            var curData = curForm.serialize();
            if ($('.articles-container .pager a.active').length == 1) {
                curData += '&page=' + $('.pager a.active').attr('data-value');
            }
            $.ajax({
                type: 'POST',
                url: curForm.attr('action'),
                dataType: 'html',
                data: curData,
                cache: false
            }).fail(function(jqXHR, textStatus, errorThrown) {
                alert('Сервис временно недоступен, попробуйте позже.');
                $('.articles-container').removeClass('loading');
            }).done(function(html) {
                $('.articles-container').html($(html).html());

                $('.articles-container').removeClass('loading');
                if (isPageClick) {
                    isPageClick = false;
                    var curMargin = $('header').height();
                    $('html, body').animate({'scrollTop': $('.articles-container').offset().top - curMargin});
                }
            });
            e.preventDefault();
        });
    });

    $('body').on('change', '.articles-tags input', function() {
        $('.articles-tags form').trigger('submit');
    });

    $('body').on('click', '.articles-container .pager a', function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('active')) {
            $('.articles-container .pager a.active').removeClass('active');
            curLink.addClass('active');
            if (e.originalEvent === undefined) {
                isPageClick = false;
            } else {
                isPageClick = true;
            }
            $('.articles-tags form').trigger('submit');
        }
        e.preventDefault();
    });

    $('.product-instruction-section-title').click(function() {
        $(this).parent().toggleClass('open');
    });

    $('.up-link').click(function(e) {
        $('html, body').animate({'scrollTop': 0});
        e.preventDefault();
    });

    $('.menu-mobile-link').click(function(e) {
        if ($('html').hasClass('menu-mobile-open')) {
            $('html').removeClass('menu-mobile-open');
            $('meta[name="viewport"]').attr('content', 'width=device-width');
            $(window).scrollTop($('html').data('scrollTop'));
        } else {
            var curWidth = $(window).width();
            if (curWidth < 375) {
                curWidth = 375;
            }
            var curScroll = $(window).scrollTop();
            $('html').addClass('menu-mobile-open');
            $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
            $('html').data('scrollTop', curScroll);
        }
        e.preventDefault();
    });

    $('.varicose-types-menu a').click(function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('active')) {
            $('.varicose-types-menu a.active').removeClass('active');
            curLink.addClass('active');
            var curIndex = $('.varicose-types-menu a').index(curLink);
            $('.varicose-type.active').removeClass('active');
            $('.varicose-type').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

});

$(window).on('load resize scroll', function() {
    var windowScroll = $(window).scrollTop();

    var windowScroll = $(window).scrollTop();
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    var headerHeight = 72;
    if ($(window).width() < 1200) {
        headerHeight = 68;
    }

    if (windowScroll > headerHeight) {
        $('header').addClass('fixed')
    } else {
        $('header').removeClass('fixed')
    }

    if ($('.up-link').length == 1) {
        if (windowScroll > windowHeight) {
            $('.up-link').addClass('visible');
        } else {
            $('.up-link').removeClass('visible');
        }
    }
});