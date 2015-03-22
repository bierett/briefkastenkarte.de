$(document).ready(function() {

	function PopupContent(title) {
		this.content = '<div class="wrapper"><div class="table"><div class="row_pp header green"><div class="cell">' + title + '</div><div class="cell"></div></div>';

		this.appendBrand = function(brand) {
			var html = '<div class="row_pp"><div class="cell"><b>Marke:</b></div><div class="cell">' + brand + '</div></div>';
			this.content += html;
		};

		this.appendCollectionTimes = function(collectionTimes) {
			var formattedCollectionTimes = collectionTimes.replace("Su", "So");
			var html = '<div class="row_pp"><div class="cell"><b>Leerungsszeiten:</b></div><div class="cell">' + formattedCollectionTimes + '</div></div>';
			this.content += html;
		};

		this.appendFooter = function(type, id, days) {
			var html = '<div class="row_pp"><div class="cell"><small><a href="http://www.openstreetmap.org/' + type + '/' + id + '" target="_blank">Details anzeigen</a></small></div>';
			if (days === undefined) {
				html += '</div></div></div></div>';
			}
			else {
				var formattedDays = Math.round(days);
				html += '<div class="cell"><small>Zuletzt vor ' + formattedDays + ' Tagen überprüft.</small></div></div>';
			}
			this.content += html;
		};

		this.appendName = function(name) {
			var html = '<div class="row_pp"><div class="cell"><b>Name:</b></div><div class="cell">' + name + '</div></div>';
			this.content += html;
		};

		this.appendNoFurtherInformation = function(useNoInfoClass) {
			var cssClass = (useNoInfoClass === undefined || useNoInfoClass === false) ? "cell" : "cell_noinfo";
			var html = '<div class="row_pp"><div class="' + cssClass +'">Keine weiteren Informationen verfügbar.</div></div>';
			this.content += html;
		};

		this.appendOpeningHours = function(openingHours) {
			var formattedOpeningHours = openingHours.replace("Su", "So");
			var html = '<div class="row_pp"><div class="cell"><b>Öffnungszeiten:</b></div><div class="cell">' + formattedOpeningHours + '</div></div>';
			this.content += html;
		};

		this.appendOperator = function(operator) {
			var html = '<div class="row_pp"><div class="cell"><b>Betreiber:</b></div><div class="cell">' + operator + '</div></div>';
			this.content += html;
		};

		this.appendRef = function(ref) {
			var html = '<div class="row_pp"><div class="cell"><b>Standort:</b></div><div class="cell">' + ref + '</div></div>';
			this.content += html;
		};
	};


	var map = new L.map('map').setView([50.7344700,7.0987190], 15);

	var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> Mitwirkende',
		opacity: 0.5
	}).addTo(map);

	var post_box = new L.OverPassLayer({
		minzoom: 12,
		query: "(node(BBOX)[amenity=post_box]);out;",

		callback: function(data) {
			for(var i=0;i<data.elements.length;i++) {
				var e = data.elements[i];

				if (e.id in this.instance._ids) return;
				this.instance._ids[e.id] = true;

				var popupContent = new PopupContent("Briefkasten");
				if ((!e.tags.collection_times) &&
					(!e.tags.operator) &&
					(!e.tags.brand) &&
					(!e.tags.ref)) {
					popupContent.appendNoFurtherInformation(true);
				}
				if (e.tags.collection_times) {
					popupContent.appendCollectionTimes(e.tags.collection_times);
				}
				if (e.tags.operator) {
					popupContent.appendOperator(e.tags.operator);
				}
				if (e.tags.brand) {
					popupContent.appendBrand(e.tags.brand);
				}
				if (e.tags.ref) {
					popupContent.appendRef(e.tags.ref);
				}

				var checkArray = parseCheckTimes(e.tags);
				var days = (checkArray[0] / (1000*60*60*24));
				if (checkArray[0]) {
					popupContent.appendFooter(e.type, e.id, days);
				}

				if ((!e.tags['collection_times:lastcheck']) &&
					(!e.tags['collection_times:last_check']) &&
					(!e.tags['lastcheck']) &&
					(!e.tags['last_checked']) &&
					(!e.tags['last_check']) &&
					(!e.tags['check_date'])) {
					popupContent.appendFooter(e.type, e.id, undefined);
				};

				var markerColor = e.tags.collection_times ? 'green':'red';

				var marker = L.AwesomeMarkers.icon({
					icon: 'envelope',
					prefix: 'fa',
					markerColor: markerColor,
					iconColor: 'white',
					spin:false
				});

				var pos = new L.LatLng(e.lat, e.lon);
				var marker = L.marker(pos, {icon: marker}).bindPopup(popupContent.content);

				this.instance.addLayer(marker);

			}
		}
	}).addTo(map);

	var post_box_no_collection_times = new L.OverPassLayer({
		minzoom: 12,
		query: "(node(BBOX)[amenity=post_box][collection_times!~'.']);out;",

		callback: function(data) {
			for(var i=0;i<data.elements.length;i++) {
				var e = data.elements[i];

				if (e.id in this.instance._ids) return;
				this.instance._ids[e.id] = true;

				var popupContent = new PopupContent("Briefkasten");
				if ((!e.tags.collection_times) &&
					(!e.tags.operator) &&
					(!e.tags.brand) &&
					(!e.tags.ref)) {
					popupContent.appendNoFurtherInformation(false);
				}
				if (e.tags.collection_times) {
					popupContent.appendCollectionTimes(e.tags.collection_times);
				}
				if (e.tags.operator) {
					popupContent.appendOperator(e.tags.operator);
				}
				if (e.tags.brand) {
					popupContent.appendBrand(e.tags.brand);
				}
				if (e.tags.ref) {
					popupContent.appendRef(e.tags.ref);
				}

				var checkArray = parseCheckTimes(e.tags);
				var days = (checkArray[0] / (1000*60*60*24));
				if (checkArray[0]) {
					popupContent.appendFooter(e.type, e.id, days);
				}

				if ((!e.tags['collection_times:lastcheck']) &&
					(!e.tags['collection_times:last_check']) &&
					(!e.tags['lastcheck']) &&
					(!e.tags['last_checked']) &&
					(!e.tags['last_check']) && (!e.tags['check_date']))  {
					popupContent.appendFooter(e.type, e.id, undefined);
				};

				var marker = L.AwesomeMarkers.icon({
					icon: 'envelope',
					prefix: 'fa',
					markerColor: 'red',
					iconColor: 'white',
					spin:false
				});

				var pos = new L.LatLng(e.lat, e.lon);
				var marker = L.marker(pos, {icon: marker}).bindPopup(popupContent.content);

				this.instance.addLayer(marker);

			}
		}
	});

	var post_box_sunday = new L.OverPassLayer({
		minzoom: 12,
		query: "(node(BBOX)[amenity=post_box][collection_times~'Su']);out;",

		callback: function(data) {
			for(var i=0;i<data.elements.length;i++) {
				var e = data.elements[i];

				if (e.id in this.instance._ids) return;
				this.instance._ids[e.id] = true;

				var popupContent = new PopupContent("Briefkasten");
				if ((!e.tags.collection_times) &&
					(!e.tags.operator) &&
					(!e.tags.brand) &&
					(!e.tags.ref)) {
					popupContent.appendNoFurtherInformation(false);
				}
				if (e.tags.collection_times) {
					popupContent.appendCollectionTimes(e.tags.collection_times);
				}
				if (e.tags.operator) {
					popupContent.appendOperator(e.tags.operator);
				}
				if (e.tags.brand) {
					popupContent.appendBrand(e.tags.brand);
				}
				if (e.tags.ref) {
					popupContent.appendRef(e.tags.ref);
				}

				var checkArray = parseCheckTimes(e.tags);
				var days = (checkArray[0] / (1000*60*60*24));
				if (checkArray[0]) {
					popupContent.appendFooter(e.type, e.id, days);
				}

				if ((!e.tags['collection_times:lastcheck']) &&
					(!e.tags['collection_times:last_check']) &&
					(!e.tags['lastcheck']) &&
					(!e.tags['last_checked']) &&
					(!e.tags['last_check']) && (!e.tags['check_date']))  {
					popupContent.appendFooter(e.type, e.id, undefined);
				};

				var marker = L.AwesomeMarkers.icon({
					icon: 'envelope',
					prefix: 'fa',
					markerColor: 'green',
					iconColor: 'white',
					spin:false
				});

				var pos = new L.LatLng(e.lat, e.lon);
				var marker = L.marker(pos, {icon: marker}).bindPopup(popupContent.content);

				this.instance.addLayer(marker);

			}
		}
	});
	var currentTime = new Date(); //today
	var day = currentTime.getDate();

	var monthArray = new Array(12);
	monthArray[0] = "01";
	monthArray[1] = "02";
	monthArray[2] = "03";
	monthArray[3] = "04";
	monthArray[4] = "05";
	monthArray[5] = "06";
	monthArray[6] = "07";
	monthArray[7] = "08";
	monthArray[8] = "09";
	monthArray[9] = "10";
	monthArray[10] = "11";
	monthArray[11] = "12";
	var month = monthArray[currentTime.getUTCMonth()];

	var year = currentTime.getFullYear() - 1;

	var post_box_check_collection_times = new L.OverPassLayer({
		minzoom: 12,
		query: "(   ( node(BBOX)[amenity=post_box];  - node(BBOX)[amenity=post_box](newer:'" + year + "-" + month + "-" + day + "T00:00:00Z'); ););out center meta;",

		callback: function(data) {
			for(var i=0;i<data.elements.length;i++) {
				var e = data.elements[i];

				if (e.id in this.instance._ids) return;
				this.instance._ids[e.id] = true;

				var popupContent = new PopupContent("Briefkasten");
				if ((!e.tags.collection_times) &&
					(!e.tags.operator) &&
					(!e.tags.brand) &&
					(!e.tags.ref)) {
					popupContent.appendNoFurtherInformation(false);
				}
				if (e.tags.collection_times) {
					popupContent.appendCollectionTimes(e.tags.collection_times);
				}
				if (e.tags.operator) {
					popupContent.appendOperator(e.tags.operator);
				}
				if (e.tags.brand) {
					popupContent.appendBrand(e.tags.brand);
				}
				if (e.tags.ref) {
					popupContent.appendRef(e.tags.ref);
				}

				var checkArray = parseCheckTimes(e.tags);
				var days = (checkArray[0] / (1000*60*60*24));
				if (checkArray[0]) {
					popupContent.appendFooter(e.type, e.id, days);
				}

				if ((!e.tags['collection_times:lastcheck']) &&
					(!e.tags['collection_times:last_check']) &&
					(!e.tags['lastcheck']) &&
					(!e.tags['last_checked']) &&
					(!e.tags['last_check']) && (!e.tags['check_date']))  {
					popupContent.appendFooter(e.type, e.id, undefined);
				};

				var marker = L.AwesomeMarkers.icon({
					icon: 'envelope',
					prefix: 'fa',
					markerColor: 'orange',
					iconColor: 'white',
					spin:false
				});

				var pos = new L.LatLng(e.lat, e.lon);
				var marker = L.marker(pos, {icon: marker}).bindPopup(popupContent.content);

				this.instance.addLayer(marker);

			}
		}
	});

	var post_office = new L.OverPassLayer({
		minzoom: 12,
		query: "(node(BBOX)[amenity=post_office ]);out;",

		callback: function(data) {
			for(var i=0;i<data.elements.length;i++) {
				var e = data.elements[i];

				if (e.id in this.instance._ids) return;
				this.instance._ids[e.id] = true;

				var popupContent = new PopupContent("Poststelle");

				if ((!e.tags.opening_hours) &&
					(!e.tags.operator) &&
					(!e.tags.name) &&
					(!e.tags.ref)) {
					popupContent.appendNoFurtherInformation(false);
				}
				if (e.tags.name) {
					popupContent.appendName(e.tags.name);
				}
				if (e.tags.opening_hours) {
					popupContent.appendOpeningHours(e.tags.opening_hours);
				}
				if (e.tags.operator) {
					popupContent.appendOperator(e.tags.operator);
				}
				if (e.tags.ref) {
					popupContent.appendRef(e.tags.ref);
				}
				popupContent.appendFooter(e.type, e.id, undefined);

				var markerColor = e.tags.opening_hours ? 'green':'red';

				var marker = L.AwesomeMarkers.icon({
					icon: 'building',
					prefix: 'fa',
					markerColor: markerColor,
					iconColor: 'white',
					spin:false
				});

				var pos = new L.LatLng(e.lat, e.lon);
				var marker = L.marker(pos, {icon: marker}).bindPopup(popupContent.content);

				this.instance.addLayer(marker);

			}
		}
	});

	var post_box_service_area = new L.OverPassLayer({
		minzoom: 12,
		query: "(node(BBOX)[amenity=post_box ]);out;",

		callback: function(data) {
			for(var i=0;i<data.elements.length;i++) {
				var e = data.elements[i];

				if (e.id in this.instance._ids) return;
				this.instance._ids[e.id] = true;
				var pos = new L.LatLng(e.lat, e.lon);

				var circle = L.circle(pos, 1000, {
					fillColor: "#ff7800",
					color: "#ff7800",
					opacity: 0.1,
					fillOpacity: 0.1
				}).addTo(map);

				this.instance.addLayer(circle);

			}
		}
	});

	var baseMaps = {
		"Standard": OpenStreetMap_Mapnik
	};

	var groupedOverlays = {
		"Basis": {
			"Briefkästen": post_box,
			"Poststellen": post_office
		},
		"Experte": {
			"Briefkästen mit Leerung am Sonntag": post_box_sunday,
			"Briefkästen ohne Leerungszeit": post_box_no_collection_times,
			"Briefkästen älter als ein Jahr": post_box_check_collection_times,
			"Versorgungsgebiet von Briefkästen": post_box_service_area
		}
	};
	//var options = { exclusiveGroups: ["Basis"] };

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
		position: 'topleft', // set the location of the control
		drawCircle: true, // controls whether a circle is drawn that shows the uncertainty about the location
		follow: false, // follow the user's location
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
		}, // change the style of the circle around the user's location
		markerStyle: {
			//color: 'red',
			fillColor: '#464646',
			fillOpacity: 1.0,
			stroke: false
		},
		//followCircleStyle: {},  // set difference for the style of the circle around the user's location while following
		//followMarkerStyle: {},
		icon: 'fa fa-map-marker', // class for icon, fa-location-arrow or fa-map-marker
		iconLoading: 'fa fa-spinner fa-spin', // class for loading icon
		circlePadding: [0, 0], // padding around accuracy circle, value is passed to setBounds
		//metric: true,  // use metric or imperial units
		onLocationError: function(err) {
			alert(err.message)
		}, // define an error callback function
		onLocationOutsideMapBounds: function(context) { // called when outside map boundaries
			alert(context.options.strings.outsideMapBoundsMsg);
		},
		showPopup: false, // display a popup when the user click on the inner marker
		strings: {
			title: "Standort ermitteln", // title of the locate control
		},
		locateOptions: {} // define location options e.g enableHighAccuracy: true or maxZoom: 10
	}).addTo(map);

	//add scale control
	L.control.scale().addTo(map);

	//add permalink
	map.addControl(new L.Control.Permalink({text: 'Permalink'}));

	//var loadingControl = L.Control.loading({
	//	spinjs: true
	//});
	//map.addControl(loadingControl);

	//L.control.layers(baseMaps, groupedOverlays, options).addTo(map);
	//L.control.groupedLayers(baseMaps, groupedOverlays, options).addTo(map);
	L.control.groupedLayers(baseMaps, groupedOverlays).addTo(map);



	function parseCheckTimes(tags) {
		var currentTime = new Date(); //today

		//collection_times:lastcheck
		var collection_times_lastcheck = tags['collection_times:lastcheck'];
		var collection_times_lastcheck_d = new Date(collection_times_lastcheck);
		var collection_times_lastcheck_milliseconds = Math.abs(currentTime-collection_times_lastcheck_d);

		//collection_times:last_check
		var collection_times_last_check = tags['collection_times:last_check'];
		var collection_times_last_check_d = new Date(collection_times_last_check);
		var collection_times_last_check_milliseconds = Math.abs(currentTime-collection_times_last_check_d);

		//lastcheck
		var lastcheck = tags['lastcheck'];
		var lastcheck_d = new Date(lastcheck);
		var lastcheck_milliseconds = Math.abs(currentTime-lastcheck_d);

		//last_checked
		var last_checked = tags['last_checked'];
		var last_checked_d = new Date(last_checked);
		var last_checked_milliseconds = Math.abs(currentTime-last_checked_d);

		//last_check
		var last_check = tags['last_check'];
		var last_check_d = new Date(last_check);
		var last_check_milliseconds = Math.abs(currentTime-last_check_d);

		//check_date
		var check_date = tags['check_date'];
		var check_date_d = new Date(check_date);
		var check_date_milliseconds = Math.abs(currentTime-check_date_d);

		var checkArray = new Array(6);
		if (tags['collection_times:lastcheck']) {
			checkArray[0] = collection_times_lastcheck_milliseconds;
		};
		if (tags['collection_times:last_check']) {
			checkArray[1] = collection_times_last_check_milliseconds;
		};
		if (tags['lastcheck']) {
			checkArray[2] = lastcheck_milliseconds;
		};
		if (tags['last_checked']) {
			checkArray[3] = last_checked_milliseconds;
		};
		if (tags['last_check']) {
			checkArray[4] = last_check_milliseconds;
		};
		if (tags['check_date']) {
			checkArray[5] = check_date_milliseconds;
		};

		return checkArray.sort(function(a, b){return a-b});
	}

});
