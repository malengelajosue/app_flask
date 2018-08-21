

var map, drawingManager;


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
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
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
            position: google.maps.ControlPosition.BUTTOM_CENTER,
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
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1
        }
    });
/// les fonction de dessin sur la carte
// Define the LatLng coordinates for the polygon's path.

var triangleCoords;
triangleCoords=[];
function getMessage() {
    var img;
   

    var img = "<img src=" + "{{ url_for('static', filename='img/loading.gif') }}" + "style='margin-left: auto;margin-right: auto; display: block'>";
    //dataZone_timeline.html(img);
    var url = "/get_trace_information/9";
    $.get(url, function (data) {
     
    
        
        for (var i = 1; i < data.length; i++) {
            triangleCoords[i]={'lat': data[i].lat, 'lng': data[i].lng};
          
        }
        
      

    });

}
    getMessage();
    // Construct the polygon.
    var bermudaTriangle = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });
    console.log("la latitude de "+triangleCoords[1].lat);
    map.setCenter({lat: triangleCoords[1].lat, lng: triangleCoords[1].lng});
    bermudaTriangle.setMap(map);


///les evenements sur la carte
    google.maps.event.addListener(drawingManager, 'polylinecomplete', function (polyline) {
        var path = polyline.getPath();
        var length = google.maps.geometry.spherical.computeLength(path);
        $('#polygone_length').html(length / 1000 + 'kms');

    });

    google.maps.event.addListener(drawingManager, 'overlaycomplete',
            function (evt) {
                if (evt.type === google.maps.drawing.OverlayType.POLYGON) {
                    evt.overlay.setEditable(true);
                    evt.overlay.setDraggable(true);

                    var path = evt.overlay.getPath();
                    var area = google.maps.geometry.spherical.computeArea(path);
                    var length = google.maps.geometry.spherical.computeLength(path);
                    $('#polygone_area').html(area / 1000000 + ' Km<sup>2</sup>');
                    $('#polygone_line').html(length / 1000 + 'Km');
                }
            });
    google.maps.event.addListener(drawingManager, 'overlaychange',
            function (evt) {
                if (evt.type === google.maps.drawing.OverlayType.POLYGON) {

                    evt.overlay.setDraggable(true);

                    var path = evt.overlay.getPath();
                    var area = google.maps.geometry.spherical.computeArea(path);
                    var length = google.maps.geometry.spherical.computeLength(path);
                    $('#polygone_area').html(area / 1000000 + ' km sqs');
                    $('#polygone_line').html(length / 1000 + 'kms');
                }
            });


    drawingManager.setMap(map);


}





$("#trigger_my_modal").click(function () {

    
    initMap_timeline();


});