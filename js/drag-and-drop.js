
var overlay = document.getElementById('drop-overlay');
var dragCounter = 0;

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

    if (!file.name.toLowerCase().endsWith('.gpx')) {
        alert('Plik nie zawiera rozszerzenia .gpx.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function (event) {
        var gpxData = event.target.result;
        new L.GPX(gpxData, {
            async: true,
            marker_options: {
                startIconUrl: null,
                endIconUrl: null,
                shadowUrl: null
        }
        }).on('loaded', function () {
            map.fitBounds(e.target.getBounds());
        }).addTo(map);
    };

    reader.readAsText(file);
});