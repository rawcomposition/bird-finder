<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Find extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->database();
	}
	
	function getPage ($url) {

		$useragent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36';
		$timeout= 120;
		$dir			= dirname(__FILE__);
		$cookie_file	= $dir . '/cookies/' . md5($_SERVER['REMOTE_ADDR']) . '.txt';
		
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_FAILONERROR, true);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file);
		curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie_file);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true );
		curl_setopt($ch, CURLOPT_ENCODING, "" );
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt($ch, CURLOPT_AUTOREFERER, true );
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout );
		curl_setopt($ch, CURLOPT_TIMEOUT, $timeout );
		curl_setopt($ch, CURLOPT_MAXREDIRS, 10 );
		curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
		curl_setopt($ch, CURLOPT_REFERER, 'http://www.google.com/');
		$content = curl_exec($ch);
		if(curl_errno($ch))
		{
			echo 'error:' . curl_error($ch);
		}
		else
		{
			return $content;		
		}
			curl_close($ch);
		
	}
	
	public function index()
	{
		$species_code = $_GET["code"];
		$lat = $_GET["lat"];
		$lng = $_GET["lng"];
		$distance = $_GET["distance"];
		$species_info = json_decode(file_get_contents("https://api.ebird.org/v2/ref/taxonomy/ebird?species=$species_code&fmt=json"), true)[0];
		if( ! isset( $species_info["category"] ) || $species_info["category"] !== "species" ) {
			die( "Error retrieving species" );
		}
		$species_name = $species_info["comName"];
		
		$bounds = $this->_get_bounds( $lat, $lng, $distance );
		$json = $this->getPage( "https://ebird.org/map/points?speciesCode=$species_code&byr=1900&eyr=2019&bmo=1&emo=12&maxY={$bounds['max_lat']}&maxX={$bounds['max_lng']}&minY={$bounds['min_lat']}&ev=Z&minX={$bounds['min_lng']}" );
		
		$all_hotspots = [];
		$fetch_hotspots = [];
		foreach( json_decode( $json, true ) as $hotspot ) {
			$location = $hotspot["n"];
			
			$distance_between = $this->_getDistance( $lat, $lng, $hotspot["y"], $hotspot["x"] );
			if( $distance_between >=  $distance ) continue;
			
			$is_hotspot = $hotspot["hs"];
			if( ! $is_hotspot ) continue;
			$exists_query = $this->db->query( "SELECT id FROM abundance WHERE location_id = '$location'" );
			$hotspot_exists = $exists_query->num_rows() > 0;
			if( $hotspot_exists ) {
				$all_hotspots[] = $location;
			} else {
				$all_hotspots[] = $location;
				$fetch_hotspots[] = $location;
			}
		}
		
		$this->_fetchMulti( $fetch_hotspots, function( $barchart, $location_id ) {
			$hotspot_info = json_decode(file_get_contents("https://api.ebird.org/v2/ref/hotspot/info/$location_id"), true);
			$location_name = $hotspot_info["name"];
			$array = array_slice( str_getcsv($barchart, "\t"), 51);
			$checklists = array_slice( $array, 0, 48 );
			$total_checklists = array_sum( $checklists );
			$trimmedArray = array_filter( array_map('trim', $array) );
			$species = array_slice( $trimmedArray, 48 );

			$species_name = "";
			$frequencies = [];
			foreach( $species as $row ) {
				if( ! stripos( $row, "." ) ) {
					$frequencies = [];
					$species_name = $row;
				} else {
					$length = count( $frequencies );
					$frequencies["wk" . ( $length+1 )] = $row;
					if( count( $frequencies ) == 48 ) {
						
						$observed_per_wk = array_map( function( $checklists, $frequency ) {
							return $checklists * $frequency;
						}, $checklists, $frequencies );
						
						$total_observed = array_sum($observed_per_wk);
						
						if( $total_observed == 0 ) continue;
						
						$average = $total_observed/$total_checklists;
						$frequencies["average"] = $average;
						$frequencies["species_name"] = $species_name;
						$frequencies["location_name"] = $location_name;
						$frequencies["location_id"] = $location_id;
						$frequencies["total_checklists"] = $total_checklists;
						$this->db->insert( "abundance", $frequencies );
					}
				}
			}
		});
		
		$search_results = $this->db->select( "*" )
			->from( "abundance" )
			->where( "species_name", $species_name )
			->where_in( "location_id", $all_hotspots )
			->order_by( "average", "desc" )
			->get()
			->result_array();
		
		$search_results = array_map( function( $result ) {
			$result["average"] = round( $result["average"] * 100 );
			return $result;
		}, $search_results );
		
		return $this->output
			->set_content_type('application/json')
			->set_output( json_encode( $search_results ) );
	}
	
	private function _fetchMulti( $ids, callable $f ) {
		//https://stackoverflow.com/questions/33695040/how-do-we-make-multiple-file-get-contents-in-php-run-faster
		$multi = curl_multi_init();
		$reqs  = [];
		
		$useragent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36';
		$timeout= 120;
		$dir			= dirname(__FILE__);
		$cookie_file	= $dir . '/cookies/' . md5($_SERVER['REMOTE_ADDR']) . '.txt';
		
		foreach ($ids as $id) {
			$req = curl_init();
			curl_setopt( $req, CURLOPT_URL, "https://ebird.org/barchartData?r=$id&bmo=1&emo=12&byr=1900&eyr=2019&fmt=tsv");
			curl_setopt( $req, CURLOPT_HEADER, 0);
			curl_setopt($req, CURLOPT_FAILONERROR, true);
			curl_setopt($req, CURLOPT_COOKIEFILE, $cookie_file);
			curl_setopt($req, CURLOPT_COOKIEJAR, $cookie_file);
			curl_setopt($req, CURLOPT_FOLLOWLOCATION, true );
			curl_setopt($req, CURLOPT_ENCODING, "" );
			curl_setopt($req, CURLOPT_RETURNTRANSFER, true );
			curl_setopt($req, CURLOPT_AUTOREFERER, true );
			curl_setopt($req, CURLOPT_CONNECTTIMEOUT, $timeout );
			curl_setopt($req, CURLOPT_TIMEOUT, $timeout );
			curl_setopt($req, CURLOPT_MAXREDIRS, 10 );
			curl_setopt($req, CURLOPT_USERAGENT, $useragent);
			curl_setopt($req, CURLOPT_REFERER, 'http://www.google.com/');
			curl_multi_setopt( $multi, CURLMOPT_MAXCONNECTS, 4 );
			curl_multi_add_handle( $multi, $req );
			$reqs[$id] = $req;
		}

		// While we're still active, execute curl
		$active = null;

		// Execute the handles
		do {
			$mrc = curl_multi_exec($multi, $active);
		} while ($mrc == CURLM_CALL_MULTI_PERFORM);

		while ($active && $mrc == CURLM_OK) {
			if (curl_multi_select($multi) != -1) {
				do {
					$mrc = curl_multi_exec($multi, $active);
				} while ($mrc == CURLM_CALL_MULTI_PERFORM);
			}
		}

		// Close the handles
		foreach ($reqs as $id=>$req) {
			$f(curl_multi_getcontent($req),$id);
			curl_multi_remove_handle($multi, $req);
		}
		curl_multi_close($multi);
	}
	
	private function _get_bounds( $lat, $lng, $distance = 50, $unit = 'km' ) {
		// radius of earth; @note: the earth is not perfectly spherical, but this is considered the 'mean radius'
		if( $unit == 'km' ) { $radius = 6371.009; }
		elseif ( $unit == 'mi' ) { $radius = 3958.761; }

		// latitude boundaries
		$maxLat = ( float ) $lat + rad2deg( $distance / $radius );
		$minLat = ( float ) $lat - rad2deg( $distance / $radius );

		// longitude boundaries (longitude gets smaller when latitude increases)
		$maxLng = ( float ) $lng + rad2deg( $distance / $radius) / cos( deg2rad( ( float ) $lat ) );
		$minLng = ( float ) $lng - rad2deg( $distance / $radius) / cos( deg2rad( ( float ) $lat ) );

		$max_min_values = array(
			'max_lat' => $maxLat,
			'min_lat' => $minLat,
			'max_lng' => $maxLng,
			'min_lng' => $minLng
		);

		return $max_min_values;
	}
	
	private function _getDistance( $latitude1, $longitude1, $latitude2, $longitude2 ) {  
		//https://stackoverflow.com/questions/12439801/how-to-check-if-a-certain-coordinates-fall-to-another-coordinates-radius-using-p
		$earth_radius = 6371.009;

		$dLat = deg2rad($latitude2 - $latitude1);  
		$dLon = deg2rad($longitude2 - $longitude1);  

		$a = sin($dLat/2) * sin($dLat/2) + cos(deg2rad($latitude1)) * cos(deg2rad($latitude2)) * sin($dLon/2) * sin($dLon/2);  
		$c = 2 * asin(sqrt($a));  
		$d = $earth_radius * $c;  

		return $d;  
	}
}
