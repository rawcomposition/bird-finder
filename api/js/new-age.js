(function($) {
	"use strict"; // Start of use strict

	// Smooth scrolling using jQuery easing
	$('a[href*="#"]:not([href="#"])').click(function() {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: (target.offset().top - 48)
				}, 1000, "easeInOutExpo");
				return false;
			}
		}
	});

	// Activate scrollspy to add active class to navbar items on scroll
	$('body').scrollspy({
		target: '#mainNav',
		offset: 54
	});

	// Closes responsive menu when a link is clicked
	$('.navbar-collapse>ul>li>a').click(function() {
		$('.navbar-collapse').collapse('hide');
	});

	// Collapse the navbar when page is scrolled
	$(window).scroll(function() {
		if ($("#mainNav").offset().top > 100) {
			$("#mainNav").addClass("navbar-shrink");
		} else {
			$("#mainNav").removeClass("navbar-shrink");
		}
	});
		
	/*$.getJSON( "http://countybirder.us/api.php?url=" + localStorage.getItem( "ebird_url" ), function (data) {
		
		var countiesMap = Highcharts.geojson(Highcharts.maps['countries/us/us-all-all']),
			lines = Highcharts.geojson(Highcharts.maps['countries/us/us-all-all'], 'mapline'),
			options;
	
		// Add state acronym for tooltip
		Highcharts.each(countiesMap, function (mapPoint) {
			mapPoint.name = mapPoint.name + ', ' + mapPoint.properties['hc-key'].substr(3, 2);
		});
	
		options = {
			title: {
				text: ''
			},
	
			legend: {
				enabled: false
			},
	
			mapNavigation: {
				enabled: false
			},
	
			colorAxis: {
				dataClasses: [{
					from: 0,
					to: 30,
					color: "#edd978"
				}, {
					from: 30,
					to: 90,
					color: "#ecc473"
				}, {
					from: 90,
					to: 150,
					color: "#ebb970"
				}, {
					from: 150,
					to: 200,
					color: "#ea9a68"
				}, {
					from: 200,
					color: "#e54353"
				}]
			},
	
			plotOptions: {
				mapline: {
					showInLegend: false,
					enableMouseTracking: false
				}
			},
			
			credits: {
				enabled: false
			},
	
			series: [{
				mapData: countiesMap,
				data: data.content,
				joinBy: ['hc-key', 'code'],
				name: 'County life list',
				borderWidth: 0.5,
				states: {
					hover: {
						color: '#2d6ec9'
					}
				}
			}, {
				type: 'mapline',
				name: 'State borders',
				data: [lines[0]],
				color: '#aaaaaa'
			}, {
				type: 'mapline',
				name: 'Separator',
				data: [lines[1]],
				color: 'gray'
			}]
		};
	
		// Instanciate the map
		$('#container').highcharts('Map', options);
		$( ".last-updated" ).attr( "datetime", data.updated_at ).timeago();
	});
	
	$( ".load-map" ).click( function() {
		var button = $(this);
		button.text( "loading..." );
		var url = $( ".ebird-url" ).val();
		$.getJSON( "http://countybirder.us/api.php?url=" + url, function (data) {
			$('#container').highcharts().series[0].setData(data.content);
			localStorage.setItem( "ebird_url", url );
			$( ".last-updated" ).attr( "datetime", data.updated_at ).timeago( "updateFromDOM" );
			button.text( "Load Map" );
		});
	});
	
	$( ".sync" ).click( function() {
		var button = $(this);
		button.text( "loading..." );
		var url = localStorage.getItem( "ebird_url" );
		$.getJSON( "http://countybirder.us/api.php?sync=true&url=" + url, function (data) {
			$('#container').highcharts().series[0].setData(data.content);
			localStorage.setItem( "ebird_url", url );
			$( ".last-updated" ).attr( "datetime", data.updated_at ).timeago( "updateFromDOM" );
			button.text( "Sync Now" );
		});
	});
*/
})(jQuery); // End of use strict
