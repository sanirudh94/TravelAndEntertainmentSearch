
var flag=0;
var flag1=0;
function formValidation1(){
   var x = document.getElementById("radioLoc").checked;
    var keywordText=$("#keyword_enter").val();
    reWhiteSpace = new RegExp(/^\s+$/);
    if ((reWhiteSpace.test(keywordText)) || (keywordText.length==0)||((ipApiLat==null)||(ipApiLong==null))) {
        
          $("#error1").show();
        $("#keyword_enter").css("border","solid");
         $("#keyword_enter").css("border-color","red");
        $("#searchId").prop('disabled', true);
    }
    else{
        flag=1;
         $("#error1").hide();
         $("#keyword_enter").css("border","1px solid #ccc");
        $("#keyword_enter").css("border-radius","4px");
        //$("#searchId").prop('disabled', false);
         //$("#keyword_enter").removeAttr("border-color","red");
    }
    if(flag==1 && x==true){
        $("#searchId").prop('disabled', false);
    }
}
function formValidation2(){
    var keywordText=$("#location1").val();
    reWhiteSpaces = new RegExp(/^\s+$/);
    if ((reWhiteSpaces.test(keywordText)) || (keywordText.length==0)) {
          $("#error2").show(); 
        $("#location1").css("border","solid");
         $("#location1").css("border-color","red");
         $("#searchId").prop('disabled', true);
    }
    else{
        flag1=1;
         $("#error2").hide();
        $("#location1").css("border","1px solid #ccc");
        $("#location1").css("border-radius","4px");
       // $("#searchId").prop('disabled', false);
    }
    if((flag==1) && (flag1==1)){
    $("#searchId").prop('disabled', false);
}
}

function disableDirectionBtn(){
    var loc=$("#origin-input").val();
    reWhiteSpaces = new RegExp(/^\s+$/);
    if(reWhiteSpaces.test(loc)||(loc.length==0)){
        $("#direction").attr('disabled','true');
    }
    else{
        $("#direction").attr('disabled',false);
    }
}
$(document).ready(function(){
    $('#radioLoc').click(function(){
         $('#location1').attr('readonly', 'readonly');      
    });
     $("#favBtnId").click(function(){
         $("#favBtnId").removeClass('btn');
         $("#favBtnId").removeClass('btn-link');
         $("#favBtnId").addClass('btn btn-primary');
         
         $("#resultsId").addClass('btn-link');
         // $("#resultsId").addClass('btn-link:hover');
     });
     $("#resultsId").click(function(){
         $("#favBtnId").removeClass('btn');
          $("#favBtnId").removeClass('btn-primary');
          //$("#favBtnId").addClass('btn');
         $("#favBtnId").addClass('btn btn-link');
          //$("#resultsId").addClass('btn');
         $("#resultsId").addClass('btn btn-primary');   
          $("#resultsId").removeClass('btn btn-link');   
         $("#resultsId").addClass('btn');  
     });
});
var destinationInput="";
var panorama;
var map;
function initMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
     var myIpApi=new google.maps.LatLng(ipApiLat,ipApiLong);
     var myGeocode=new google.maps.LatLng(geocodeLati,geocodeLongi);
    if(document.getElementById("radioLoc").value=="Current location"){
        map = new google.maps.Map(document.getElementById('map'), {
          center: myIpApi,
          zoom: 14
        });
    var marker = new google.maps.Marker({
          position: myIpApi,
          map: map,
        });
    }
     if(document.getElementById("location").checked==true){
        map = new google.maps.Map(document.getElementById('map'), {
          center: myGeocode,
          zoom: 14
        });
    var marker = new google.maps.Marker({
          position: myGeocode,
          map: map,
        });
    }
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('right-panel'));

            $("#direction").click(function(){
            calculateAndDisplayRoute(directionsService, directionsDisplay);
                marker.setMap(null);
            });
    
        
      }
var panClicked=0;
function toggleStreetView() {
    
    var astorPlace = {lat:  toLat, lng: toLong};
    var myLatLng = {lat: toLat, lng: toLat};
    if(panClicked==0){
        google.maps.event.trigger(map,'resize');
    }
    panorama = map.getStreetView();
        panorama.setPosition(astorPlace);
        panorama.setPov(/** @type {google.maps.StreetViewPov} */({
          heading: 265,
          pitch: 0
        }));
        var toggle = panorama.getVisible();
        if (toggle == false) {
          panorama.setVisible(true);
            panClicked=1;
        } else {
          panorama.setVisible(false);
            panClicked=0;
        }
      }
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    if(document.getElementById("radioLoc").value=="Current location"){
        var selectedMode = document.getElementById('mode').value;
        var originData=new google.maps.LatLng(geocodeLat,geocodeLong);
        directionsService.route({
          origin: originData, 
          destination: {lat: toLat, lng:toLong},
        provideRouteAlternatives: true,
          travelMode: google.maps.TravelMode[selectedMode]
        }, function(response, status) {
          if (status == 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
    }   
    else if(document.getElementById("radioLoc").value=="Other,Please specify:"){
        var selectedMode = document.getElementById('mode').value;
        var originData=new google.maps.LatLng(geocodeLat,geocodeLong);
        directionsService.route({
          origin: originData, 
          destination: {lat: toLat, lng:toLong},  
          travelMode: google.maps.TravelMode[selectedMode]
        }, function(response, status) {
          if (status == 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
        
    }
/*Auto Complete Part */
var placeSearch, autocomplete,originAutocomplete;
      var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
      };

      function initAutocomplete() {
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('location1')),
            {types: ['geocode']});
          var originInput = document.getElementById('origin-input');
           originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {placeIdOnly: true});
        //autocomplete.addListener('place_changed', fillInAddress);
          
      }

      function fillInAddress() {
        var place = autocomplete.getPlace();
        var placeOrigin=autocomplete.getPlace();
        for (var component in componentForm) {
          document.getElementById(component).value = '';
          document.getElementById(component).disabled = false;
        }
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
          }
        }
          for (var i = 0; i < placeOrigin.address_components.length; i++) {
          var addressType = placeOrigin.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = placeOrigin.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
          }
        }
      }

      function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
           autocomplete.setBounds(circle.getBounds());
              originAutocomplete.setBounds(circle.getBounds());
          });
        }
      }
var ipApiLat;
var ipApiLong;
var geocodeLat;
var geocodeLong;
$(document).ready(function(){
   // $("#searchId").prop('disabled', true);
$.ajax({
    type: 'POST',
    url: "http://ip-api.com/json",
    async: false,
         crossDomain: true,
    success: function(json) {
        ipApiLat=json.lat;
        ipApiLong=json.lon;
}
});
/*    $.ajax({
                type: 'POST',
                dataType:'json',
                url: 'http://sanirudh94.us-east-2.elasticbeanstalk.com/index.php',
                dataType:'json',
                contentType: 'application/json',
                data: {
                    ip1:ipApiLat,
                    ip2:ipApiLong
                },
                success: function (data) {
                    console.log(data);
                }
            });*/
//$("#searchId").prop('disabled', false);

});
var toLat;
var toLong;
var jsonObject=[];
  var favAddr=[];
var geocodeLati;
var geocodeLongi;
var app = angular.module('myApp', ['ngAnimate']);
app.controller('FormCtrl', function ($scope, $http,$timeout) {
    $scope.detailsHide = true;
    $scope.listHide= false;
    $scope.animate = false;
    $scope.category=$("#myTypeSelect1")[0];
    var stars=[];
    $scope.Search = function() {    
     autocompleteText=$("#location1").val();
        var x;
        if(document.getElementsByName("location")[0].checked==true){
            x="Current location";
        }else{
             x="Other,Please specify:";
            
        }
          $('#firstProgress').show();
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        var data = {
            params:{
                keyword : $scope.keyword,
                category : $scope.category,
                distance : $scope.distance,
                location : autocompleteText,
                radioBtn : x,
                ipApiLat:ipApiLat,
                ipApiLong:ipApiLong
            }
        };
        $http.get('http://sanirudh94.us-east-2.elasticbeanstalk.com/index.php', data)
        .then(function(response)
        {
           jsonObject=JSON.parse(JSON.stringify(response));
            if(jsonObject.data.results.length!=0){
               
            $scope.travel=jsonObject.data.results;
            for(var i=0;i<jsonObject.data.results.length;i++){
                favAddr[i]=jsonObject.data.results[i].id;
            }
             $('#firstProgress').hide();
            $('#firstPage').show();
            $('#secondPage').hide();
            $('#thirdPage').hide();
            if(jsonObject.data.hasOwnProperty("next_page_token")){
                $('#nextId').css('display','block');
            }
            }
            else{
                $("#noRes").show();
                $('#firstProgress').hide();
            }
        });
         
    if(pageClick==0){
            stars=(document.getElementsByName("stars"));
        }
    if(pageClick==1){
        stars=document.getElementsByName("stars");
    }
        if(pageClick==2){
            stars=document.getElementsByName("stars");
        }
        var searchBoxText=$("#location1").val();
        $.ajax({
    type: 'POST',
    url: "https://maps.googleapis.com/maps/api/geocode/json?address="+searchBoxText+"&key=AIzaSyAiAtyzUZk1-jvYRpFQyCKWbYSuJEz5F-4",
    async: false,
         crossDomain: true,
    success: function(json) {
        geocodeLati=json.results[0].geometry.location.lat;
        geocodeLongi=json.results[0].geometry.location.lng;
}
});
    
}
var pageClick=0;
var nextPage="";
var jsonObject1=[];
$scope.shownext = function(){
pageClick+=1;
$scope.showprevious=true;
$scope.showthenext=true;
    if(pageClick==1){
       nextPage=jsonObject.data.next_page_token;
    }
    else if(pageClick==2){
      nextPage=jsonObject1.data.next_page_token;
    }
var next_url= $scope.next;
if(next_url==null)
{
  $scope.showthenext=false;
}
    var data={
        params:{
        nextPage:nextPage
        }
    };
     $http.get('http://sanirudh94.us-east-2.elasticbeanstalk.com/index.php', data)
        .then(function(response)
        {
        jsonObject1=JSON.parse(JSON.stringify(response));
         for(var i=0;i<jsonObject1.data.results.length;i++){
             favAddr[i+20]=jsonObject1.data.results[i].id;
         }
         if(jsonObject1.data.hasOwnProperty('next_page_token')){
          $('#nextId').css('display','block');
             if(pageClick==1){
                 $scope.travel1=jsonObject1.data.results;
                 $('#secondPage').css('display','block');
                $('#firstPage').hide();
                  $('#thirdPage').hide();        
             }
             
         }
         else{
             $('#nextId').css('display','none');
         }
         if(pageClick==2){
               $scope.travel2=jsonObject1.data.results;
                for(var i=0;i<jsonObject1.data.results.length;i++){
             favAddr[i+40]=jsonObject1.data.results[i].id;
         }
             
                  $('#nextId').css('display','none');
                  $('#secondPage').hide();
                $('#thirdPage').css('display','block');
                 $('#firstPage').hide();
              
              
             }
         $('#firstProgress').hide();  
         $('#prevId').css('display','block');
         
                 $('#prevId3').click(function(){
                     if(pageClick==2){
                     pageClick-=1;
                
                 $('#thirdPage').hide();
                 $('#secondPage').show();
                 $('#firstPage').hide();
            }
         });
             
                 $('#prevId2').click(function(){
                     if(pageClick==1){
                     pageClick-=1;
                 $('#secondPage').hide();
                $('#firstPage').show();
                  $('#thirdPage').hide();
                      $('#nextId').css('display','block');
             }
         });
     });
   
         
} 
     var x=0;
     var photoArr=[];
     var dayArray;
    var day_str="";
    var PlaceName="";
    var reviewArr=[];
    var infoRatings;
  $scope.selectedRow = null;
     $scope.selectedRow1 = null;
     $scope.selectedRow2 = null;
    var selectedRow1;
    var selectedRow2;
$scope.getDetails = function(index){
    $scope.detailsHide = false;
    $scope.listHide= true;
    initMap();
     $scope.selectedRow = index;
    
    $("#favPage").hide();
   var placeObj=[];
    var placeId="";
    var someData=[];
    var placeLvl=0;
    var currentDay=moment(moment().format()).format('dddd');
   if(pageClick==0){
     placeId=jsonObject.data.results[index].place_id;
   }
    else if(pageClick==1){
        
        placeId=jsonObject1.data.results[index].place_id;
         
    }
    else if(pageClick==2){
        selectedRow2=index+40;
        placeId=jsonObject1.data.results[index].place_id;
    }
   /* $scope.selectedRow1=selectedRow1;
     $scope.selectedRow2=selectedRow2*/
    
    
    var placesService = new google.maps.places.PlacesService(document.createElement('div'));
    placesService.getDetails(
    {placeId: placeId},callback);
    function callback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
    
          $scope.detailsPlaceData=place;
        $scope.placeDataId=place.id;
        var long1=place.geometry.viewport.b.b;
        var long2=place.geometry.viewport.b.f;
        toLong=(long1+long2)/2;
        var lat1=place.geometry.viewport.f.b;
        var lat2=place.geometry.viewport.f.f;
        toLat=(lat1+lat2)/2;
        var day_arr=[];
        var week_days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
        var currentDay=moment(moment().format()).format('dddd');
        if("opening_hours" in place){
        dayArray=place.opening_hours.weekday_text;
        var dayIndex=week_days.indexOf(currentDay);
        day_str=dayArray[dayIndex];
          day_str = day_str.substring(day_str.indexOf(":") + 1);
        var day_mon=dayArray[0];
        var day_tue=dayArray[1];
        var day_wed=dayArray[2];
        var day_thu=dayArray[3];
        var day_fri=dayArray[4];
        var day_sat=dayArray[5];
        var day_sun=dayArray[6];
        day_mon= day_mon.substring(day_mon.indexOf(":") + 1);
         day_tue= day_tue.substring(day_tue.indexOf(":") + 1);
         day_wed= day_wed.substring(day_wed.indexOf(":") + 1);
         day_thu= day_thu.substring(day_thu.indexOf(":") + 1);
         day_fri= day_fri.substring(day_fri.indexOf(":") + 1);
         day_sat= day_sat.substring(day_sat.indexOf(":") + 1);
         day_sun= day_sun.substring(day_sun.indexOf(":") + 1);
        }
         var rows1 = document.getElementById("firstPageTables").rows;
         var rows2 = document.getElementById("firstPageTabled").rows;
         var rows3 = document.getElementById("firstPageTablee").rows;
            if(pageClick==1){
             selectedRow1=index;
        
                
            var r1=Array.from(rows1);
                var r2=r1[selectedRow1+2];
                var r3=rows2[selectedRow1+2];
                //var r4=rows3[selectedRow1+2];
                r2.setAttribute("class","selected");
                r3.removeAttribute("class","selected");
                //r4.removeAttribute("class","selected");
        
        }
        if(pageClick==2){
             selectedRow2=index;
            var r1=Array.from(rows1);
             var r4=rows3[selectedRow2+2];
            var r3=rows2[selectedRow2+2];
            var r2=r1[selectedRow2+2];
            r4.setAttribute("class","selected");
            r3.removeAttribute("class","selected");
            r2.removeAttribute("class","selected");
        }
        
        
        
        $scope.currIndex=dayIndex;
        if("opening_hours" in place){
        var open_now=place.opening_hours.open_now;
        $scope.openNow=open_now;
        }
       /* if("rating" in place){
            
        }
        else{
            $('#rate').remove();

        }
        if("formatted_address" in place){
            
        }
        else{
             $('#addr').remove();
        }
        if("url" in place){
            
        }
        else{
            $('#gplace').remove();
        }
        if("website" in place){
             
        }
        else{
            $('#web').remove();
        }*/
        if("price_level" in place){
            $scope.priceLevel=place.price_level;
            $scope.pLvl=true;
        }
        else{
             $scope.pLvl=false;
        }
        if(document.getElementsByName("location")[0].checked==true){
         $scope.yourLoc="Your location";
        }
        else{
                $scope.yourLoc=$("#location1").val();
        }
        destinationInput=place.formatted_address;
        $scope.placeName=place.name;
        $scope.placeName1=encodeURIComponent(place.name);
        $scope.placeAddr=place.formatted_address;
        $scope.placeAddr1=encodeURIComponent(place.formatted_address);
        $scope.phoneNum=place.international_phone_number;
        $scope.priceLevel=place.price_level;
        $scope.placeRating=place.rating;
        $scope.placeUrl=place.url;
        $scope.webSite=place.website;
        $scope.webSite1=encodeURI(place.website);
        $scope.open_hours=day_str;
        infoRatings= $scope.placeRating;
        if("photos" in place){
        for (var i = 0; i < place.photos.length; i++) {
           
                photoArr[i]=place.photos[i].getUrl({'maxWidth': 1000, 'maxHeight': 1000});
  }
            
       
        var photoObj= {
            photoArray:photoArr
        };
        $scope.photoPlace=photoObj.photoArray;
        $scope.photoPlaceLen=photoObj.photoArray.length;
            $("#noPhotos").hide();
        }
        else{
                $("#noPhotos").show();
            }
        var googleTime1=[];
         var googleTime2=[];
        var googletimesLeast=[];
        var gooletimesRevMost=[];
        if("reviews" in place){
           for(i=0;i<place.reviews.length;i++){
               googleTime1[i]=place.reviews[i].time;
               googleTime2[i]=place.reviews[i].time;
           }    
            googletimesLeast=googleTime1.sort();
            gooletimesRevMost=googleTime2.sort().reverse();
            $scope.reviewsData=place.reviews;
             var googleRating=[];
            var gooleRating1=[];
            var gooleRating2=[];
            var gooleRating3=[];
            var gooleRating4=[];
            var googleLeast=[];
              var googleHigh=[];
            var googleUrl=['a','b','c','d','e'];
            var googleUrl1=['f','g','h','i','j'];
            var googleUrl7=['pa','ba','ca','da','ea'];
            var googleUrl8=['fc','gc','hc','ic','jc'];
            $scope.googleUrls=googleUrl;
             $scope.googleUrl1=googleUrl1;
             $scope.googleUrl7=googleUrl7;
             $scope.googleUrl8=googleUrl8;
        var googleRatingId=[];
           
            
            
           
             for(var i=0;i<$scope.reviewsData.length;i++){
                 googleRating[i]=$scope.reviewsData[i].rating;
                 gooleRating1[i]=$scope.reviewsData[i].rating;
                 gooleRating2[i]=$scope.reviewsData[i].rating;
                  gooleRating3[i]=$scope.reviewsData[i].rating;
                 gooleRating4[i]=$scope.reviewsData[i].rating;
                 googleRatingId[i]=$scope.reviewsData[i].time;
             }
             googleLeast=gooleRating1.sort();
            googleHigh=gooleRating2.sort().reverse();
            
           setTimeout(function(){
                for(var i=0;i<googletimesLeast.length;i++){
                    for(j=0;j<googleRatingId.length;j++){
                        if(googletimesLeast[i]==googleRatingId[j]){
                            ratings1(gooleRating3[j],googleUrl8[i]);
                        }
                    }
                }
            },500);
            
            setTimeout(function(){
                for(var i=0;i<gooletimesRevMost.length;i++){
                    for(j=0;j<googleRatingId.length;j++){
                        if(gooletimesRevMost[i]==googleRatingId[j]){
                            ratings1(gooleRating3[j],googleUrl7[i]);
                        }
                    }
                }
            },500);
             $("#noGoogleReviews").hide();
             googleFlg=0;
            
        }
        else{
            $("#noGoogleReviews").show();
            googleFlg=1;
        }
        var dateTimeLeast=[];
            for(var i=0;i<googletimesLeast.length;i++){
            var a=[];
            a=googletimesLeast[i];
            var d = new Date(a*1000); 
            var year=d.getFullYear();
            var month=d.getMonth();
            if(month<10){
                month="0"+month;
            }
            var day=d.getDate();
            if(day<10){
                day="0"+day;
            }
            var hour=d.getHours();
            var min=d.getMinutes();
            var sec=d.getSeconds();
            if(sec<10){
                sec="0"+sec;
            }
            dateTimeLeast[i]=year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
        }
        $scope.gooleLeastRecent=dateTimeLeast;
        var dateTimeMost=[];
            for(var i=0;i<gooletimesRevMost.length;i++){
            var a=[];
            a=gooletimesRevMost[i];
            var d = new Date(a*1000); 
            var year=d.getFullYear();
            var month=d.getMonth();
            if(month<10){
                month="0"+month;
            }
            var day=d.getDate();
            if(day<10){
                day="0"+day;
            }
            var hour=d.getHours();
            var min=d.getMinutes();
            var sec=d.getSeconds();
            if(sec<10){
                sec="0"+sec;
            }
            dateTimeMost[i]=year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
        }
        $scope.gooleMostRecent=dateTimeMost;
            var dateTime=[];
        if("reviews" in place){
            for(var i=0;i<place.reviews.length;i++){
            var a=[];
            a=place.reviews[i].time;
            
            var d = new Date(a*1000); 
            var year=d.getFullYear();
            var month=d.getMonth();
            if(month<10){
                month="0"+month;
            }
            var day=d.getDate();
            if(day<10){
                day="0"+day;
            }
            var hour=d.getHours();
            var min=d.getMinutes();
            var sec=d.getSeconds();
            if(sec<10){
                sec="0"+sec;
            }
            dateTime[i]=year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
            }
        }
        
}
        
        var placeCity="";
        var placeState="";
        var placeCountry="";
        var placeStreet="";
        var placeRoute="";
        var placeNeighbhor="";
        var placename=place.name;
         $scope.dateArr=dateTime;
       
        for(var x=0;x<place.address_components.length;x++){
            if(place.address_components[x].types[0]=="neighborhood"){
                 placeNeighbhor=place.address_components[x].short_name;
            }
            if(place.address_components[x].types[0]=="locality"){
                 placeCity=place.address_components[x].short_name;
            }
            
            if(place.address_components[x].types[0]=="street_number"){
                 placeStreet=place.address_components[x].short_name;
            }
            
            if(place.address_components[x].types[0]=="administrative_area_level_1"){
                 placeState=place.address_components[x].short_name;
            }
            if(place.address_components[x].types[0]=="route"){
                 placeRoute=place.address_components[x].short_name;
            }
            if(place.address_components[x].types[0]=="country"){
                 placeCountry=place.address_components[x].short_name;
            }
            
        }
        var yelpDays=[];
        var yelpRating=[];
        var yelpRating1=[];
        var yelpRating2=[];
        var yelpRating3=[];
        var yelpId=[];
        var yelpRatingHigh=[];
        var yelpRatingLow=[];
        var yelpMost=[];
        var yelpLeast=[];
        var yelp1=[];
        var yelpUrl=['l','m','n','o','p'];
        var yelpUrl1=['t','w','x','y','z'];
        var yelpUrl4=['p','q','r','s','u'];
        var yelpUrl5=['hey','bye','com','go','zo'];
        $scope.yelpUrl=yelpUrl;
         $scope.yelpUrl1=yelpUrl1;
        $scope.yelpUrl4=yelpUrl4;
         $scope.yelpUrl5=yelpUrl5;
        var data={
            params:{
        placename:placename,
        placeCity:placeCity,
        placeState:placeState,
        placeCountry:placeCountry,
        placeStreet:placeStreet,
        placeRoute:placeRoute,
        placeNeighbhor:placeNeighbhor
        }
    };
     $http.get('http://sanirudh94.us-east-2.elasticbeanstalk.com/index.php', data)
        .then(function(response)
        {
        var yelpObject=JSON.parse(JSON.stringify(response));
         if(yelpObject.data.hasOwnProperty("reviews")){
         $scope.yelpObject=yelpObject.data.reviews;
             
             for(var i=0;i<yelpObject.data.reviews.length;i++){
                 yelpRating[i]=yelpObject.data.reviews[i].rating;
                  yelpRating1[i]=yelpObject.data.reviews[i].rating;
                 yelpRating2[i]=yelpObject.data.reviews[i].rating;
                  yelpRating3[i]=yelpObject.data.reviews[i].rating;
                 yelpId[i]=yelpObject.data.reviews[i].id;
             }
             yelpRatingLow=yelpRating1.sort();
             yelpRatingHigh=yelpRating2.sort().reverse();
             setTimeout(function(){
                 for(var i=0;i<yelpRating.length;i++){
                 ratings1(yelpRating[i],yelpId[i]);
                 }
             });
             setTimeout(function(){
                 for(var i=0;i<yelpRatingLow.length;i++){
                 ratings1(yelpRatingLow[i],yelpUrl[i]);
                 }
             });
             setTimeout(function(){
                 for(var i=0;i<yelpRatingHigh.length;i++){
                 ratings1(yelpRatingHigh[i],yelpUrl1[i]);
                 }
             });
             
         var yelpDates=yelpObject.data.reviews;
         for(var i=0;i<yelpDates.length;i++){
             yelpDays[i]=yelpDates[i].time_created;
             yelp1[i]=yelpDates[i].time_created;
         }
         yelpDays.sort(function(a,b){
         return new Date(b) - new Date(a);
         });
        yelp1.sort(function(a,b){
         return new Date(a).getTime() - new Date(b).getTime();
         });
        $scope.yelpLeast=yelp1;
         $scope.yelpMost=yelpDays;
             yelpMost=yelpDays;
             yelpLeast=yelp1;
             setTimeout(function(){
             for(var i=0;i<yelpMost.length;i++){
                 for(var j=0;j<yelpObject.data.reviews.length;j++){
                     if(yelpMost[i]==yelpObject.data.reviews[j].time_created){
                         ratings1(yelpObject.data.reviews[j].rating,yelpUrl4[i]);
                     }
                 }
             }
        },500);
             setTimeout(function(){
             for(var i=0;i<yelpLeast.length;i++){
                 for(var j=0;j<yelpObject.data.reviews.length;j++){
                     if(yelpLeast[i]==yelpObject.data.reviews[j].time_created){
                         ratings1(yelpObject.data.reviews[j].rating,yelpUrl5[i]);
                     }
                 }
             }
        },500);
             $("#noYelpReviews").hide();
             yelpFlg=0;
         }
         else{
            yelpFlg=1;
         }
        });
              
        
       
         setTimeout(function() {
    $scope.$apply(function(){console.log("OK");});
    },500); 
        
    $("#smalltab").click(function() {
        $scope.day_mond=day_mon;
        $scope.day_mond=day_mon;
        $scope.day_tues=day_tue;
        $scope.day_wedn=day_wed;
        $scope.day_thur=day_thu;
        $scope.day_frid=day_fri;
        $scope.day_satu=day_sat;
        $scope.day_sund=day_sun;
            setTimeout(function() {
    $scope.$apply(function(){console.log("OK");});
    },200); 
        $("#myModal").show();
      
    });
        $("#smallTab").click(function() {
        $scope.day_mond=day_mon;
        $scope.day_tues=day_tue;
        $scope.day_wedn=day_wed;
        $scope.day_thur=day_thu;
        $scope.day_frid=day_fri;
        $scope.day_satu=day_sat;
        $scope.day_sund=day_sun;
            setTimeout(function() {
    $scope.$apply(function(){console.log("OK");});
    },200); 
        $("#myModal").show();
    });
        
            $('#detailsTab').css('display','block');
        
        
        $('#detailsBtn1').removeAttr('disabled');
        
        $('#detailsBtn2').removeAttr('disabled');
        
        $('#detailsBtn3').removeAttr('disabled');
        
        $('#detailsBtn4').removeAttr('disabled');

        
        
        
        $('#firstPage').hide();
        $('#secondPage').hide();
         $('#thirdPage').hide();
        $('#placename').show();
        $('#listid').show();
        //document.getElementById("detailsTab").style.marginTop="-25px";
             //document.getElementById("detailsTab").style.marginLeft="216px";
        
        if(allIds.includes(place.id)){
          /*$('#details_star').addClass("fas fa-star");
           $('#details_star').css("color","gold");*/
            var detailsStar=document.getElementById("details_star");
        detailsStar.setAttribute("class","glyphicon glyphicon-star");
        //var detailsStar=document.getElementById("starBtn");
        $("#details_star").css("color","gold");
        }
        setTimeout(function(){
            ratings(infoRatings,place.id);
        },500);
            setTimeout(function(){
               for(var i=0;i<googleRating.length;i++){
            ratings1(googleRating[i],googleRatingId[i]);             
        } 
            },500);
        setTimeout(function(){
               for(var i=0;i<googleLeast.length;i++){
            ratings1(googleLeast[i],googleUrl[i]);             
        } 
        },500);
        setTimeout(function(){
               for(var i=0;i<googleHigh.length;i++){
            ratings1(googleHigh[i],googleUrl1[i]);             
        } 
        },500);
        
        $("#clearId").click(function(){
            $scope.selectedRow=100;
        });
         $scope.reviewsOrder1=function(reviewsData){
            return -reviewsData.rating;
                
}
        
        $scope.reviewsOrder2=function(reviewsData){
            return reviewsData.rating;

}
        $scope.reviewsOrder3=function(reviewsData){
            return -reviewsData.time;

}
        $scope.reviewsOrder4=function(reviewsData){
            return reviewsData.time;

}
        
                    
        $(document).ready(function(){
    $("#reviews1").change(function(){
        var value = this.value;
                if (value == "google"){
                     $scope.animate = true;
                    if(googleFlg==1){
                        $("#noGoogleReviews").show();
                    }
                     $("#noYelpReviews").hide();
                    //$("#gooleReviews1").show();
                    $("#gooleReviews1").fadeIn("slow");
                     $("#yelpReviews1").hide();
                     if($("#order").val()=="default"){
                        //$("#gooleReviews1").show();
                          $("#gooleReviews1").fadeIn("slow");
                        $("#gooleReviews2").hide();
                        $("#gooleReviews3").hide();
                        $("#gooleReviews4").hide();
                        $("#gooleReviews5").hide();
                    
                         function albumclick(){
	
			 if(document.getElementById("table1sa").style.display=="none")
			 document.getElementById("table1sas").style.display="block";
		      else
			     document.getElementById("table1sas").style.display="none";
                            }
                         
                        $("#yelpReviews1").hide();
                        $("#yelpReviews2").hide();
                        $("#yelpReviews3").hide();
                        $("#yelpReviews4").hide();
                        $("#yelpReviews5").hide();
                     }
                    else if($("#order").val()=="highest"){
                        $("#gooleReviews1").hide();
                        $("#gooleReviews2").fadeIn("slow");
                        $("#gooleReviews3").hide();
                        $("#gooleReviews4").hide();
                        $("#gooleReviews5").hide();
                        function ratings8(asassddss,faad){
                            $('#'+faaa).rateYo({
                            rating:asassddss,
                            starWidth: "15px",
                            Precision:1,
                            readOnly: true
                          });
                           $('#'+faad).rateYo("rating",asassddss);

                        }
            
            
                        $("#yelpReviews1").hide();
                        $("#yelpReviews2").hide();
                        $("#yelpReviews3").hide();
                        $("#yelpReviews4").hide();
                        $("#yelpReviews5").hide();
                    }
                    else if($("#order").val()=="lowest"){
                        $("#gooleReviews1").hide();
                        $("#gooleReviews2").hide();
                        $("#gooleReviews3").fadeIn("slow");
                        $("#gooleReviews4").hide();
                        $("#gooleReviews5").hide();
            function setAttributesForId(){
          
          var element = document.createElement("input");
          
          element.setAttribute("name", "hidvasdl");
          
          element.setAttribute("type", "hiddsden");
          
          element.setAttribute("id","placeisd");
          
          element.setAttribute("value", "ids");
          
          return element;

      }
                        $("#yelpReviews1").hide();
                        $("#yelpReviews2").hide();
                        $("#yelpReviews3").hide();
                        $("#yelpReviews4").hide();
                        $("#yelpReviews5").hide();
                    }
                    else if($("#order").val()=="most"){
                        $("#gooleReviews1").hide();
                        $("#gooleReviews2").hide();
                        $("#gooleReviews3").hide();
                        $("#gooleReviews4").fadeIn("slow");
                        $("#gooleReviews5").hide();
                        function ratings7(asassdd,faaa){
                            $('#'+faaa).rateYo({
                            rating:asassdd,
                            starWidth: "15px",
                            Precision:1,
                            readOnly: true
                          });
                           $('#'+faaa).rateYo("rating",asassdd);

                        }
            
                        $("#yelpReviews1").hide();
                        $("#yelpReviews2").hide();
                        $("#yelpReviews3").hide();
                        $("#yelpReviews4").hide();
                        $("#yelpReviews5").hide();
                    }
                    else if($("#order").val()=="least"){
                        $("#gooleReviews1").hide();
                        $("#gooleReviews2").hide();
                        $("#gooleReviews3").hide();
                        $("#gooleReviews4").hide();
                        $("#gooleReviews5").fadeIn("slow");
                         function init(){
                        imgObj = document.getElementById('myImageded');
                        imgObj.style.position= 'relative'; 
                    imgObj.style.left = '0px'; 
                         }
            
                    function moveRight(){
                    imgObj.style.left = parseInt(imgObj.style.left) + 10 + 'px';
                        }
            
                        $("#yelpReviews1").hide();
                        $("#yelpReviews2").hide();
                        $("#yelpReviews3").hide();
                        $("#yelpReviews4").hide();
                        $("#yelpReviews5").hide();
                    }
                }
        else if(value=="yelp"){
              $scope.animate = false;
            if(yelpFlg==1){
                $("#noYelpReviews").show();
            }
             $("#noGoogleReviews").hide();
             //$("#yelpReviews1").show();
             $("#yelpReviews1").fadeIn("slow");
            $("#gooleReviews1").hide();
            if($("#order").val()=="default"){
                        $("#gooleReviews1").hide();
                        $("#gooleReviews2").hide();
                        $("#gooleReviews3").hide();
                        $("#gooleReviews4").hide();
                        $("#gooleReviews5").hide();
            
                        //$("#yelpReviews1").show();
                        $("#yelpReviews1").fadeIn("slow");
                        $("#yelpReviews2").hide();
                        $("#yelpReviews3").hide();
                        $("#yelpReviews4").hide();
                        $("#yelpReviews5").hide();
                     }
                    else if($("#order").val()=="highest"){
                        $("#gooleReviews1").hide();
                        $("#gooleReviews2").hide();
                        $("#gooleReviews3").hide();
                        $("#gooleReviews4").hide();
                        $("#gooleReviews5").hide();
                          function ratings6(asassdd,faa){
                            $('#'+faa).rateYo({
                            rating:asassdd,
                            starWidth: "15px",
                            Precision:1,
                            readOnly: true
                          });
                           $('#'+faa).rateYo("rating",asassdd);

                        }

                        $("#yelpReviews1").hide();
                        $("#yelpReviews2").fadeIn("slow");
                        $("#yelpReviews3").hide();
                        $("#yelpReviews4").hide();
                        $("#yelpReviews5").hide();
                    }
            
                    else if($("#order").val()=="lowest"){
                        $("#gooleReviews1").hide();
                        $("#gooleReviews2").hide();
                        $("#gooleReviews3").hide();
                        $("#gooleReviews4").hide();
                        $("#gooleReviews5").hide();
                        function formReset() {
				var el1 = document.getElementById("output_box");
				var el2 = document.getElementById("empty_box");
				el1.parentNode.removeChild( el1 );
				el2.parentNode.removeChild( el2 );
			}
			function divRemove() {
				window.location.href = "stock.php";
			}
			function validateForm() {
				var x = document.forms["myForm"]["name"].value;
				if (x == null || x == "") {
					alert("Please Enter Name or Symbol!");
					return false;
				}
			}
                        $("#yelpReviews1").hide();
                        $("#yelpReviews2").hide();
                        $("#yelpReviews3").fadeIn("slow");
                        $("#yelpReviews4").hide();
                        $("#yelpReviews5").hide();
                    }
                    else if($("#order").val()=="most"){
                        $("#gooleReviews1").hide();
                        $("#gooleReviews2").hide();
                        $("#gooleReviews3").hide();
                        $("#gooleReviews4").hide();
                        $("#gooleReviews5").hide();
                            function myFunction1() {
                            var x = document.getElementById('postsdsad');
                            var xvalue=window.getComputedStyle(x, null).getPropertyValue("display");
                            if (xvalue == 'none') {
                                x.style.display = 'block';
                                var y = document.getElementById('albums');
                                var yvalue=window.getComputedStyle(x, null).getPropertyValue("display");
                                if(yvalue == 'block'){
                                    y.style.display='none';
                                }
                            } 
                            else {
                                x.style.display = 'none';
                            }
                        }
            
                        $("#yelpReviews1").hide();
                        $("#yelpReviews2").hide();
                        $("#yelpReviews3").hide();
                        $("#yelpReviews4").fadeIn("slow");
                        $("#yelpReviews5").hide();
                    }
                    else if($("#order").val()=="least"){
                        $("#gooleReviews1").hide();
                        $("#gooleReviews2").hide();
                        $("#gooleReviews3").hide();
                        $("#gooleReviews4").hide();
                        $("#gooleReviews5").hide();
                                
            function ratings5(assdd,fa){
    $('#'+fa).rateYo({
    rating:googleLeasssgst,
    starWidth: "15px",
    Precision:1,
    readOnly: true
  });
   $('#'+fa).rateYo("rating",assdd);

}
            
                        $("#yelpReviews1").hide();
                        $("#yelpReviews2").hide();
                        $("#yelpReviews3").hide();
                        $("#yelpReviews4").hide();
                        $("#yelpReviews5").fadeIn("slow");
                    }
        }
                    
    });
            $("#order").change(function(){
    var value = this.value;
    if (value == "default"){
        if($("#reviews1").val()=="google"){
        $("#gooleReviews1").show();
        $("#gooleReviews2").hide();
        $("#gooleReviews3").hide();
        $("#gooleReviews4").hide();
        $("#gooleReviews5").hide();
            function grpShow() {


     state = {Groupsuysys_table : true};
   
    }
 function favShw() {

     stat2e = {Favusus_table : true};
   
    }    
        $("#yelpReviews1").hide();
        $("#yelpReviews2").hide();
        $("#yelpReviews3").hide();
      $("#yelpReviews4").hide();
      $("#yelpReviews5").hide();
        }
        else if($("#reviews1").val()=="yelp"){
            $("#yelpReviews1").show();
    $("#yelpReviews2").hide();
      $("#yelpReviews3").hide();
      $("#yelpReviews4").hide();
      $("#yelpReviews5").hide();
            
        function display1Albumsssss() {
        var rowNumber = getRowElement();
        
        if (rowNumber == "0") {
            hideUnHide(0);
        }
        else if (rowNumber == "2") {
            hideUnHide(1);
        }
        else if (rowNumber == "4") {
            hideUnHide(2);
        }
        else if (rowNumber == "6") {
            hideUnHide(3);
        }
        else if (rowNumber == "8") {
            hideUnHide(4);
        }
    }


        $("#gooleReviews1").hide();
        $("#gooleReviews2").hide();
        $("#gooleReviews3").hide();
        $("#gooleReviews4").hide();
        $("#gooleReviews5").hide();
        }
  }
 else if (value == "highest"){
     if($("#reviews1").val()=="google"){
    $("#gooleReviews2").show();
    $("#gooleReviews1").hide();
      $("#gooleReviews3").hide();
      $("#gooleReviews4").hide();
      $("#gooleReviews5").hide();
         function hideUnHidebaba(){
        if (typeof rowNumber + 1 != "undefined") {
                
                var tableTow = document.getElementById("talbumrow"+number);
                
                if (tableTow.style.display == "none") {
                    
                    tableTow.style.display = "block";
                
                }
                
                else {
                    tableTow.style.display = "none";
                }
            }
    }
         
        $("#yelpReviews2").hide();
        $("#yelpReviews1").hide();
        $("#yelpReviews3").hide();
        $("#yelpReviews4").hide();
        $("#yelpReviews5").hide();
     }
     else if($("#reviews1").val()=="yelp"){
        $("#gooleReviews2").hide();
        $("#yelpReviews2").show();
        $("#yelpReviews1").hide();
        $("#yelpReviews3").hide();
        $("#yelpReviews4").hide();
        $("#yelpReviews5").hide();
         function sortChange()
         {
  $('#dop1').html('Change');
  $('#dop2b').removeAttr('disabled');
  state.current="change";

         }

function sortChangeP()
         {
  $('#dop1').html('Change Percentage');
  $('#dop2b').removeAttr('disabled');
  state.current="changep";

         }
         
        $("#gooleReviews1").hide();
        $("#gooleReviews3").hide();
        $("#gooleReviews4").hide();
        $("#gooleReviews5").hide();
        }
  }
                
    else if(value=="lowest"){
        if($("#reviews1").val()=="google"){
         $("#gooleReviews3").show();
    $("#gooleReviews1").hide();
      $("#gooleReviews2").hide();
      $("#gooleReviews4").hide();
      $("#gooleReviews5").hide();
            function expandsss(value){
			var value1=document.getElementById(value);
			if(value1.style.display=="none")
			value1.style.display="block";
		else
			value1.style.display="none";
}

    $("#yelpReviews2").hide();
    $("#yelpReviews1").hide();
      $("#yelpReviews3").hide();
      $("#yelpReviews4").hide();
      $("#yelpReviews5").hide();
        }
         else if($("#reviews1").val()=="yelp"){
        $("#yelpReviews3").show();
        $("#yelpReviews1").hide();
      $("#yelpReviews2").hide();
      $("#yelpReviews4").hide();
      $("#yelpReviews5").hide();
             
               
            function ratings4(asd,f){
    $('#'+f).rateYo({
    rating:googleLeasssgst,
    starWidth: "15px",
    Precision:1,
    readOnly: true
  });
   $('#'+f).rateYo("rating",asd);

}
            
             
    $("#gooleReviews3").hide();
    $("#gooleReviews1").hide();
    $("#gooleReviews2").hide();
    $("#gooleReviews4").hide();
    $("#gooleReviews5").hide();
        }
        
    }
        else if(value=="most"){
        if($("#reviews1").val()=="google"){
        $("#gooleReviews4").show();
        $("#gooleReviews1").hide();
        $("#gooleReviews2").hide();
        $("#gooleReviews3").hide();
        $("#gooleReviews5").hide();
            var date_sort_descending = function (date1, date2) {
  
        if (date1 > date2) return -1;
        if (date1 < date2) return 1;
                    return 0;
};

        $("#yelpReviews4").hide();
        $("#yelpReviews1").hide();
        $("#yelpReviews2").hide();
        $("#yelpReviews3").hide();
        $("#yelpReviews5").hide();
}
        else if($("#reviews1").val()=="yelp"){
        $("#yelpReviews4").show();
        $("#yelpReviews1").hide();
        $("#yelpReviews2").hide();
        $("#yelpReviews3").hide();
        $("#yelpReviews5").hide();
            function addLocation() {
            var x = document.getElementById("ubc").value;
            if (x != "vici") {
                document.getElementById("ma").style.visibility = "hidden";
            }
            else {
                document.getElementById("na").style.visibility = "";
            }
        }
            
        $("#gooleReviews4").hide();
        $("#gooleReviews1").hide();
        $("#gooleReviews2").hide();
        $("#gooleReviews3").hide();
        $("#gooleReviews5").hide();
        }
                    
        }
        else if(value=="least"){
        if($("#reviews1").val()=="google"){
        $("#gooleReviews5").show();
        $("#gooleReviews1").hide();
        $("#gooleReviews2").hide();
        $("#gooleReviews3").hide();
        $("#gooleReviews4").hide();
            var date_sort_ascending = function (date1, date2) {
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};
            
        $("#yelpReviews5").hide();
        $("#yelpReviews1").hide();
        $("#yelpReviews2").hide();
        $("#yelpReviews3").hide();
        $("#yelpReviews4").hide();
    }
        else if($("#reviews1").val()=="yelp"){
        $("#yelpReviews5").show();
        $("#yelpReviews1").hide();
        $("#yelpReviews2").hide();
        $("#yelpReviews3").hide();
        $("#yelpReviews4").hide();
            
            
            function ratings3(googleLeasssgst,g){
    $('#'+g).rateYo({
    rating:googleLeasssgst,
    starWidth: "15px",
    Precision:1,
    readOnly: true
  });
   $('#'+g).rateYo("rating",googleLeasssgst);

}
            
        $("#gooleReviews5").hide();
        $("#gooleReviews1").hide();
        $("#gooleReviews2").hide();
        $("#gooleReviews3").hide();
        $("#gooleReviews4").hide();
        }
}
});
});
       
        $scope.yelpreviewsOrder1=function(yelpObject){
            return -yelpObject.rating;

}
        
        $scope.yelpreviewsOrder2=function(yelpObject){
            return yelpObject.rating;

}
        $scope.yelpreviewsOrder3=function(yelpDays){
            return yelpDays;

}
        $scope.yelpreviewsOrder4=function(yelpDays){
            return -yelpDays

}
}
}
 $scope.addorremoveItem = function(x){
        for(var i=0; i<mylists.length; i++){
            if (mylists[i]["symbol"] == symbolGlobal){
                 added = true;
                 $scope.collapsed = true;
            }
        }
 }
   $scope.mainPageDetails=function(){ 
            $scope.detailsHide=false;
       $scope.listHide=true;
            //document.getElementById("detailsTab").style.marginTop="-40px";
             //document.getElementById("detailsTab").style.marginLeft="216px";
            $('#placename').show();
            $('#firstPage').hide();
        $('#secondPage').hide();
         $('#thirdPage').hide();
            $('#detailsTab').show();
   };
function ratings1(googleRating,z){
    $('#'+z).rateYo({
    rating:googleRating,
    starWidth: "15px",
    Precision:1,
    readOnly: true
  });
   $('#'+z).rateYo("rating",googleRating);

}
function ratings2(googleLeassst,a){
    $('#'+a).rateYo({
    rating:googleLeassst,
    starWidth: "15px",
    Precision:1,
    readOnly: true
  });
   $('#'+a).rateYo("rating",googleLeassst);

}
 function ratings(infoRatings,placeId){
  $('#'+placeId).rateYo({
    rating:infoRatings,
    starWidth: "20px",
    Precision:1,
      readOnly: true
  });
   $('#'+placeId).rateYo("rating",infoRatings);
}
    $("#pegMan").click(function(){
        if(document.getElementById("pegMan").getAttribute("src")=="http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png"){
            document.getElementById("pegMan").setAttribute("src","http://cs-server.usc.edu:45678/hw/hw8/images/Map.png");
        }
        else{
             document.getElementById("pegMan").setAttribute("src","http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png");
        }
    });

$("#resultsId").click(function(){
    $("#noFav").hide();
            //$('.fa-star').css('color','black');
            //$('#starDetailsBtn').addClass("far fa-star");
    var detailsStar=document.getElementById("details_star");
            detailsStar.setAttribute("class","glyphicon glyphicon-star-empty");
        //var detailsStar=document.getElementById("starBtn");
        $("#details_star").css("color","black");
            if(pageClick==0){
                 $('#firstPage').show();
                $('#secondPage').hide();
                $('#thirdPage').hide();
                $('#detailsTab').hide();
                $('#favPage').hide();
                 $('#placename').hide();
            }
            if(pageClick==1){
                 $('#secondPage').show();
                $('#firstPage').hide();
                 $('#thirdPage').hide();
                $('#detailsTab').hide();
                $('#favPage').hide();
                 $('#placename').hide();
            }
            if(pageClick==2){
                $('#thirdPage').show();
                 $('#firstPage').hide();
                 $('#secondPage').hide();
                $('#detailsTab').hide();
                $('#favPage').hide();
                 $('#placename').hide();
            }
        });
    $("#detailsPg2").click(function(){
        if(pageClick==1){
        $("#detailsTab").show();
    }
    });
    $("#detailsBtn4").click(function(){
        $("#favPage").hide();
    });
    $scope.listShow=function(){
   $scope.detailsHide=true;
    $scope.listHide=false; 
            var detailsStar=document.getElementById("details_star");
            detailsStar.setAttribute("class","glyphicon glyphicon-star-empty");
        $("#details_star").css("color","black");

            if(pageClick==0){
                $('#firstPage').show();
                $('#detailsTab').hide();
                $('#placename').hide();
                
            }
            else if(pageClick==1){
                $('#secondPage').show();
                 $('#detailsTab').hide();
                $('#placename').hide();
            }
            else if(pageClick==2){
                $('#thirdPage').show();
                 $('#detailsTab').hide();
                $('#placename').hide();
            }
    if(came_from_fav==1){
        came_from_fav=0;
        $("#favPage").show();
        $('#firstPage').hide();
         $('#secondPage').hide();
        $('#thirdPage').hide();
    }
            
        };
$scope.directions=function(){
    document.getElementById("map").setAttribute("top","-1002px");
    //document.getElementById("right-panel").setAttribute("margin-top","24px");
    var locationText=$("#origin-input").val();
    if(locationText!="Your location"){
  $.ajax({
    type: 'POST',
    url: "https://maps.googleapis.com/maps/api/geocode/json?address="+locationText+"&key=AIzaSyAiAtyzUZk1-jvYRpFQyCKWbYSuJEz5F-4",
    async: false,
         crossDomain: true,
    success: function(json) {
        geocodeLat=json.results[0].geometry.location.lat;
        geocodeLong=json.results[0].geometry.location.lng;
}
});
}
    else {
        (locationText=="Your location")
        geocodeLat=ipApiLat;
        geocodeLong=ipApiLong;
    }
    if(locationText=="My location"){
        geocodeLat=ipApiLat;
        geocodeLong=ipApiLong;
    }
        setTimeout(function() {
    $scope.$apply(function(){console.log("OK");});
    },2000); 
}

 $scope.getStars = function(rating) {
    // Get the value
    var val = parseFloat(rating);
    // Turn value into number/100
    var size = val/5*100;
    return size + '%';
  }
var categoryData=[];
var nameData=[];
var addressData=[];
var allIds=[];
    
var categoryData1=[];
var nameData1=[];
var addressData1=[];
var allIds1=[];
    var flag;
    
   var delcategoryData=[];
var delnameData=[];
var deladdressData=[];
var delallIds=[];
    $scope.addtostorage = function(){
        
        
        if(document.getElementById("details_star").className=="glyphicon glyphicon-star")
            {
                var detailsStar=document.getElementById("details_star");
                detailsStar.setAttribute("class","glyphicon glyphicon-star-empty");
                $("#details_star").css("color","black");    
                $scope.deleteFromStorage($scope.detailsPlaceData.id);
                
            }
        else{
            var detailsStar=document.getElementById("details_star");
        detailsStar.setAttribute("class","glyphicon glyphicon-star");
        $("#details_star").css("color","gold");
        
        categoryData.push($scope.detailsPlaceData.icon);
        nameData.push($scope.detailsPlaceData.name);
        addressData.push($scope.detailsPlaceData.vicinity);
        allIds.push($scope.detailsPlaceData.id);
        localStorage.setItem('categoryData',JSON.stringify(categoryData));
        localStorage.setItem('nameData',JSON.stringify(nameData));
        localStorage.setItem('addressData',JSON.stringify(addressData));
        localStorage.setItem('allIds',JSON.stringify(allIds));
        
        $scope.categoryData= JSON.parse(localStorage.getItem('categoryData'));
        $scope.nameData=JSON.parse(localStorage.getItem('nameData'));
        $scope.addressData=JSON.parse(localStorage.getItem('addressData'));
        $scope.allIds=JSON.parse(localStorage.getItem('allIds'));
        
        }
        for(var i=0;i<favAddr.length;i++){
         if(document.getElementById("details_star").className=="glyphicon glyphicon-star"){
        if($scope.detailsPlaceData.id==favAddr[i]){
            
            stars[i].setAttribute("class","glyphicon glyphicon-star");
            stars[i].style.color="gold";  
        }    
    }
}
}
    $scope.addtostorage1 = function(i){
        if(pageClick==0){
            res1=$scope.travel;
        if(stars[i].className=="glyphicon glyphicon-star")
            {
                stars[i].setAttribute("class","glyphicon glyphicon-star-empty");
                stars[i].style.color="black";    
                $scope.deleteFromStorage(res1[i].id);
            }
            else{
                stars[i].setAttribute("class","glyphicon glyphicon-star");
                stars[i].style.color="gold";
                originalRes=$scope.travel;
                categoryData.push(originalRes[i].icon);
                nameData.push(originalRes[i].name);
                addressData.push(originalRes[i].vicinity);
                allIds.push(originalRes[i].id);
            }
                
            }
        if(pageClick==1){
            res2=$scope.travel1;
             if(stars[i+20].className=="glyphicon glyphicon-star")
            {
                stars[i+20].setAttribute("class","glyphicon glyphicon-star-empty");
                stars[i+20].style.color="black";    
                $scope.deleteFromStorage(res2[i].id);
            }
            else{
                 stars[i+20].setAttribute("class","glyphicon glyphicon-star");
                stars[i+20].style.color="gold";
                 originalRes1= $scope.travel1;
                 categoryData.push(originalRes1[i].icon);
                nameData.push(originalRes1[i].name);
            addressData.push(originalRes1[i].vicinity);
            allIds.push(originalRes1[i].id);
            }
                
            }
        if(pageClick==2){
             res3=$scope.trave2;
             if(stars[i+40].className=="glyphicon glyphicon-star")
            {
                stars[i+40].setAttribute("class","glyphicon glyphicon-star-empty");
                stars[i+40].style.color="black";    
                $scope.deleteFromStorage(res3[i].id);
            }
            else{
                stars[i+40].setAttribute("class","glyphicon glyphicon-star");
                stars[i+40].style.color="gold";
                 originalRes2=$scope.travel2;
                categoryData.push(originalRes2[i].icon);
                nameData.push(originalRes2[i].name);
                addressData.push(originalRes2[i].vicinity);
                allIds.push(originalRes2[i].id);
            }
                
            }
        function retainFormValue(){    
            var keyWordData=sessionStorage.getItem('keyVes');
            var locData=sessionStorage.getItem('key336');
            document.getElementById('abcz').value="locData";
            
        }
        localStorage.setItem('categoryData',JSON.stringify(categoryData));
        localStorage.setItem('nameData',JSON.stringify(nameData));
        localStorage.setItem('addressData',JSON.stringify(addressData));
        localStorage.setItem('allIds',JSON.stringify(allIds));
        
    $scope.categoryData= JSON.parse(localStorage.getItem('categoryData'));
    $scope.nameData=JSON.parse(localStorage.getItem('nameData'));
    $scope.addressData=JSON.parse(localStorage.getItem('addressData'));
    $scope.allIds=JSON.parse(localStorage.getItem('allIds'));   
        
}
    
    function handleInd(val)
{ 
   if(val=='price') chartPrice(sobj);
   if(val=='sma') parseSingleInd(val,iarr['sma']);
   if(val=='ema') parseSingleInd(val,iarr['ema']);
   if(val=='rsi') parseSingleInd(val,iarr['rsi']);
   if(val=='adx') parseSingleInd(val,iarr['adx']);
   if(val=='cci') parseSingleInd(val,iarr['cci']);
   if(val=='stoch') parseDoubleInd(val,iarr['stoch']);
   if(val=='bbands') parseTripleInd(val,iarr['bbands']);
   if(val=='macd') parseTripleInd(val,iarr['macd']);

}
    $scope.deleteFromStorage=function(i){
        var toDelete;
        delcategoryData= JSON.parse(localStorage.getItem('categoryData'));
        delnameData=JSON.parse(localStorage.getItem('nameData'));
        deladdressData=JSON.parse(localStorage.getItem('addressData'));
        delallIds=JSON.parse(localStorage.getItem('allIds'));
        for(ind=0;ind<delallIds.length;ind++){
            if(delallIds[ind]==i){
                toDelete=ind;
                break;
            }
        }
        delcategoryData.splice(toDelete,1);
        delnameData.splice(toDelete,1);
        deladdressData.splice(toDelete,1);
        delallIds.splice(toDelete,1);
                 
        localStorage.setItem('delcategoryData',JSON.stringify(delcategoryData));
        localStorage.setItem('delnameData',JSON.stringify(delnameData));
        localStorage.setItem('deladdressData',JSON.stringify(deladdressData));
        localStorage.setItem('delallIds',JSON.stringify(delallIds));
                
        $scope.categoryData= JSON.parse(localStorage.getItem('delcategoryData'));
        $scope.nameData=JSON.parse(localStorage.getItem('delnameData'));
        $scope.addressData=JSON.parse(localStorage.getItem('deladdressData'));
        $scope.allIds=JSON.parse(localStorage.getItem('delallIds'));
        
        categoryData=delcategoryData;
        nameData=delnameData;
        addressData=deladdressData;
        allIds=delallIds;
        
        localStorage.setItem('categoryData',JSON.stringify(categoryData));
        localStorage.setItem('nameData',JSON.stringify(nameData));
        localStorage.setItem('addressData',JSON.stringify(addressData));
        localStorage.setItem('allIds',JSON.stringify(allIds));
        
        $scope.postshow = function()
 {
  console.log("inside postshow");
  $scope.state = {Posts_table : true};

 }
  
  $scope.legShow = function () {

    
    console.log("Inside the leg show function");

     $scope.state = {Users_table : true};
   
    };
  $scope.pageShow = function () {

    
    console.log("Inside the leg show function");

     $scope.state = {Pages_table : true};
   
    };
   $scope.eventShow = function () {

    
    console.log("Inside the leg show function");

     $scope.state = {Events_table : true};
   
    };
                
        
            for(x=0;x<favAddr.length;x++){
                if(i==favAddr[x]){
                    if(pageClick==0){
                        stars[x]=stars[x].setAttribute("class","glyphicon glyphicon-star-empty");
                        stars[x]=stars[x].style.color="black";
                    }
                    if(pageClick==1){
                        stars[x]=stars[x].setAttribute("class","glyphicon glyphicon-star-empty");
                        stars[x]=stars[x].style.color="black";
                    }
                    if(pageClick==2){
                        stars[x]=stars[x].setAttribute("class","glyphicon glyphicon-star-empty");
                        stars[x]=stars[x].style.color="black";
                    }
                    
                }
            }
     
        $scope.categoryData= JSON.parse(localStorage.getItem('categoryData'));
        $scope.nameData=JSON.parse(localStorage.getItem('nameData'));
        $scope.addressData=JSON.parse(localStorage.getItem('addressData'));
        $scope.allIds=JSON.parse(localStorage.getItem('allIds'));
        $("#favBtnId").click(function(){
            if(categoryData.length==0){
            $("#noFav").show();
            $("#firstPage").hide();
            $("#secondPage").hide();
            $("#thirdPage").hide();
             $("#favPage").hide();
        }
        else{
            $("#noFav").hide();
        }
        });
        
        
    }
       
        function sortDefault()
{

  $('#dop2b').attr('disabled','disabled');
  $('#dop1').html('Default');

  if(state.prev=="default") return;
  if(state.order==0) return;
}
    var prevInd=0;
   
     $scope.Favorite1 = function () {
          var someVar;
         if(pageClick==0){
            someVar=$scope.selectedRow; 
         }
         else if(pageClick==1){
              someVar=$scope.selectedRow+20; 
         }
         else if(pageClick==2){
              someVar=$scope.selectedRow+40; 
         }
    for(var i=0;i<allIds.length;i++){
        if(favAddr[someVar]==allIds[i]){
                    var favTable=document.getElementById("favPage").getElementsByTagName("tr"); 
                     favTable[prevInd].removeAttribute("class","selected");
                    favTable[i+1].setAttribute("class","selected");
                    prevInd=i+1;
            }
    }
      
    };
function sortSymbol()
{
  $('#dop1').html('Symbol');
  $('#dop2b').removeAttr('disabled');
  state.current="symbol";
 

}
 $scope.Favorite = function () {
     if(categoryData.length==0){
         $("#noFav").show();
          $("#firstPage").hide();
     $("#secondPage").hide();
     $("#thirdPage").hide();
     }
     else{
     $("#firstPage").hide();
     $("#secondPage").hide();
     $("#thirdPage").hide();
     $("#favPage").show();
         $("#noFav").hide();
     
     }
     $scope.Favorite1();
    };
     var came_from_fav=0;
    $scope.favDetails=function(id){
        came_from_fav=1;
        $scope.detailsHide=false;
        $scope.listHide=true;
        for(var i=0;i<favAddr.length;i++){
            if(id==favAddr[i]){
                if(pageClick==0){
                $scope.getDetails(i);
                }
                if(pageClick==1){
                     $scope.getDetails(i-20);
                }
                if(pageClick==2){
                     $scope.getDetails(i-40);
                }
            }
        }
    }
   


});
 function clearData(){
    /*$("#firstPage").hide();
    $("#secondPage").hide();
    $("#thirdPage").hide();
     $("#detailsTab").hide();
    $('#keyword_enter').val('');   
    $('#myTypeSelect1').val('');
    $('#location1').val(''); 
     $('#placename').hide();*/
    document.getElementById("firstPage").style.display="none";
    document.getElementById("secondPage").style.display="none";
    document.getElementById("thirdPage").style.display="none";
    document.getElementById("keyword_enter").value='';
    document.getElementById("keyword_enter").setAttribute("value", "");
    document.getElementById("location1").value='';
    document.getElementById("distance").value='';
    document.getElementById("placename").style.display="none";
      $('#myTypeSelect1').val('');
     document.getElementById("myTypeSelect1").selectedIndex = 0;
     document.getElementById("radioLoc").checked = true;
    $('#location1').attr('readonly', 'readonly');
     
}
/*Enable disable Radio and Location box */
$(document).ready(function(){
    $("#searchId").prop('disabled',true);
       $("#radioLoc").prop('checked',true);
    $('#location').click(function(){
    if($('#location1').prop('readonly'))
    {
     $('#location1').removeAttr('readonly');
    }
    else{
         $('#location1').attr('readonly', 'readonly')
      }
    });
});


