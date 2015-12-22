var ID_MIN,
    ID_MAX,
    OPEN = 0,
    CLOSE = 1,
    ROOF_WINDOW = 10,
    BLIND = 20;

var socket,
    app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.initSocket();
        app.initApp();
    },

    initSocket: function() {
        socket = new Socket();
        socket.onData = function(data) {
            // invoked after new batch of data is received (typed array of bytes Uint8Array)
        };
        socket.onError = function(errorMessage) {
            // invoked after error occurs during connection
        };
        socket.onClose = function(hasError) {
            // invoked after connection close
        };
    },

    initApp: function() {
        $.getJSON( "json/data.json", function(response){
            response.blinds.map(function(blind){
                if(!blind.max) {
                    blind.max = blind.min;
                    blind.number = blind.min;
                } else {
                    blind.number = blind.min + '-' + blind.max;
                }
                var blindElement = $('<li><div class="blind"><div class="header" data-id-min="' + blind.min + '" data-id-max="' + blind.max + '"> <span class="ion-pound"></span> ' + blind.number + '</div><span><i>' + blind.name + '</i></span></div></li>')
                $('.blinds-list').append(blindElement);
            });

            response.roofWindows.map(function(roofWindow){
                if(!roofWindow.max) {
                    roofWindow.max = roofWindow.min;
                    roofWindow.number = roofWindow.min;
                } else {
                    roofWindow.number = roofWindow.min + '-' + roofWindow.max;
                }
                var roofWindowElement = $('<li><div class="roof-window"><div class="header" data-id-min="' + roofWindow.min + '" data-id-max="' + roofWindow.max + '"> <span class="ion-pound"></span> ' + roofWindow.number + '</div><span><i>' + roofWindow.name + '</i></span></div></li>')
                $('.roof-windows-list').append(roofWindowElement);
            });

            response.cameras.map(function(camera){
                if (camera.type == 1) {
                    camera.type = "profile=15&resolution=320x180";
                } else {
                    camera.type = "profile=10&resolution=qvga";
                }
                var cameraElement = $('<li><div class="camera"><img src="http://' + camera.url + '/video.cgi?' + camera.type + '"><span>' + camera.name + '</span></div></li>')
                $('.cameras-list').append(cameraElement);
            });

            $('.blinds-list').owlCarousel({
                loop: true,
                items: 7,
                itemsDesktop: [1199,6],
                itemsDesktopSmall: [979,5],
                itemsTablet: [768,4],
                itemsMobile: [479,3],
                scrollPerPage: true
            });

            $('.roof-windows-list').owlCarousel({
                loop: true,
                items: 7,
                itemsDesktop: [1199,6],
                itemsDesktopSmall: [979,5],
                itemsTablet: [768,4],
                itemsMobile: [479,3],
                scrollPerPage: true
            });

            $('.cameras-list').owlCarousel({
                loop: true,
                items: 4,
                itemsDesktop: [1199,4],
                itemsDesktopSmall: [979,3],
                itemsTablet: [768,2],
                itemsMobile: [479,1],
                scrollPerPage: true
            });

            $('.blind .header').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                ID_MIN = $(e.currentTarget).attr('data-id-min');
                ID_MAX = $(e.currentTarget).attr('data-id-max');
                $('.bottom-menu .blinds').show();
                $('.bottom-menu').slideToggle();
                $('.overlay').show();
            });

            $('.roof-window .header').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                ID_MIN = $(e.currentTarget).attr('data-id-min');
                ID_MAX = $(e.currentTarget).attr('data-id-max');
                $('.bottom-menu .roof-windows').show();
                $('.bottom-menu').slideToggle();
                $('.overlay').show();
            });

            $('.bottom-menu .blinds .open').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                app.sendData([BLIND, ID_MIN, ID_MAX, OPEN]);
                $('.blind .header[data-id-min="' + ID_MIN + '"][data-id-max="' + ID_MAX + '"]').removeClass('opened').addClass('closed');
                for(var i = ID_MIN; i <= ID_MAX; i++){
                    $('.blind .header[data-id-min="' + i + '"][data-id-max="' + i + '"]').removeClass('opened').addClass('closed');
                }
                $('.bottom-menu').slideToggle(function(){
                    $('.bottom-menu .roof-windows').hide();
                    $('.bottom-menu .blinds').hide();
                });
                $('.overlay').hide();
            });

            $('.bottom-menu .blinds .close').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                app.sendData([BLIND, ID_MIN, ID_MAX, CLOSE]);
                $('.blind .header[data-id-min="' + ID_MIN + '"][data-id-max="' + ID_MAX + '"]').removeClass('closed').addClass('opened');
                for(var i = ID_MIN; i <= ID_MAX; i++){
                    $('.blind .header[data-id-min="' + i + '"][data-id-max="' + i + '"]').removeClass('closed').addClass('opened');
                }
                $('.bottom-menu').slideToggle(function(){
                    $('.bottom-menu .roof-windows').hide();
                    $('.bottom-menu .blinds').hide();
                });
                $('.overlay').hide();
            });

            $('.bottom-menu .roof-windows .open').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                app.sendData([ROOF_WINDOW, ID_MIN, ID_MAX, OPEN]);
                $('.roof-window .header[data-id-min="' + ID_MIN + '"][data-id-max="' + ID_MAX + '"]').removeClass('opened').addClass('closed');
                for(var i = ID_MIN; i <= ID_MAX; i++){
                    $('.roof-window .header[data-id-min="' + i + '"][data-id-max="' + i + '"]').removeClass('opened').addClass('closed');
                }
                $('.bottom-menu').slideToggle(function(){
                    $('.bottom-menu .roof-windows').hide();
                    $('.bottom-menu .blinds').hide();
                });
                $('.overlay').hide();
            });

            $('.bottom-menu .roof-windows .close').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                app.sendData([ROOF_WINDOW, ID_MIN, ID_MAX, CLOSE]);
                $('.roof-window .header[data-id-min="' + ID_MIN + '"][data-id-max="' + ID_MAX + '"]').removeClass('closed').addClass('opened');
                for(var i = ID_MIN; i <= ID_MAX; i++){
                    $('.roof-window .header[data-id-min="' + i + '"][data-id-max="' + i + '"]').removeClass('closed').addClass('opened');
                }
                $('.bottom-menu').slideToggle(function(){
                    $('.bottom-menu .roof-windows').hide();
                    $('.bottom-menu .blinds').hide();
                });
                $('.overlay').hide();
            });
        });

        $('.bottom-menu .roof-windows').hide();
        $('.bottom-menu .blinds').hide();
        $('.bottom-menu').hide();
        $('.overlay').hide();

        $('.overlay').on('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            $('.bottom-menu').slideToggle(function(){
                $('.bottom-menu .roof-windows').hide();
                $('.bottom-menu .blinds').hide();
            });
            $(e.currentTarget).hide();
        });
    },

    sendData: function(data) {
        if (!socket) {
            app.initSocket();
        }
        socket.open(
            "home.pikaxon.pl",
            2501,
            function() {
                socket.write(
                    data,
                    function() {

                    },
                    function(errorMessage) {
                        alert(errorMessage);
                    });
            },
            function(errorMessage) {
                alert(errorMessage);

            });
    }
};

app.initialize();