var map = new L.map('map').setView([50.7344700,7.0987190], 15);

var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> Mitwirkende',
	opacity: 0.5
}).addTo(map);

var OpenCycleMap = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.opencyclemap.org" target="_blank">OpenCycleMap</a>, &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>',
	opacity: 0.5
});

var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var post_box_no_collection_times = new L.OverPassLayer({
	minzoom: 12,
	//query: "http://overpass-api.de/api/interpreter?data=[out:json];(node(BBOX)[amenity=post_box][collection_times!~'.']);out;",
	query: "(node(BBOX)[amenity=post_box][collection_times!~'.']);out;",

	callback: function(data) {
		for(i=0;i<data.elements.length;i++) {
			e = data.elements[i];

			if (e.id in this.instance._ids) return;
			this.instance._ids[e.id] = true;
			var pos = new L.LatLng(e.lat, e.lon);
			var popup = this.instance._poiInfo(e.tags,e.id);

			var popup = '<h2>Briefkasten</h2><div>';
			if ((!e.tags.collection_times) && (!e.tags.operator) && (!e.tags.brand) && (!e.tags.ref)) {popup = popup + 'Keine weiteren Informationen verfügbar.<br>'};
			if (e.tags.collection_times) {popup = popup + '<b>Leerungsszeiten:</b> ' + e.tags.collection_times + '<br>'};
			if (e.tags.operator) {popup = popup + '<b>Betreiber:</b> ' + e.tags.operator + '<br>'};
			if (e.tags.brand) {popup = popup + '<b>Marke:</b> ' + e.tags.brand + '<br>'};
			if (e.tags.ref) {popup = popup + '<b>Standort:</b> ' + e.tags.ref + '<br>'};

			//if (e.tags.name) { popup = popup + e.tags.name + '<br>'};
			//if ((e.tags.covered) && (e.tags.covered == 'yes')) {popup = popup + 'überdachte Anlage<br>'};
			popup = popup + '</div><small><a href="http://www.openstreetmap.org/edit?editor=id&node='+e.id+'">Eintrag mit iD-Editor bearbeiten</a></small><br>';

			var redMarker = L.AwesomeMarkers.icon({
				icon: 'envelope',
				prefix: 'fa',
				markerColor: 'red',
				iconColor: 'white',
				spin:false
			});

			var marker = L.marker(pos, {icon: redMarker}).bindPopup(popup);


			//var circle = L.circle(pos, 800, {
			//	    	color: 'red',
			//	fillColor: '#f03',
			//	fillOpacity: 0.1
			//}).addTo(map);

			this.instance.addLayer(marker);

		}
	}
}).addTo(map);

var post_box_collection_times = new L.OverPassLayer({
	minzoom: 12,
	//query: "http://overpass-api.de/api/interpreter?data=[out:json];(node(BBOX)[amenity=post_box][collection_times!~'.']);out;",
	query: "(node(BBOX)[amenity=post_box][collection_times~'.']);out;",

	callback: function(data) {
		for(i=0;i<data.elements.length;i++) {
			e = data.elements[i];

			if (e.id in this.instance._ids) return;
			this.instance._ids[e.id] = true;
			var pos = new L.LatLng(e.lat, e.lon);
			var popup = this.instance._poiInfo(e.tags,e.id);

			var popup = '<h2>Briefkasten</h2><div>';
			if ((!e.tags.collection_times) && (!e.tags.operator) && (!e.tags.brand) && (!e.tags.ref)) {popup = popup + 'Keine weiteren Informationen verfügbar.<br>'};
			if (e.tags.collection_times) {popup = popup + '<b>Leerungsszeiten:</b> ' + e.tags.collection_times + '<br>'};
			if (e.tags.operator) {popup = popup + '<b>Betreiber:</b> ' + e.tags.operator + '<br>'};
			if (e.tags.brand) {popup = popup + '<b>Marke:</b> ' + e.tags.brand + '<br>'};
			if (e.tags.ref) {popup = popup + '<b>Standort:</b> ' + e.tags.ref + '<br>'};

			//if (e.tags.name) { popup = popup + e.tags.name + '<br>'};
			//if ((e.tags.covered) && (e.tags.covered == 'yes')) {popup = popup + 'überdachte Anlage<br>'};
			popup = popup + '</div><small><a href="http://www.openstreetmap.org/edit?editor=id&node='+e.id+'">Eintrag mit iD-Editor bearbeiten</a></small><br>';

			var greenMarker = L.AwesomeMarkers.icon({
				icon: 'envelope',
				prefix: 'fa',
				markerColor: 'green',
				iconColor: 'white',
				spin:false
			});

			var marker = L.marker(pos, {icon: greenMarker}).bindPopup(popup);


			//var circle = L.circle(pos, 800, {
			//	    	color: 'red',
			//	fillColor: '#f03',
			//	fillOpacity: 0.1
			//))}).addTo(map);

			this.instance.addLayer(marker);

		}
	}
}).addTo(map);

//var baseMaps = {
//	"Standard": OpenStreetMap_Mapnik,
//	"Radfahrerkarte": OpenCycleMap
//	"Luftbild": Esri_WorldImagery
//};

//var overlayMaps = {
//	"Briefkästen (Fehlende Leerungszeiten)": post_box_collection_times,
//};

//L.control.layers(baseMaps, overlayMaps).addTo(map);
//L.control.layers(baseMaps).addTo(map);

new L.Control.GeoSearch({
	provider: new L.GeoSearch.Provider.OpenStreetMap()
}).addTo(map);

function onLocationFound(e) {
	var radius = e.accuracy / 2;
	L.marker(e.latlng).addTo(map)
//	.bindPopup("Du bist innerhalb von " + radius + " Meter von dieser Stelle.").openPopup();
//	L.circle(e.latlng, radius).addTo(map);

	var circle = L.circle(e.latlng, 800, {
//		color: 'red',
		stroke: false,
		fillColor: '#f03',
		fillOpacity: 0.1
	}).addTo(map);
	//L.circle(e.latlng, 800).addTo(map);
}

//Add locate control
L.control.locate({
    position: 'topleft',  // set the location of the control
    drawCircle: true,  // controls whether a circle is drawn that shows the uncertainty about the location
    follow: true,  // follow the user's location
    setView: true, // automatically sets the map view to the user's location, enabled if `follow` is true
    keepCurrentZoomLevel: false, // keep the current map zoom level when displaying the user's location. (if `false`, use maxZoom)
    stopFollowingOnDrag: false, // stop following when the map is dragged if `follow` is true (deprecated, see below)
    remainActive: false, // if true locate control remains active on click even if the user's location is in view.
    markerClass: L.circleMarker, // L.circleMarker or L.marker
    circleStyle: {
		//color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.2,
		stroke: false
    },  // change the style of the circle around the user's location
    markerStyle: {
		//color: 'red',
		fillColor: '#464646',
		fillOpacity: 1.0,
		stroke: false
	},
    //followCircleStyle: {},  // set difference for the style of the circle around the user's location while following
    //followMarkerStyle: {},
    icon: 'fa fa-map-marker',  // class for icon, fa-location-arrow or fa-map-marker
    iconLoading: 'fa fa-spinner fa-spin',  // class for loading icon
    circlePadding: [0, 0], // padding around accuracy circle, value is passed to setBounds
    //metric: true,  // use metric or imperial units
    onLocationError: function(err) {alert(err.message)},  // define an error callback function
    onLocationOutsideMapBounds:  function(context) { // called when outside map boundaries
            alert(context.options.strings.outsideMapBoundsMsg);
    },
    showPopup: false, // display a popup when the user click on the inner marker
    strings: {
        title: "Standort ermitteln",  // title of the locate control
    },
    locateOptions: {}  // define location options e.g enableHighAccuracy: true or maxZoom: 10
}).addTo(map);

//add scale control
L.control.scale().addTo(map);

//add permalink
map.addControl(new L.Control.Permalink({text: 'Permalink'}));

//var loadingControl = L.Control.loading({
//	spinjs: true
//});
//map.addControl(loadingControl);
