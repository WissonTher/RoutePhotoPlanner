var map = L.map("map").setView([49.25, 19.95], 12);

var mapyczTourist = L.tileLayer(`https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
});
mapyczTourist.addTo(map);

const LogoControl = L.Control.extend({
    options: {
        position: 'bottomleft',
    },

    onAdd: function (map) {
        const container = L.DomUtil.create('div');
        const link = L.DomUtil.create('a', '', container);

        link.setAttribute('href', 'http://mapy.cz/');
        link.setAttribute('target', '_blank');
        link.innerHTML = '<img src="https://api.mapy.cz/img/api/logo.svg" />';
        L.DomEvent.disableClickPropagation(link);
        return container;
    },
});

new LogoControl().addTo(map);