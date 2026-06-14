var overlay = document.getElementById('drop-overlay');
var dragCounter = 0;
var currentTrackLayer = null;

window.addEventListener('dragenter', function (e) {
    e.preventDefault();
    dragCounter++;
    overlay.style.display = 'flex';
});

window.addEventListener('dragover', function (e) {
    e.preventDefault();
});

window.addEventListener('dragleave', function (e) {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
        overlay.style.display = 'none';
    }
});

window.addEventListener('drop', function (e) {
    e.preventDefault();
    dragCounter = 0;
    overlay.style.display = 'none';
    
    var file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.gpx')) {
        alert('Plik nie zawiera rozszerzenia .gpx.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function (event) {
        var gpxData = event.target.result;
        
        if (currentTrackLayer) {
            map.removeLayer(currentTrackLayer);
        }

        if (typeof generatedMarkers !== 'undefined') {
            generatedMarkers.forEach(function(marker) {
                map.removeLayer(marker);
            });
            generatedMarkers = [];
        }


        new L.GPX(gpxData, {
            async: false,
            marker_options: {
                startIconUrl: null,
                endIconUrl: null,
                shadowUrl: null
            },
            polyline_options: {
                    color: "#300035",
                    weight: 8,
                    lineCap: 'round'
            }
        }).addTo(map);
        currentTrackLayer = new L.GPX(gpxData, {
            async: false,
            marker_options: {
                startIconUrl: null,
                endIconUrl: null,
                shadowUrl: null
            },
            polyline_options: {
                    color: "#ee49f4",
                    weight: 4,
                    lineCap: 'round'
            }
        });

        currentTrackLayer.addTo(map);

        map.fitBounds(currentTrackLayer.getBounds());

        updateRouteStats(currentTrackLayer);
    };

    reader.readAsText(file);
});