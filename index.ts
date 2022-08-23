
import { ParmMap, RootObject } from './map-response';

const queryString = window.location.search;
//3762 20 nw edmonton, t6t1r8 | 608 Windross Crescent NW, Edmonton, AB T6T 1X9
const urlParams = new URLSearchParams(queryString);

let str: string = urlParams.get('code') || '';
let obj: ParmMap = JSON.parse(str);


var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};
let centerlat : number = obj.centerlat;
let centerlng : number = obj.centerlng;

 function returnLocationArray(str : string) : string[][]{
  let arr: Array<string> = str.split("|");
  let count : number = 0;
  let locationArray : string[][]  = [];
  console.log(arr);
  arr.forEach(element => {
    count++;
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+element+"&key=AIzaSyCP25x8TMx7au58HJtmE_8518KEpQw2xgU", requestOptions)
  .then(response => response.text())
  .then(  result =>{
    console.log(result);
    let obj: RootObject = JSON.parse(result);
    if(obj.results.length > 0)
    {
        obj.results.forEach(result => {
          let stringLat : string = result.geometry.location.lat.toString();
          let stringLng : string = result.geometry.location.lng.toString();
          centerlat = result.geometry.location.lat;
          centerlng =result.geometry.location.lng;
          let formatted_address : string = result.formatted_address.replace("\"","");
          let locationarray : string[] = [formatted_address,stringLat,stringLng,count.toString()];
          console.log( locationarray);
          locationArray.push(locationarray);
        });
    }


  } 
  )
  .catch(error => console.log('error', error));
  });
  return locationArray;
}
let locations : string[][] =  obj.Locations ;








function initAutocomplete() {


  
    console.log(centerlat + " "+ centerlng);
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: new google.maps.LatLng(centerlat, centerlng),
      zoom: 13,
      mapTypeId: "roadmap",
    }

  )
  ;

  var infowindow = new google.maps.InfoWindow();

  var marker, i;





 console.log('here are the locations: '+ locations);
  for (i = 0; i < locations.length; i++) {  
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(Number(locations[i][1]),Number( locations[i][2])),
      map: map
    });
    


    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {

        let content :string = "<div><a href= \"https://www.google.com/maps/place/"+locations[i][0]+"\">"+locations[i][0]+"</div>" ;

        if(locations)
  {
        infowindow.setContent(content);
        infowindow.open(map, marker);
  }
      }
    })(marker, i));
   }
  


  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input") as HTMLInputElement;
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
  });

  let markers: google.maps.Marker[] = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if ( places !=  null && places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    
    if(places)
    {
    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon as string,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
  }
    map.fitBounds(bounds);
  });
}

declare global {
  interface Window {
    initAutocomplete: () => void;
  }
}
window.initAutocomplete = initAutocomplete;
export {};
