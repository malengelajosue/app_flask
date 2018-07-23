/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



$(document).ready(function () {
    $('.ui-pnotify').remove();
    var map;
    var lat, long, alt, tm, speed, sat, course, marker, ws, infowindow;
    var siteName, captureType, comment, btnCaptureModal, txtComment, 
    cbxCaptureType, txtSiteName, btnStopCaptureModal, chkbox, 
    persitInterval, btnLaunchModal,btnFullScreen;
    var myLongitude, myLatitude;
    //Enregisrement
    var messageToSendPersist, persistNow = false, stopPersistNow = false;
    myLatitude = -11.673898;
    myLongitude = 27.478447;
    myAltitude = '1325.8M';
    initialise = false;
    marker = null;
    function makeInfo() {
        var contentString = '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<h5 id="firstHeading" class="firstHeading">Position information</h5>' +
                '<hr>' +
                '<div id="bodyContent">' +
                '<b>Lat:</b>' + myLatitude +
                '<br><b>Long:</b>' + myLongitude +
                '<br><b>Alt:</b>' + 11.566666 +
                '</div>' +
                '</div>';
        //info
        infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        
    }
    function makeMarker() {
        if (marker === null) {
            marker = new google.maps.Marker({
                position: {lat: myLatitude, lng: myLongitude},
                map: map,
                title: 'The drone location!',
                animation: google.maps.Animation.BOUNCE,
            });
            makeInfo();
        } else {

            marker.setMap(null);
            marker = null;
            infowindow.close();
            makeMarker();
        }


    }
    function initMap() {
        //enabling new cartography and theme

        google.maps.visualRefresh = true;
        var myLatLng = {lat: myLatitude, lng: myLongitude};
        //seting start options of map
        var mapTypeIds = ["roadmap", "satellite", "hybrid", "terrain", "OSM"];
        var mapOptions = {
            center: new google.maps.LatLng(myLatitude, myLongitude),
            zoom: 15,
            mapTypeId: 'OSM',
            mapTypeControlOptions: {
                mapTypeIds: mapTypeIds,
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            scaleControl: true,
            rotateControl: true,
            streetViewControl: true,
        };
        //Getting map DOM element
        var mapElement = document.getElementById('map');
        //creating a map with DOM element
        map = new google.maps.Map(mapElement, mapOptions);
        //open

        map.mapTypes.set("OSM", new google.maps.ImageMapType({
            getTileUrl: function (coord, zoom) {
                // "Wrap" x (logitude) at 180th meridian properly
                // NB: Don't touch coord.x because coord param is by reference, and changing its x property breakes something in Google's lib 
                var tilesPerGlobe = 1 << zoom;
                var x = coord.x % tilesPerGlobe;
                if (x < 0) {
                    x = tilesPerGlobe + x;
                }
                // Wrap y (latitude) in a like manner if you want to enable vertical infinite scroll

                return "http://tile.openstreetmap.org/" + zoom + "/" + x + "/" + coord.y + ".png";
            },
            tileSize: new google.maps.Size(256, 256),
            name: "OpenStreetMap",
            maxZoom: 18
        }
        ));
//make marker
       
    }
    ;

//url of websocket server

    ws = new ReconnectingWebSocket("ws://localhost:8001/ws");
    //on open a connexion
    ws.onopen = function (evt) {
        $('#connexion_status').html('Connected');

        new PNotify({
            title: 'Regular Success',
            text: 'Connection etablie avec succes!',
            type: 'success',
            styling: 'bootstrap3'
        });
        getData();

    };
    //on close a connexion
    ws.onclose = function (evt) {
        $('#connexion_status').html('Disconnected');
        new PNotify({
            title: 'Perte de connection au serveur!',
            text: 'Veuillez actualiser la page SVP.',
            type: 'error',
            styling: 'bootstrap3'
        });

    };
    //on receiving a message 
    ws.onmessage = function (evt) {

        var data = evt.data;
        console.log('message recu: ' + data);
        data = JSON.parse(data);
        if (!isNaN( parseFloat(data.Long))) {
            myLongitude =  parseFloat(data.Long);
        }
        if (!isNaN(parseFloat(data.Lat))) {
            myLatitude = parseFloat(data.Lat);
        }
        
        lat = $('#lat');
        long = $('#long');
        alt = $('#alt');
        tm = $('#time');
        speed = $('#speed');
        sat = $('#sat');
        course = $('#course');
        lat.html(data.Lat);
        long.html(data.Long);
        alt.html(data.Alt);
        tm.html(data.Moment);
        speed.html(data.Speed);
        sat.html(data.Sat);
        course.html(data.Course);
        getData();

    };
    //fonctions
   function toggleFullScreen(elem) {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}
    function getData() {

        msg = {'action': 'get_position'};
        msg = JSON.stringify(msg);
        if (persistNow) {
            ws.send(messageToSendPersist);
            setTimeout(function () {
                ws.send(msg);
            }, 500);
            new PNotify({
                title: 'Debut de l\'enregistrement',
                text: 'Fin de l\'enregistrement des donnees.',
                type: 'info',
                styling: 'bootstrap3'
            });
            persistNow = false;
        } else if (stopPersistNow) {
            msgToStop = {'action': 'stop_persiste'};
            msgToStop = JSON.stringify(msgToStop);
            ws.send(msgToStop);
            setTimeout(function () {
                ws.send(msg);
            }, 500);
            new PNotify({
                title: 'Fin de l\'enregistrement',
                text: 'Fin de l\'enregistrement des donnees.',
                type: 'dark',
                styling: 'bootstrap3'
            });
            stopPersistNow = false;
        } else {
            ws.send(msg);
        }

        if (map===undefined) {
            initMap();
            map.setCenter({lat: myLatitude, lng: myLongitude});
        }
        else{
            map.setCenter({lat: myLatitude, lng: myLongitude});
        }
        

        var myCity = new google.maps.Circle({
            center: {lat: myLatitude, lng: myLongitude},
            radius: 0.1,
            strokeColor: "#345e82",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#345e82",
            fillOpacity: 0.4
        });
        myCity.setMap(map);
        
         makeMarker();
        //Events

        google.maps.event.addListener(marker, 'click', function () {
            makeMarker();
            
        });

    }


    //remettre au centre de la carte a l'initialisatiion de la carte
    setTimeout(function () {
        initMap();
        map.setCenter({lat: myLatitude, lng: myLongitude});

    }, 1000);
    //remettre la carte au centre en fonction des coordonnees apres chaque 2 secondes

// Action on modal
    var message;
    btnCaptureModal = $('#btnCaptureModal');
    btnLaunchModal = $('#btnLaunchModal');
    btnStopCaptureModal = $('#btnStopCaptureModal');
    btnFullScreen=$('#btnFullScreen');
    chkbox=$('#chkbox');
    btnStopCaptureModal.hide();
    cbxCaptureType = $('#cbxCaptureType');
    txtSiteName = $('#txtSiteName');
    txtComment = $('#txtComment');
    chkbox.on('click',function(){
        if ($(this).is(':checked')) {
            console.log('video on');
            $('#imgtag').attr('src',"/video_feed')").load();
        }else{
           $('#imgtag').attr('src',"img/video_loading2.gif' )").load();
            console.log('video off');
        }
    });
    btnFullScreen.on('click',function(){
        toggleFullScreen(document.body);
    });
    btnCaptureModal.on('click', function () {
        siteName = txtSiteName.val();
        captureType = cbxCaptureType.val();
        comment = txtComment.val();
        $('#modal').modal('toggle');


        messageToSendPersist = {'action': 'start_persiste', 'site_name': siteName, 'type': captureType, 'description': comment};
        messageToSendPersist = JSON.stringify(messageToSendPersist);
        btnLaunchModal.hide();
        btnStopCaptureModal.show();
        persistNow = true;
        console.log(messageToSendPersist);


    });
    //stop capture
    btnStopCaptureModal.on('click', function () {
        // clearInterval(persitInterval);

        stopPersistNow = true;

        $(this).hide();
        btnLaunchModal.show();


    });
});
