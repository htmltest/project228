$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            curField.find('.form-file-input span').html('<em>' + curName + '<a href="#"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></a></em>');
            curField.addClass('full');
        } else {
            curField.find('.form-file-input span').html(curField.find('.form-file-input span').attr('data-placeholder'));
            curField.removeClass('full');
        }
    });

    $('body').on('click', '.form-file-input span em a', function(e) {
        var curField = $(this).parents().filter('.form-file');
        curField.removeClass('full');
        curField.find('input').val('');
        curField.find('.form-file-input span').html(curField.find('.form-file-input span').attr('data-placeholder'));
        e.preventDefault();
    });

    $('.form-files').each(function() {
        var curFiles = $(this);
        if (curFiles.find('.form-files-list-item').length > 0) {
            curFiles.addClass('full');
            curFiles.find('.files-required').val('true');
        }
    });

    $('body').on('click', '.form-files-list-item-remove', function(e) {
        var curLink = $(this);
        var curFiles = curLink.parents().filter('.form-files');
        $.ajax({
            type: 'GET',
            url: curLink.attr('href'),
            dataType: 'json',
            cache: false
        }).done(function(data) {
            curLink.parent().remove();
            if (curFiles.find('.form-files-list-item-progress, .form-files-list-item').length == 0) {
                curFiles.removeClass('full');
                curFiles.find('.files-required').val('');
            }
        });
        e.preventDefault();
    });

    $('body').on('click', '.form-files-list-item-cancel', function(e) {
        var curLink = $(this);
        var curFiles = curLink.parents().filter('.form-files');
        curLink.parent().remove();
        if (curFiles.find('.form-files-list-item-progress, .form-files-list-item').length == 0) {
            curFiles.removeClass('full');
            curFiles.find('.files-required').val('');
        }
        e.preventDefault();
    });

    $(document).bind('drop dragover', function (e) {
        e.preventDefault();
    });

    $(document).bind('dragover', function (e) {
        var dropZones = $('.form-files-dropzone'),
            timeout = window.dropZoneTimeout;
        if (timeout) {
            clearTimeout(timeout);
        } else {
            dropZones.addClass('in');
        }
        var hoveredDropZone = $(e.target).closest(dropZones);
        dropZones.not(hoveredDropZone).removeClass('hover');
        hoveredDropZone.addClass('hover');
        window.dropZoneTimeout = setTimeout(function () {
            window.dropZoneTimeout = null;
            dropZones.removeClass('in hover');
        }, 100);
    });

    $('body').on('click', '.form-files-dropzone', function(e) {
        var curLink = $(this);
        var curFiles = $(this).parents().filter('.form-files');
        curFiles.find('.form-files-input input').click();
        e.preventDefault();
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        windowOpen(curLink.attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            if ($('.window-expert').length == 0) {
                windowClose();
            }
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            if ($('.window-expert').length == 0) {
                windowClose();
            }
        }
    });

    $('body').on('click', '.window-close, .window-close-btn', function(e) {
        if ($('.window-expert').length == 0) {
            windowClose();
        }
        e.preventDefault();
    });

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

    $('.section-buy-variants-menu a').click(function(e) {
        var curItem = $(this);
        if (!curItem.hasClass('active')) {
            $('.section-buy-variants-menu a.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = $('.section-buy-variants-menu a').index(curItem);
            $('.section-buy-variants-item.active').removeClass('active');
            $('.section-buy-variants-item').eq(curIndex).addClass('active');
            $('.section-buy-list-inner.active').removeClass('active');
            $('.section-buy-list-inner').eq(curIndex).addClass('active');
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

    $('.hemorrhoids-how-menu a').click(function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('active')) {
            $('.hemorrhoids-how-menu a.active').removeClass('active');
            curLink.addClass('active');
            var curIndex = $('.hemorrhoids-how-menu a').index(curLink);
            $('.hemorrhoids-how-item.active').removeClass('active');
            $('.hemorrhoids-how-item').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('.disclaimer-close').click(function(e) {
        $('.disclaimer').fadeOut(function() {
            $('.disclaimer').remove();
        });
        e.preventDefault();
    });

    $('.page-link').click(function(e) {
        var curBlock = $(this.hash);
        if (curBlock.length == 1) {
            $('html, body').animate({'scrollTop': curBlock.offset().top - $('header').outerHeight() - 20});
            e.preventDefault();
        }
    });

    $('.varicose-about-text-more a').click(function(e) {
        $('.varicose-about-text').toggleClass('open');
        e.preventDefault();
    });

    $('.innotech-footer-text-more a').click(function(e) {
        $('.innotech-footer-text').toggleClass('open');
        e.preventDefault();
    });

    $('.experts-team-more a').click(function(e) {
        $('.experts-team-list').toggleClass('open');
        e.preventDefault();
    });

    $('.article-card-share-link a').click(function(e) {
        $('.article-card-share').toggleClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.article-card-share').length == 0) {
            $('.article-card-share').removeClass('open');
        }
    });

    function popupCenter(url, title) {
        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        var left = ((width / 2) - (480 / 2)) + dualScreenLeft;
        var top = ((height / 3) - (360 / 3)) + dualScreenTop;
        var newWindow = window.open(url, title, 'scrollbars=yes, width=' + 480 + ', height=' + 360 + ', top=' + top + ', left=' + left);
        if (window.focus) {
            newWindow.focus();
        }
    }

    $('body').on('click', '.share-link-vk', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('https://vk.com/share.php?url=' + curUrl + '&description=' + curTitle, curTitle);

        e.preventDefault();
    });

    $('body').on('click', '.share-link-whatsapp', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('https://api.whatsapp.com/send?text=' + curTitle + ': ' + curUrl, curTitle);

        e.preventDefault();
    });

    $('body').on('click', '.share-link-telegram', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('https://telegram.me/share/url?url=' + curUrl + '&text=' + curTitle, curTitle);

        e.preventDefault();
    });

    $('body').on('click', '.share-link-facebook', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('https://www.facebook.com/sharer/sharer.php?u=' + curUrl, curTitle);

        e.preventDefault();
    });

    $('body').on('click', '.window-expert-btn-no', function(e) {
        windowClose();
        if ($('.expert-window-link').length == 1 && typeof($('.expert-window-link').attr('data-url')) != 'undefined') {
            window.location = $('.expert-window-link').attr('data-url');
        }
        e.preventDefault();
    });

    $('body').on('click', '.window-expert-btn-yes', function(e) {
        $('.expert-link').addClass('visible');
        windowClose();
        e.preventDefault();
    });

    $('.expert-window-link').each(function(e) {
        $(this).trigger('click');
    });

    $('.gallery').each(function() {
        var curSlider = $(this);
        var thumbsSlider = null;
        if (curSlider.next().hasClass('gallery-preview')) {
            var thumbsSwiper = new Swiper(curSlider.next()[0], {
                slidesPerView: 'auto',
                freeMode: true
            });
            thumbsSlider = {
                swiper: thumbsSwiper
            };
            curSlider.next().find('.gallery-preview-item').eq(0).addClass('active');
        }

        const swiper = new Swiper(curSlider[0], {
            loop: true,
            touchAngle: 30,
            autoHeight: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            thumbs: thumbsSlider,
            on: {
                afterInit: function () {
                    var curSlide = curSlider.find('.swiper-slide-active');
                    var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
                    curSlider.find('.swiper-button-prev').css({'top': curPhotoHeight / 2});
                    curSlider.find('.swiper-button-next').css({'top': curPhotoHeight / 2});
                },
                slideChangeTransitionStart: function () {
                    if (thumbsSlider != null) {
                        curSlider.next().find('.gallery-preview-item.active').removeClass('active');
                        curSlider.next().find('.gallery-preview-item').eq(swiper.activeIndex).addClass('active');
                    }
                },
                slideChangeTransitionEnd: function () {
                    var curSlide = curSlider.find('.swiper-slide-active');
                    var curPhotoHeight = curSlide.find('.gallery-item-photo').outerHeight();
                    curSlider.find('.swiper-button-prev').css({'top': curPhotoHeight / 2});
                    curSlider.find('.swiper-button-next').css({'top': curPhotoHeight / 2});
                }
            }
        });
    });

    $('.content-table').each(function() {
        var curTable = $(this);
        if (curTable.find('thead').length == 1) {
            curTable.find('tbody tr').each(function() {
                var curRow = $(this);
                curRow.find('td').each(function() {
                    var curCell = $(this);
                    var curIndex = curRow.find('td').index(curCell);
                    curCell.prepend('<div class="content-table-title-mobile">' + curTable.find('th').eq(curIndex).html() + '</div>');
                });
            });
        }
    });

    $('.photos-list').each(function() {
        var curList = $(this);
        if (curList.find('.photos-item').length > 6) {
            curList.find('.photos-list-more').addClass('visible');
        }
    });

    $('.photos-list-more a').click(function(e) {
        $(this).parents().filter('.photos-list').toggleClass('open');
        e.preventDefault();
    });

    $('body').on('click', '[data-lightbox]', function(e) {
        var curItem = $(this);
        var curGroup = curItem.attr('data-lightbox');
        if (curGroup == '') {
            var curGallery = curItem;
        } else {
            var curGallery = $('[data-lightbox="' + curGroup + '"]');
        }
        var curIndex = curGallery.index(curItem);

        var curWidth = $(window).width();
        if (curWidth < 375) {
            curWidth = 375;
        }
        var curScroll = $(window).scrollTop();
        var curPadding = $('.wrapper').width();
        $('html').addClass('window-photo-open');
        $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});
        $('html').data('scrollTop', curScroll);
        $('.wrapper').css({'top': -curScroll});

        var windowHTML =    '<div class="window-photo">';

        windowHTML +=           '<div class="window-photo-preview swiper">' +
                                    '<div class="window-photo-preview-list swiper-wrapper">';

        var galleryLength = curGallery.length;

        for (var i = 0; i < galleryLength; i++) {
            var curGalleryItem = curGallery.eq(i);
            windowHTML +=               '<div class="window-photo-preview-list-item swiper-slide"><a href="#" style="background-image:url(' + curGalleryItem.find('img').attr('src') + ')"></a></div>';
        }
        windowHTML +=               '</div>' +
                                    '<div class="swiper-scrollbar"></div>' +
                                '</div>';

        windowHTML +=           '<div class="window-photo-slider swiper">' +
                                    '<div class="window-photo-slider-list swiper-wrapper">';

        for (var i = 0; i < galleryLength; i++) {
            var curGalleryItem = curGallery.eq(i);
            windowHTML +=               '<div class="window-photo-slider-list-item swiper-slide">' +
                                            '<div class="window-photo-slider-list-item-inner">' +
                                                '<div class="window-photo-slider-list-item-img"><img alt="" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZC0xIiB5Mj0iMSIgeDI9IjAiPgogICAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iNSUiIHN0b3AtY29sb3I9IiMwMEFFRUYiIHN0b3Atb3BhY2l0eT0iMC41IiAvPgogICAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAwQUVFRiIgc3RvcC1vcGFjaXR5PSIwLjAiIC8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQtMiIgeTI9IjEiIHgyPSIwIj4KICAgICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjUlIiBzdG9wLWNvbG9yPSIjMDBBRUVGIiBzdG9wLW9wYWNpdHk9IjAuMCIgLz4KICAgICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMEFFRUYiIHN0b3Atb3BhY2l0eT0iMS4wIiAvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZC0xKSIgLz4KICAgICAgICAgICAgICA8cmVjdCB4PSI1MCUiIHk9IjAiIHdpZHRoPSI1MCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkLTIpIiAvPgogICAgICAgIDwvcGF0dGVybj4KICAgIDwvZGVmcz4KCiAgICA8Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSIxMy43NSIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZT0idXJsKCNwYXR0ZXJuKSI+CiAgICAgICAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBkdXI9IjFzIiB2YWx1ZXM9IjAgMTUgMTU7MzYwIDE1IDE1IiBrZXlUaW1lcz0iMDsxIj48L2FuaW1hdGVUcmFuc2Zvcm0+CiAgICA8L2NpcmNsZT4KCiAgICA8ZWxsaXBzZSBjeD0iMTUiIGN5PSIyOC43NSIgcng9IjEuMjUiIHJ5PSIxLjI1IiBmaWxsPSIjMDBBRUVGIj4KICAgICAgICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGR1cj0iMXMiIHZhbHVlcz0iMCAxNSAxNTszNjAgMTUgMTUiIGtleVRpbWVzPSIwOzEiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KICAgIDwvZWxsaXBzZT4KPC9zdmc+" data-src="' + curGalleryItem.attr('href') + '" /></div>';
            if (typeof(curGalleryItem.attr('data-title')) != 'undefined') {
                windowHTML +=                   '<div class="window-photo-slider-list-item-text">' + curGalleryItem.attr('data-title') + '</div>';
            }
            windowHTML +=                   '</div>' +
                                        '</div>';
        }
        windowHTML +=               '</div>' +
                                    '<div class="swiper-button-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#slider-prev"></use></svg></div>' +
                                    '<div class="swiper-button-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#slider-next"></use></svg></div>' +
                                '</div>';

        windowHTML +=           '<a href="#" class="window-photo-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-close"></use></svg></a>';
        windowHTML +=           '<a href="#" class="window-photo-download" target="_blank" download><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-download"></use></svg></a>';

        windowHTML +=       '</div>';

        $('.window-photo').remove();
        $('body').append(windowHTML);
        $('.window-photo-preview-list-item').eq(curIndex).addClass('active');

        $('.window-photo-slider').each(function() {
            var curSlider = $(this);

            if ($(window).width() > 1199) {
                var thumbsSwiper = new Swiper('.window-photo-preview', {
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    freeMode: true,
                    scrollbar: {
                        el: '.swiper-scrollbar',
                    },
                    mousewheel: true
                });
            } else {
                var thumbsSwiper = new Swiper('.window-photo-preview', {
                    slidesPerView: 'auto',
                    freeMode: true,
                    watchSlidesProgress: true,
                    scrollbar: {
                        el: '.swiper-scrollbar',
                    }
                });
            }

            var swiper = new Swiper(curSlider[0], {
                loop: false,
                initialSlide: curIndex,
                touchAngle: 30,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                thumbs: {
                    swiper: thumbsSwiper,
                },
                on: {
                    afterInit: function () {
                        var currentSlide = $('.window-photo-slider-list .swiper-slide-active');

                        var curIMG = currentSlide.find('img');
                        $('.window-photo-download').attr('href', curIMG.attr('data-src'));
                        if (curIMG.attr('src') !== curIMG.attr('data-src')) {
                            var newIMG = $('<img src="" alt="" style="position:fixed; left:-9999px; top:-9999px" />');
                            $('body').append(newIMG);
                            newIMG.one('load', function(e) {
                                curIMG.attr('src', curIMG.attr('data-src'));
                                newIMG.remove();
                            });
                            newIMG.attr('src', curIMG.attr('data-src'));
                            window.setTimeout(function() {
                                curIMG.attr('src', curIMG.attr('data-src'));
                                if (newIMG) {
                                    newIMG.remove();
                                }
                            }, 3000);
                        }
                    },
                    slideChangeTransitionStart: function () {
                        var currentSlide = $('.window-photo-slider-list .swiper-slide-active');
                        if (typeof(swiper) != 'undefined') {
                            $('.window-photo-preview-list-item.active').removeClass('active');
                            $('.window-photo-preview-list-item').eq(swiper.activeIndex).addClass('active');
                        }

                        var curIMG = currentSlide.find('img');
                        $('.window-photo-download').attr('href', curIMG.attr('data-src'));
                    },
                    slideChangeTransitionEnd: function () {
                        var currentSlide = $('.window-photo-slider-list .swiper-slide-active');

                        var curIMG = currentSlide.find('img');
                        if (curIMG.attr('src') !== curIMG.attr('data-src')) {
                            var newIMG = $('<img src="" alt="" style="position:fixed; left:-9999px; top:-9999px" />');
                            $('body').append(newIMG);
                            newIMG.one('load', function(e) {
                                curIMG.attr('src', curIMG.attr('data-src'));
                                newIMG.remove();
                            });
                            newIMG.attr('src', curIMG.attr('data-src'));
                            window.setTimeout(function() {
                                curIMG.attr('src', curIMG.attr('data-src'));
                                if (newIMG) {
                                    newIMG.remove();
                                }
                            }, 3000);
                        }
                    }
                }
            });

            $('.window-photo-preview-list-item a').click(function(e) {
                var curItem = $(this).parent();
                if (!curItem.hasClass('active')) {
                    var curIndex = $('.window-photo-preview-list-item').index(curItem);
                    if (typeof(swiper) != 'undefined') {
                        swiper.slideTo(curIndex);
                    }
                }
                e.preventDefault();
            });
        });

        e.preventDefault();
    });

    $('body').on('click', '.window-photo-close', function(e) {
        $('.window-photo').remove();
        $('html').removeClass('window-photo-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $('meta[name="viewport"]').attr('content', 'width=device-width');
        $(window).scrollTop($('html').data('scrollTop'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            if ($('.window-photo').length > 0) {
                $('.window-photo-close').trigger('click');
            }
        }
    });

});

$(window).on('load', function() {
    if (window.location.hash != '') {
        var curBlock = $(window.location.hash);
        if (curBlock.length == 1) {
            $('html, body').animate({'scrollTop': curBlock.offset().top - $('header').outerHeight() - 20});
        }
    }
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

var hemorrhoidsAboutSwiper = null;
var articlesSwiper = null;

$(window).on('load resize', function() {

    $('.hemorrhoids-about-list').each(function() {
        var curSlider = $(this);
        if (curSlider.hasClass('swiper-initialized')) {
            hemorrhoidsAboutSwiper.destroy();
        }
        if ($(window).width() < 1200) {
            hemorrhoidsAboutSwiper = new Swiper(curSlider[0], {
                touchAngle: 30,
                autoHeight: true,
                pagination: {
                    el: $('.hemorrhoids-about-list-ctrl .swiper-pagination')[0],
                    type: 'fraction',
                },
                navigation: {
                    nextEl: $('.hemorrhoids-about-list-ctrl .swiper-button-next')[0],
                    prevEl: $('.hemorrhoids-about-list-ctrl .swiper-button-prev')[0],
                },
            });
        } else {
            hemorrhoidsAboutSwiper = new Swiper(curSlider[0], {
                touchAngle: 30,
                autoHeight: true,
                slidesPerView: 2,
                pagination: {
                    el: $('.hemorrhoids-about-list-ctrl .swiper-pagination')[0],
                    clickable: true,
                },
                navigation: {
                    nextEl: $('.hemorrhoids-about-list-ctrl .swiper-button-next')[0],
                    prevEl: $('.hemorrhoids-about-list-ctrl .swiper-button-prev')[0],
                },
            });
        }
    });

    $('.section-articles-list.swiper').each(function() {
        var curSlider = $(this);
        if ($(window).width() < 1200) {
            if (!curSlider.hasClass('swiper-initialized')) {
                articlesSwiper = new Swiper(curSlider[0], {
                    touchAngle: 30,
                    autoHeight: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
            }
        } else {
            if (curSlider.hasClass('swiper-initialized')) {
                articlesSwiper.destroy();
            }
        }
    });

});

function initForm(curForm) {
    curForm.find('input.phoneRU').attr('autocomplete', 'off');
    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');

    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        }
    });

    curForm.find('.form-input input, .form-input textarea').focus(function() {
        $(this).parent().addClass('focus');
    });

    curForm.find('.form-input input, .form-input textarea').blur(function(e) {
        $(this).parent().removeClass('focus');
        if ($(this).val() == '') {
            $(this).parent().removeClass('full');
        } else {
            $(this).parent().addClass('full');
        }
    });

    curForm.find('.form-input textarea').each(function() {
        $(this).css({'height': this.scrollHeight, 'overflow-y': 'hidden'});
        $(this).on('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    curForm.find('input[autofocus]').trigger('focus');

    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        var options = {
            minimumResultsForSearch: 10,
            closeOnSelect: false
        };
        if (typeof(curSelect.attr('data-searchplaceholder')) != 'undefined') {
            options['searchInputPlaceholder'] = curSelect.attr('data-searchplaceholder');
        }
        curSelect.select2(options);
        curSelect.parent().find('.select2-container').attr('data-placeholder', curSelect.attr('data-placeholder'));
        curSelect.parent().find('.select2-selection__rendered').attr('data-placeholder', curSelect.attr('data-placeholder'));
        curSelect.on('select2:select', function(e) {
            $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full');
            $(e.delegateTarget).parent().find('.select2-search--inline input').val('').trigger('input.search').trigger('focus');
            $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', curSelect.attr('data-searchplaceholder'));
        });
        curSelect.on('select2:unselect', function(e) {
            if (curSelect.find('option:selected').length == 0) {
                $(e.delegateTarget).parent().find('.select2-container').removeClass('select2-container--full');
                $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', curSelect.attr('data-placeholder'));
            } else {
                $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', curSelect.attr('data-searchplaceholder'));
            }
        });
        curSelect.on('select2:close', function(e) {
            if (curSelect.find('option:selected').length == 0) {
                $(e.delegateTarget).parent().find('.select2-container').removeClass('select2-container--full');
                $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', curSelect.attr('data-placeholder'));
            }
        });
        if (typeof(curSelect.attr('multiple')) != 'undefined') {
            curSelect.on('select2:open', function(e) {
                $(e.delegateTarget).parent().find('.select2-container').addClass('select2-container--full');
                $(e.delegateTarget).parent().find('.select2-search--inline input').attr('placeholder', '');
            });
        }
        if (curSelect.find('option:selected').length > 0 && curSelect.find('option:selected').html() != '') {
            curSelect.trigger({type: 'select2:select'})
        }
    });

    curForm.find('.captcha-container').each(function() {
        if ($('script#smartCaptchaScript').length == 0) {
            $('body').append('<script src="https://captcha-api.yandex.ru/captcha.js?render=onload&onload=smartCaptchaLoad" defer id="smartCaptchaScript"></script>');
        } else {
            if (window.smartCaptcha) {
                var curID = window.smartCaptcha.render(this, {
                    sitekey: smartCaptchaKey,
                    callback: smartCaptchaCallback,
                    invisible: true,
                    hideShield: true,
                    hl: 'ru'
                });
                $(this).attr('data-smartid', curID);
            }
        }
    });

    curForm.find('.form-files').each(function() {
        var curFiles = $(this);
        var curInput = curFiles.find('.form-files-input input');

        var uploadURL = curInput.attr('data-uploadurl');
        var uploadFiles = curInput.attr('data-uploadfiles');
        var removeURL = curInput.attr('data-removeurl');
        curInput.fileupload({
            url: uploadURL,
            dataType: 'json',
            dropZone: curFiles.find('.form-files-dropzone'),
            pasteZone: curFiles.find('.form-files-dropzone'),
            add: function(e, data) {
                if (typeof curInput.attr('multiple') !== 'undefined') {
                    curFiles.find('.form-files-list').append('<div class="form-files-list-item-progress"><span class="form-files-list-item-cancel"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></span></div>');
                } else {
                    curFiles.find('.form-files-list').html('<div class="form-files-list-item-progress"><span class="form-files-list-item-cancel"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></span></div>');
                }
                data.submit();
                curFiles.addClass('full');
            },
            done: function (e, data) {
                curFiles.find('.form-files-list-item-progress').eq(0).remove();
                if (data.result.status == 'success') {
                    if (typeof curInput.attr('multiple') !== 'undefined') {
                        curFiles.find('.form-files-list').append('<div class="form-files-list-item"><div class="form-files-list-item-icon"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#icon-doc"></use></svg></div><div class="form-files-list-item-name"><a href="' + data.result.url + '" download>' + data.result.path + '</a></div><div class="form-files-list-item-size">' + Number(data.result.size).toFixed(2) + ' Мб</div><a href="' + removeURL + '?file=' + data.result.path + '" class="form-files-list-item-remove"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></a></div>');
                    } else {
                        curFiles.find('.form-files-list').html('<div class="form-files-list-item"><div class="form-files-list-item-icon"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#icon-doc"></use></svg></div><div class="form-files-list-item-name"><a href="' + data.result.url + '" download>' + data.result.path + '</a></div><div class="form-files-list-item-size">' + Number(data.result.size).toFixed(2) + ' Мб</div><a href="' + removeURL + '?file=' + data.result.path + '" class="form-files-list-item-remove"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></a></div>');
                    }
                    curFiles.find('.files-required').val('true');
                    curFiles.find('label.error').remove();
                } else {
                    if (typeof curInput.attr('multiple') !== 'undefined') {
                        curFiles.find('.form-files-list').append('<div class="form-files-list-item error"><div class="form-files-list-item-icon"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#icon-doc"></use></svg></div><div class="form-files-list-item-name">' + data.result.text + '</div><a href="' + removeURL + '?file=' + data.result.path + '" class="form-files-list-item-remove"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></a></div>');
                    } else {
                        curFiles.find('.form-files-list').html('<div class="form-files-list-item error"><div class="form-files-list-item-icon"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#icon-doc"></use></svg></div><div class="form-files-list-item-name">' + data.result.text + '</div><a href="' + removeURL + '?file=' + data.result.path + '" class="form-files-list-item-remove"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></a></div>');
                    }
                }
                curFiles.addClass('full');
            }
        });
    });

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);

            var smartCaptchaWaiting = false;
            curForm.find('.captcha-container').each(function() {
                if (curForm.attr('form-smartcaptchawaiting') != 'true') {
                    var curBlock = $(this);
                    var curInput = curBlock.find('input[name="smart-token"]');
                    curInput.removeAttr('value');
                    smartCaptchaWaiting = true;
                    $('form[form-smartcaptchawaiting]').removeAttr('form-smartcaptchawaiting');
                    curForm.attr('form-smartcaptchawaiting', 'false');

                    if (!window.smartCaptcha) {
                        alert('Сервис временно недоступен, попробуйте позже.');
                        return;
                    }
                    var curID = $(this).attr('data-smartid');
                    window.smartCaptcha.execute(curID);
                } else {
                    curForm.removeAttr('form-smartcaptchawaiting');
                }
            });

            if (!smartCaptchaWaiting) {

                if (curForm.hasClass('ajax-form')) {
                    curForm.addClass('loading');
                    var formData = new FormData(form);

                    $.ajax({
                        type: 'POST',
                        url: curForm.attr('action'),
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        data: formData,
                        cache: false
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        curForm.find('.message').remove();
                        curForm.append('<div class="message message-error">Сервис временно недоступен, попробуйте позже.</div>')
                        curForm.removeClass('loading');
                    }).done(function(data) {
                        curForm.find('.message').remove();
                        if (data.status) {
                            curForm.html('<div class="message message-success">' + data.message + '</div>')
                        } else {
                            curForm.prepend('<div class="message message-error">' + data.message + '</div>')
                        }
                        curForm.removeClass('loading');
                    });
                } else {
                    form.submit();
                }
            }
        }
    });
}

var smartCaptchaKey = 'uahGSHTKJqjaJ0ezlhjrbOYH4OxS6zzL9CZ47OgY';

function smartCaptchaLoad() {
    $('.captcha-container').each(function() {
        if (!window.smartCaptcha) {
            return;
        }
        var curID = window.smartCaptcha.render(this, {
            sitekey: smartCaptchaKey,
            callback: smartCaptchaCallback,
            invisible: true,
            hideShield: true
        });
        $(this).attr('data-smartid', curID);
    });
}

function smartCaptchaCallback(token) {
    $('form[form-smartcaptchawaiting]').attr('form-smartcaptchawaiting', 'true');
    $('form[form-smartcaptchawaiting] [type="submit"]').trigger('click');
}

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length == 0) {
        var curWidth = $(window).width();
        if (curWidth < 375) {
            curWidth = 375;
        }
        var curScroll = $(window).scrollTop();
        var curPadding = $('.wrapper').width();
        $('html').addClass('window-open');
        $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});
        $('html').data('scrollTop', curScroll);
        $('.wrapper').css({'top': -curScroll});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
    } else {
        $('.window').append('<div class="window-loading"></div>')
        $('.window-container').addClass('window-container-preload');
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window-container').length == 0) {
            $('.window').html('<div class="window-container window-container-preload">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div>');
        } else {
            $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a>');
            $('.window .window-loading').remove();
        }

        window.setTimeout(function() {
            $('.window-container-preload').removeClass('window-container-preload');
        }, 100);

        $('.window form').each(function() {
            initForm($(this));
        });
    });
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $('meta[name="viewport"]').attr('content', 'width=device-width');
        $(window).scrollTop($('html').data('scrollTop'));
    }
}