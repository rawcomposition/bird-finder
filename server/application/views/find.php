<!DOCTYPE html>
<html lang="en">

	<head>

		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<meta name="description" content="">
		<meta name="author" content="">

		<title>SmartBirder</title>

		<!-- Bootstrap core CSS -->
		<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

		<!-- Custom fonts for this template -->
		<link rel="stylesheet" href="vendor/font-awesome/css/font-awesome.min.css">
		<link rel="stylesheet" href="vendor/simple-line-icons/css/simple-line-icons.css">
		<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css?family=Muli" rel="stylesheet">
		<link href="https://cdn.jsdelivr.net/npm/select2@4.0.12/dist/css/select2.min.css" rel="stylesheet" />

		<!-- Custom styles for this template -->
		<link href="css/new-age.css?v=13" rel="stylesheet">

	</head>

	<body id="page-top">

		<!-- Navigation -->
		<nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
			<a class="navbar-brand" href="#page-top">Smart<strong>Birder</strong></a>
			<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><i class="fa fa-bars"></i>
			</button>
			<div class="collapse navbar-collapse" id="navbarResponsive">
				<ul class="navbar-nav ml-auto">
					<li class="nav-item">
						<a class="nav-link" href="#features">Try it out</a>
					</li>
				</ul>
			</div>
		</nav>

		<header class="masthead">
			<div class="container h-100">
				<div class="row h-100">
					<div class="col-lg-7 my-auto">
						<div class="header-content mx-auto">
							<h1 class="mb-5">Find your target birds - the easy way</h1>
						</div>
					</div>
					<div class="col-lg-5 my-auto">
					</div>
				</div>
			</div>
		</header>

		<!--<section class="download bg-primary text-center" id="download">
			<div class="container">
				<div class="row">
					<div class="col-md-8 mx-auto">
						<h2 class="section-heading">Discover what all the buzz is about!</h2>
						<p>Our app is available on any mobile device! Download now to get started!</p>
						<div class="badges">
							<a class="badge-link" href="#"><img src="img/google-play-badge.svg" alt=""></a>
							<a class="badge-link" href="#"><img src="img/app-store-badge.svg" alt=""></a>
						</div>
					</div>
				</div>
			</div>
		</section>-->
		
		<section class="features" id="features">
			<div class="container">
				<div class="section-heading text-center">
					<h2>Find a bird</h2>
					<hr>
				</div>
				<form style="margin:auto; max-width: 800px;">
					<div class="input-group input-group-lg">
						<select class="species-code form-control" name="species_code">
						</select>
					</div>
					<div class="form-row">
						<div class="col-md-6 input-group input-group-lg mt-2">
							<input id="location" type="text" class="form-control ebird-url" placeholder="Search for a place or address" size="50" autocomplete="off">
						</div>
						<div class="col-md-4 input-group input-group-lg mt-2">
							<div class="input-group-prepend">
								<span class="input-group-text" id="inputGroupPrepend">Radius (km)</span>
							</div>
							<input type="text" name="distance" class="distance form-control ebird-url" value="10">
						</div>
						<div class="col-md-2 mt-2">
							<button type="submit" class="btn btn-primary mb-2 pl-3 pr-3 find-btn" >Find</button>
						</div>
					</div>
					<input type="hidden" id="lat">
					<input type="hidden" id="lng">
				</form>
				<ol class="hotspot-results mt-5"></ol>
			</div>
		</section>
		
		<!--<section class="cta">
			<div class="cta-content">
				<div class="container">
					<h2>Stop waiting.<br>Start building.</h2>
					<a href="#contact" class="btn btn-outline btn-xl">Let's Get Started!</a>
				</div>
			</div>
			<div class="overlay"></div>
		</section>-->

		<section class="contact bg-primary" id="contact">
			<div class="container">
				<h2>Bird smarter, not harder <i class="fa fa-twitter"></i></h2>
			</div>
		</section>

		<footer>
			<div class="container">
				<p>&copy; 2017 Adam Jackson. All Rights Reserved.<br/>mail@rawcomposition.com</p>
			</div>
		</footer>

		<!-- Bootstrap core JavaScript -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script src="vendor/popper/popper.min.js"></script>
		<script src="vendor/bootstrap/js/bootstrap.min.js"></script>

		<!-- Plugin JavaScript -->
		<script src="vendor/jquery-easing/jquery.easing.min.js"></script>
		<script src="js/jquery.timeago.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/select2@4.0.12/dist/js/select2.min.js"></script>
		<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDTIORmh3RAwAmckeA6eNk_zwUKcUBwtEg&sensor=false&libraries=places"></script>

		<!-- Custom scripts for this template -->
		<script src="js/new-age.js?v=35"></script>
		

		
		<script>
			$( ".species-code" ).select2( {
				placeholder: "Search for a species",
				allowClear: true,
				multiple: true,
				maximumSelectionLength: 1,
				minimumInputLength: 3,
				ajax: {
					url: 'https://api.ebird.org/v2/ref/taxon/find?locale=en_US&cat=species&key=jfekjedvescr',
					dataType: 'json',
					delay: 250,
					processResults: function (data) {
						return {
							results: $.map(data, function (item) {
								return {
									text: item.name,
									id: item.code
								}
							})
						};
					}
				},
			}).on('select2:opening', function(e) {
				if ($(this).select2('val').length > 0) {
					e.preventDefault();
				}
			});
			
			$( ".find-btn" ).click( function(e) {
				e.preventDefault();
				var $btn = $(this);
				var $hotspots = 	$( ".hotspot-results" );
				var code = $( ".species-code" ).val();
				var lat = $( "#lat" ).val();
				var lng = $( "#lng" ).val();
				var distance = $( ".distance" ).val();
				$btn.text( "..." ).prop( "disabled", true );
				$hotspots.empty();
				$hotspots.append( "<p class='text-center'>Retrieving data. This may take a few minutes...</p>" );
				fetch( "/index.php/find/search?code=" + code + "&lat=" + lat + "&lng=" + lng + "&distance=" + distance )
					.then(response => {
						return response.json()
					})
					.then(data => {
						$btn.text( "find" ).prop( "disabled", false );
						$hotspots.empty();
						$.each(data, function(index, item) {
							html = '<li class="row"><div class="col-md-6"><a href="https://ebird.org/hotspot/' + item.location_id + '" target="_blank">' + item.location_name + '</a></div><div class="col-md-6"><b class="percent text-muted">' + item.average + '%</b> of ' + item.total_checklists + ' checklists</b><div class="progress"><div class="progress-bar" style="width:' + item.average + '%;"></div></div></div></li>' ;
							$hotspots.append( html );
						});	
					})
					.catch(err => {
						$btn.text( "find" ).prop( "disabled", false );
						$hotspots.empty();
						$hotspots.append( "<div class='alert alert-warning'>Error retrieving data</div>" );
					})
			});
			
			function initialize() {
				var input = document.getElementById('location');
				var autocomplete = new google.maps.places.Autocomplete(input);
				google.maps.event.addListener(autocomplete, 'place_changed', function () {
					var place = autocomplete.getPlace();
					document.getElementById('lat').value = place.geometry.location.lat();
					document.getElementById('lng').value = place.geometry.location.lng();
				});
			}

			google.maps.event.addDomListener(window, 'load', initialize);
		</script>

	</body>

</html>
