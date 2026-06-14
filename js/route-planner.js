var generatedMarkers = [];

document.getElementById("plan-route").addEventListener("click", function() {
    if (!currentTrackLayer) {
        alert("Najpierw wczytaj plik GPX.");
        return;
    }

    var interval = parseInt(document.getElementById("distance-input").value);
    if (isNaN(interval) || interval <= 0) {
        alert("Podaj dodatnią odległość między stanowiskami.");
        return;
    }
    var photosTime = parseInt(document.getElementById("photo-time-input").value) || 0;

    generatedMarkers.forEach(function(marker) {
        map.removeLayer(marker);
    });
    generatedMarkers = [];

    var allCoords = [];

    function extractCoords(layer) {
        if (layer instanceof L.Polyline) {
            coors = layer.getLatLngs();
            if (Array.isArray(coors[0])) {
                coors.forEach(function(subCoors) {
                    allCoords = allCoords.concat(subCoors);
                });
            } else {
                allCoords = allCoords.concat(coors);
            }
        } else if (typeof layer.getLayers === "function") {
            layer.getLayers().forEach(extractCoords);
        }
    }

    extractCoords(currentTrackLayer);

    if (allCoords.length < 2) {
        alert("Trasa musi zawierać co najmniej 2 punkty.");
        return;
    }

    var accumulatedDistance = 0;
    var nextTargetDistance = 0;
    var counter = 1;

    for (var i = 0; i < allCoords.length - 1; i++) {
        var p1 = allCoords[i];
        var p2 = allCoords[i + 1];
        var segmentDistance = p1.distanceTo(p2);
        
        if (!segmentDistance || isNaN(segmentDistance) || segmentDistance <= 0) {
            continue;
        }

        while (accumulatedDistance + segmentDistance >= nextTargetDistance) {
            
            var remainingDistance = nextTargetDistance - accumulatedDistance;
            var ratio = segmentDistance > 0 ? remainingDistance / segmentDistance : 0;

            var nLat = p1.lat + ratio * (p2.lat - p1.lat);
            var nLng = p1.lng + ratio * (p2.lng - p1.lng);
            var point = L.latLng(nLat, nLng);
            
            var marker = L.circleMarker(point, {
                radius: 2,
                fillColor: "#300035",
                color: "#ffffff",
                weight: 1,
                fillOpacity: 1,
                interactive: true,
            }).addTo(map);
            
            marker.bindPopup("<b>Stanowisko " + counter + "</b></br>" + nextTargetDistance + " m", {
                className: "station-popup"
            });

            generatedMarkers.push(marker);
            
            counter++;
            nextTargetDistance += interval;
        }
        accumulatedDistance += segmentDistance;
    }

    if (allCoords.length > 0) {
        var lastPoint = allCoords[allCoords.length - 1];
        
        var lastMarker = L.circleMarker(lastPoint, {
            radius: 2,
            fillColor: "#300035",
            color: "#ffffff",
            weight: 1,
            fillOpacity: 1,
            interactive: true,
        }).addTo(map);

        lastMarker.bindPopup("<b>Stanowisko " + counter + "</b></br>" + nextTargetDistance + " m", {
            className: "station-popup"
        });
        generatedMarkers.push(lastMarker);
    }

    updateRouteStats(currentTrackLayer, generatedMarkers.length);
});