<?php
 header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-type");
header("Access-Control-Allow-Methods: ['OPTIONS','GET','POST']");
$postdata = file_get_contents("php://input");
$ipLat="";
$ipLng="";
$lat="";
$long="";
$request="";


if(isset($_GET['keyword'])){
    $keyword = $_GET['keyword'];
    $category = $_GET['category'];;
        if(isset($_GET['distance'])){
        $distance =$_GET['distance'];
        }
        else{
            $distance="10";
        }
    $distance*=1609.34;
    $radioBtn = $_GET['radioBtn'];
    $ipLat = $_GET['ipApiLat'];
    $ipLng = $_GET['ipApiLong'];

    $keyword1=str_replace(" ", "+", $keyword);
    $category1=str_replace(" ", "+", $category);
        
    if($radioBtn!="Current location"){
        $location = $_GET['location'];
        $location1=str_replace(" ", "+", $location);
        $googleurl='https://maps.googleapis.com/maps/api/geocode/json?address='.$location1.'&key=AIzaSyAiAtyzUZk1-jvYRpFQyCKWbYSuJEz5F-4';
        $resp_json = file_get_contents($googleurl);
        $geocode = json_decode($resp_json, true);
            $result=$geocode["results"];
            for($j=0;$j<sizeof($result);$j++){
            $geocode=$result[$j]["geometry"]["location"];
            $lat=$geocode["lat"];
            $long=$geocode["lng"];
            }
    }
else{
    $lat=$ipLat;
    $long=$ipLng;
}

            $googlenearby='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='.$lat.','.$long.'&radius='.$distance.'&type='.$category1.'&keyword='.$keyword1.'&key=AIzaSyDsZwhMrepR1RMSC_16bhTAbdmVteypCWo';
            $nearby_json = file_get_contents($googlenearby);
           echo $nearby_json;
            die();
}

if(isset($_GET['nextPage'])){
      $nextPageToken=$_GET['nextPage'];
        $googlenearby='https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken='.$nextPageToken.'&key=AIzaSyDsZwhMrepR1RMSC_16bhTAbdmVteypCWo';
	   $nearby_json = file_get_contents($googlenearby);	
	   echo $nearby_json;
        die();
    
}

/*if(isset($postdata) && !empty($postdata)){
        $request = json_decode($postdata);
    if(isset($request->nextPage)){
        $nextPageToken=$request->nextPage;
        $googlenearby='https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken='.$nextPageToken.'&key=AIzaSyDsZwhMrepR1RMSC_16bhTAbdmVteypCWo';
	   $nearby_json = file_get_contents($googlenearby);	
	   echo $nearby_json;
        die();
    }*/
    if(isset($_GET['placeCity'])){
        $placename=$_GET['placename'];
        $placename1=str_replace(" ", "+",$placename);
        $placeCity=$_GET['placeCity'];
        $placeCity=str_replace(" ", "+", $placeCity);
        $placeState=$_GET['placeState'];
        $placeCountry=$_GET['placeCountry'];
        $placeStreet=$_GET['placeStreet'];
        $placeRoute=$_GET['placeRoute'];
        $placeRoute=str_replace(" ", "+", $placeRoute);
        $placeNeighbhor=$_GET['placeNeighbhor'];
        $placeNeighbhor=str_replace(" ", "+", $placeNeighbhor);
        $address1=$placeStreet.'+'.$placeRoute.'+'.$placeNeighbhor;
        
        $yelpData = array(
        'http'=>array(
        'method'=>"GET",
        'header'=>"Authorization: Bearer C--6w1QYDmksovGFpN13qsP7mcic-ZKa51MbGb8o-9k53TiFITqOXHAfeWd9l59U5Usjx9WMUQSFoANlSoDmebo5boM_PW5BfqaYTw_TJ8Ib_VvuKaKzpA80YGnBWnYx",
  )
);
        $stream = stream_context_create($yelpData);
$url='https://api.yelp.com/v3/businesses/matches/best?name='.$placename1.'&city='.$placeCity.'&state='.$placeState.'&country='.$placeCountry.'&address1='.$address1.'';
        /*$url="https://api.yelp.com/v3/businesses/matches/best?name=Pitfire+Pizza&city=Los+Angeles&state=CA&country=US&address1=5211+Lankershim+Blvd+No+Ho";*/
        $yelpReview=file_get_contents($url,false,$stream);
        $yelpReviewData=json_decode($yelpReview,true);
        $yelpDataId=$yelpReviewData['businesses'][0]['id'];
        $yelpReviews=file_get_contents('https://api.yelp.com/v3/businesses/'.$yelpDataId.'/reviews',false,$stream);
        echo $yelpReviews;
        die();
    }

/*
if(isset($_GET['nexturl']))
{
    $token=$_GET['nexturl'];
    $googlenearby='https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken='.$token.'&key=AIzaSyDsZwhMrepR1RMSC_16bhTAbdmVteypCWo';
	$nearby = file_get_contents($googlenearby);	
	 echo $nearby_json;
    die();
}
*/          
?>
        