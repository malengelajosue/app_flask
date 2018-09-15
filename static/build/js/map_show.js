


$(document).ready(function () {
    var map, drawingManager, donnees, dataToshow,firstItem;
    donnees = [];
    dataToshow = false;

    function onFinish(i, data) {
       
    
        var newData=JSON.parse(JSON.stringify(data));
        
        donnees.push(new google.maps.LatLng(newData.lat,newData.lng));
     
    }
    function getMessage(id) {
        var img;
        donnees = [];
        var url = "/get_trace_information/" + id;
        $.get(url, function (data) {
            for (var i = 1; i < data.length; i++) {
                 console.log(data[i]);
                //la fonction de callback
                onFinish(i, data[i]);
               

            }
        });

    }


    function initMap_timeline() {
        //les variables 

        var myLatitude, Mylongitude;
        var myLatLng = {lat: myLatitude, lng: Mylongitude};

        //les affectations

        myLatitude = -11.673898;
        Mylongitude = 27.478447;
        google.maps.visualRefresh = true;

        //les options de maps
        var mapTypeIds = ['roadmap', "satellite", "hybrid", "terrain"];

        //condifguration des options de la carte

        var mapOptions = {
            center: new google.maps.LatLng(myLatitude, Mylongitude),
            zoom: 15,
            mapTypeId: 'OSM',
            mapTypeControlOptions: {
                mapTypeIds: mapTypeIds,

            },
            scaleControl: true,
            rotateControl: true,
            streetViewControl: true
        };
        //Acces DOM a l'element modal_map

        var mapELement2 = document.getElementById('modal_map');

        //Creation de l'objet Map

        map = new google.maps.Map(mapELement2, mapOptions);


        ///Chargement des donnees provenant d'Open Streep Map

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
            name: "OpenStreepMap",
            maxZoom: 18
        }));


        //Creation de l'objet de dessin

        drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['marker', 'polygon', 'polyline']
            },

            polygonOptions: {
                draggable: true,
                strokeColor: 'blue',
                strokeWeight: 3,
                fillColor: 'yellow',
                fillOpacity: 0.2

            },
            polylineOptions: {
                strokeColor: 'red',
                strokeWeight: 3
            },
            markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
            circleOptions: {
                fillColor: '#ffff00',
                fillOpacity: 0.3,
                strokeWeight: 2,
                clickable: false,
                editable: true,
                zIndex: 1
            }
        });




///les evenements sur les 


        google.maps.event.addListener(drawingManager, 'overlaycomplete',
                function (evt) {
                    if (evt.type === google.maps.drawing.OverlayType.POLYGON
                            ) {
                        evt.overlay.setEditable(false);
                        evt.overlay.setDraggable(false);

                        var path = evt.overlay.getPath();
                        var area = google.maps.geometry.spherical.computeArea(path);
                        var length = google.maps.geometry.spherical.computeLength(path);
                        $('#polygone_area').html(area / 1000000 + ' Km<sup>2</sup>');
                        $('#polygone_line').html(length / 1000 + 'Km');
                    } else if (evt.type === google.maps.drawing.OverlayType.POLYLINE) {
                        var path = evt.overlay.getPath();
                        var length = google.maps.geometry.spherical.computeLength(path);
                        $('#polyline_length').html(length / 1000 + 'Km');
                    }
                });

        drawingManager.setMap(map);
        //affuchage de la trace
        if (dataToshow) {



//            firstItem = donnees[1];
//
//            console.log('le centre  de la carte' + firstItem.lat);
//            console.log('la liste des donnees' + donnees + "la taille" + donnees.length);
            
            var marker = new google.maps.Marker({
                position: donnees[1],
                title: "Hello World!",
                map:map,
                icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                animation: google.maps.Animation.DROP,

            });

            map.setCenter(donnees[1]);
            marker.setMap(map);
            var polylineOptions = {
                path: donnees,
                strokeColor: "red",
                strokeWeight: 2
            };
            var polyline = new google.maps.Polyline(polylineOptions);
            polyline.setMap(map);

        }
    }
    ;
//evenement sur click du bouton map
   
//evenement sur la seclection de la liste 
    $('#cbx_view_sites').change(function () {
        var valeur = $(this).val();
        getMessage(valeur);
        setTimeout(showDataOnMap, 1000);
        
    });

    function showDataOnMap() {

        dataToshow = true;
        initMap_timeline();

    }



});