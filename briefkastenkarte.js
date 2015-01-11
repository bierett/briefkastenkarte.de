var map = new L.map('map').locate({setView: true}).setView([50.7344700,7.0987190], 15);

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
L.control.layers(baseMaps).addTo(map);

function onLocationFound(e) {
	var radius = e.accuracy / 2;
	L.marker(e.latlng).addTo(map)
//	.bindPopup("Du bist innerhalb von " + radius + " Meter von dieser Stelle.").openPopup();
//	L.circle(e.latlng, radius).addTo(map);
	L.circle(e.latlng, 800).addTo(map);
}

function onLocationError(e) {
	alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

L.control.scale().addTo(map);
