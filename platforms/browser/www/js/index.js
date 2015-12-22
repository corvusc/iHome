var SPEECH_OPENING = "Otwieram",
    SPEECH_CLOSING = "Zamykam",
    SPEECH_BLIND = "roletê",
    SPEECH_BLINDS = "rolety",
    SPEECH_ROOF_WINDOW = "okno po³aciowe",
    SPEECH_ROOF_WINDOWS = "okna po³aciowe",
    SPEECH_FROM = "od",
    SPEECH_TO = "do";

var ID_MIN,
    ID_MAX,
    OPEN = 0,
    CLOSE = 1,
    ROOF_WINDOW = 10,
    BLIND = 20;

var socket;

var app = {
        initialize: function () {
            this.bindEvents();
        },

        bindEvents: function () {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },

        onDeviceReady: function () {
            app.initSocket();
            app.initApp();
        },

        initSocket: function () {
            socket = new Socket();
            socket.onData = function (data) {
                // invoked after new batch of data is received (typed array of bytes Uint8Array)
            };
            socket.onError = function (errorMessage) {
                // invoked after error occurs during connection
            };
            socket.onClose = function (hasError) {
                // invoked after connection close
            };
        },

        initApp: function () {
            $.getJSON("json/data.json", function (response) {
                response.blinds.map(function (blind) {
                    if (!blind.max || blind.max == blind.min) {
                        blind.max = blind.min;
                        blind.number = blind.min;
                    } else {
                        blind.number = blind.min + '-' + blind.max;
                    }
                    var blindElement = $('<li><div class="blind"><div class="header" data-id-min="' + blind.min + '" data-id-max="' + blind.max + '"> <span class="ion-pound"></span> ' + blind.number + '</div><span><i>' + blind.name + '</i></span></div></li>')
                    $('.blinds-list').append(blindElement);
                });

                response.roofWindows.map(function (roofWindow) {
                    if (!roofWindow.max || roofWindow.max == roofWindow.min) {
                        roofWindow.max = roofWindow.min;
                        roofWindow.number = roofWindow.min;
                    } else {
                        roofWindow.number = roofWindow.min + '-' + roofWindow.max;
                    }
                    var roofWindowElement = $('<li><div class="roof-window"><div class="header" data-id-min="' + roofWindow.min + '" data-id-max="' + roofWindow.max + '"> <span class="ion-pound"></span> ' + roofWindow.number + '</div><span><i>' + roofWindow.name + '</i></span></div></li>')
                    $('.roof-windows-list').append(roofWindowElement);
                });

                response.cameras.map(function (camera) {
                    if (camera.type == 1) {
                        camera.type = "profile=15&resolution=320x180";
                    } else {
                        camera.type = "profile=10&resolution=qvga";
                    }
                    var cameraElement = $('<li><div class="camera"><img src="http://' + camera.url + '/video.cgi?' + camera.type + '"><span>' + camera.name + '</span></div></li>')
                    $('.cameras-list').append(cameraElement);
                });

                response.users.map(function(user, index) {
                    var userElement = $('<option value="' + index +'">' + user.name + '</option>');
                    $('.user-selection').append(userElement);
                });

                $('.user-list').owlCarousel({
                    loop: true,
                    items: 7,
                    itemsDesktop: [1199, 6],
                    itemsDesktopSmall: [979, 5],
                    itemsTablet: [768, 4],
                    itemsMobile: [479, 3],
                    scrollPerPage: true
                });

                $('.blinds-list').owlCarousel({
                    loop: true,
                    items: 7,
                    itemsDesktop: [1199, 6],
                    itemsDesktopSmall: [979, 5],
                    itemsTablet: [768, 4],
                    itemsMobile: [479, 3],
                    scrollPerPage: true
                });

                $('.roof-windows-list').owlCarousel({
                    loop: true,
                    items: 7,
                    itemsDesktop: [1199, 6],
                    itemsDesktopSmall: [979, 5],
                    itemsTablet: [768, 4],
                    itemsMobile: [479, 3],
                    scrollPerPage: true
                });

                $('.cameras-list').owlCarousel({
                    loop: true,
                    items: 4,
                    itemsDesktop: [1199, 4],
                    itemsDesktopSmall: [979, 3],
                    itemsTablet: [768, 2],
                    itemsMobile: [479, 1]
                });

                $('.speech-disabled').prop('checked', localStorage.speechDisabled == 'true');

                $('.speech-disabled').on('change', function(e){
                    localStorage.speechDisabled = $(e.currentTarget).prop('checked');
                });

                $('.user-selection').on('change', function(e){
                    localStorage.user = $(e.currentTarget).val();
                    var user = response.users[$(e.currentTarget).val()];
                    $('.user-list').data('owlCarousel').destroy();
                    $('.user-list').html('');

                    if(user.blinds){
                        user.blinds.map(function (blind) {
                            if (!blind.max || blind.max == blind.min) {
                                blind.max = blind.min;
                                blind.number = blind.min;
                            } else {
                                blind.number = blind.min + '-' + blind.max;
                            }
                            var blindElement = $('<li><div class="blind"><div class="header" data-id-min="' + blind.min + '" data-id-max="' + blind.max + '"> <span class="ion-pound"></span> ' + blind.number + '</div><span><i>' + blind.name + '</i></span></div></li>')
                            $('.user-list').append(blindElement);
                        });
                    }

                    if(user.roofWindows){
                        user.roofWindows.map(function (roofWindow) {
                            if (!roofWindow.max || roofWindow.max == roofWindow.min) {
                                roofWindow.max = roofWindow.min;
                                roofWindow.number = roofWindow.min;
                            } else {
                                roofWindow.number = roofWindow.min + '-' + roofWindow.max;
                            }
                            var roofWindowElement = $('<li><div class="roof-window"><div class="header" data-id-min="' + roofWindow.min + '" data-id-max="' + roofWindow.max + '"> <span class="ion-pound"></span> ' + roofWindow.number + '</div><span><i>' + roofWindow.name + '</i></span></div></li>')
                            $('.user-list').append(roofWindowElement);
                        });
                    }

                    $('.user-list').owlCarousel({
                        loop: true,
                        items: 7,
                        itemsDesktop: [1199, 6],
                        itemsDesktopSmall: [979, 5],
                        itemsTablet: [768, 4],
                        itemsMobile: [479, 3]
                    });

                    $('header .user span:first-child').html(user.name);
                    $('header .user span:last-child').removeClass().addClass('image').addClass('user-' + $(e.currentTarget).val());
                    $('.side-menu').animate({
                        left: "-70%"
                    }, 500);
                    $('.overlay').hide();

                    $('.blind .header').on('click', app._handleBlindHeaderClick);
                    $('.roof-window .header').on('click', app._handleRoofWindowHeaderClick);
                });

                if (localStorage.user) {
                    $('.user-selection').val(localStorage.user).change();
                } else {
                    alert("Witaj. Wybierz proszê swoje imiê z listy po lewej stronie.");
                    $('.side-menu').animate({
                        left: 0
                    }, 500);
                    $('.overlay').show();
                }

                $('.open-side-menu').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $('.side-menu').animate({
                        left: 0
                    }, 500);
                    $('.overlay').show();
                });

                $('.blind .header').unbind('click').on('click', app._handleBlindHeaderClick);
                $('.roof-window .header').unbind('click').on('click', app._handleRoofWindowHeaderClick);

                $('.bottom-menu .blinds .open').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    app.sendData([BLIND, ID_MIN, ID_MAX, OPEN]);
                    $('.blind .header[data-id-min="' + ID_MIN + '"][data-id-max="' + ID_MAX + '"]').removeClass('opened').addClass('closed');
                    for (var i = ID_MIN; i <= ID_MAX; i++) {
                        $('.blind .header[data-id-min="' + i + '"][data-id-max="' + i + '"]').removeClass('opened').addClass('closed');
                    }
                    $('.bottom-menu').slideToggle(function () {
                        $('.bottom-menu .roof-windows').hide();
                        $('.bottom-menu .blinds').hide();
                    });
                    $('.overlay').hide();

                    var string = SPEECH_OPENING;
                    if (ID_MIN != ID_MAX) {
                        string += " " + SPEECH_BLINDS + " " + SPEECH_FROM + " " + ID_MIN + " " + SPEECH_TO + " " + ID_MAX;
                    } else {
                        string += " " + SPEECH_BLIND + " " +  ID_MIN;
                    }
                    app.speak(string);
                });

                $('.bottom-menu .blinds .close').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    app.sendData([BLIND, ID_MIN, ID_MAX, CLOSE]);
                    $('.blind .header[data-id-min="' + ID_MIN + '"][data-id-max="' + ID_MAX + '"]').removeClass('closed').addClass('opened');
                    for (var i = ID_MIN; i <= ID_MAX; i++) {
                        $('.blind .header[data-id-min="' + i + '"][data-id-max="' + i + '"]').removeClass('closed').addClass('opened');
                    }
                    $('.bottom-menu').slideToggle(function () {
                        $('.bottom-menu .roof-windows').hide();
                        $('.bottom-menu .blinds').hide();
                    });
                    $('.overlay').hide();

                    var string = SPEECH_CLOSING;
                    if (ID_MIN != ID_MAX) {
                        string += " " + SPEECH_BLINDS + " " + SPEECH_FROM + " " + ID_MIN + " " + SPEECH_TO + " " + ID_MAX;
                    } else {
                        string += " " + SPEECH_BLIND + " " +  ID_MIN;
                    }
                    app.speak(string);
                });

                $('.bottom-menu .roof-windows .open').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    app.sendData([ROOF_WINDOW, ID_MIN, ID_MAX, OPEN]);
                    $('.roof-window .header[data-id-min="' + ID_MIN + '"][data-id-max="' + ID_MAX + '"]').removeClass('opened').addClass('closed');
                    for (var i = ID_MIN; i <= ID_MAX; i++) {
                        $('.roof-window .header[data-id-min="' + i + '"][data-id-max="' + i + '"]').removeClass('opened').addClass('closed');
                    }
                    $('.bottom-menu').slideToggle(function () {
                        $('.bottom-menu .roof-windows').hide();
                        $('.bottom-menu .blinds').hide();
                    });
                    $('.overlay').hide();

                    var string = SPEECH_OPENING;
                    if (ID_MIN != ID_MAX) {
                        string += " " + SPEECH_ROOF_WINDOWS + " " + SPEECH_FROM + " " + ID_MIN + " " + SPEECH_TO + " " + ID_MAX;
                    } else {
                        string += " " + SPEECH_ROOF_WINDOW + " " +  ID_MIN;
                    }
                    app.speak(string);
                });

                $('.bottom-menu .roof-windows .close').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    app.sendData([ROOF_WINDOW, ID_MIN, ID_MAX, CLOSE]);
                    $('.roof-window .header[data-id-min="' + ID_MIN + '"][data-id-max="' + ID_MAX + '"]').removeClass('closed').addClass('opened');
                    for (var i = ID_MIN; i <= ID_MAX; i++) {
                        $('.roof-window .header[data-id-min="' + i + '"][data-id-max="' + i + '"]').removeClass('closed').addClass('opened');
                    }
                    $('.bottom-menu').slideToggle(function () {
                        $('.bottom-menu .roof-windows').hide();
                        $('.bottom-menu .blinds').hide();
                    });
                    $('.overlay').hide();

                    var string = SPEECH_CLOSING;
                    if (ID_MIN != ID_MAX) {
                        string += " " + SPEECH_ROOF_WINDOWS + " " + SPEECH_FROM + " " + ID_MIN + " " + SPEECH_TO + " " + ID_MAX;
                    } else {
                        string += " " + SPEECH_ROOF_WINDOW + " " +  ID_MIN;
                    }
                    app.speak(string);
                });
            });

            $('.bottom-menu .roof-windows').hide();
            $('.bottom-menu .blinds').hide();
            $('.bottom-menu').hide();
            $('.overlay').hide();

            $('.overlay').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if($('.bottom-menu').is(":visible")){
                    $('.bottom-menu').slideToggle(function () {
                        $('.bottom-menu .roof-windows').hide();
                        $('.bottom-menu .blinds').hide();
                    });
                } else {
                    $('.side-menu').animate({
                        left: "-70%"
                    }, 500);
                }
                $(e.currentTarget).hide();
            });
        },

        sendData: function (data) {
            if (!socket) {
                app.initSocket();
            }
            socket.open(
                "home.pikaxon.pl",
                2501,
                function () {
                    socket.write(
                        data,
                        function () {

                        },
                        function (errorMessage) {
                            alert(errorMessage);
                        });
                },
                function (errorMessage) {
                    alert(errorMessage);

                });
        },

        speak: function (string) {
            if(!$('.speech-disabled').prop('checked')){
                TTS.speak({
                    text: string,
                    locale: 'pl-PL',
                    rate: 1
                });
            }

        },

    _handleBlindHeaderClick: function(e){
        e.preventDefault();
        e.stopPropagation();
        ID_MIN = $(e.currentTarget).attr('data-id-min');
        ID_MAX = $(e.currentTarget).attr('data-id-max');
        $('.bottom-menu .blinds').show();
        $('.bottom-menu').slideToggle();
        $('.overlay').show();
    },

    _handleRoofWindowHeaderClick: function(e){
        e.preventDefault();
        e.stopPropagation();
        ID_MIN = $(e.currentTarget).attr('data-id-min');
        ID_MAX = $(e.currentTarget).attr('data-id-max');
        $('.bottom-menu .roof-windows').show();
        $('.bottom-menu').slideToggle();
        $('.overlay').show();
    }

    };

app.initialize();