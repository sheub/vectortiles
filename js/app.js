$(window).on('scroll', function (event) {
    var scrollValue = $(window).scrollTop();
    if (scrollValue > 220) {
        $('.navbar').addClass('affix');
    } else{
        $('.navbar').removeClass('affix');
    }
});

var map = new mapboxgl.Map({
  container: 'map',
  style: 'https://leipzig-einkaufen.de/json/style-local.json',
  center: [12.3722, 51.3272],
  zoom: 11,
  attributionControl: true,
  hash: false
});

// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
  closeButton: false
});

var filterEl = document.getElementById('feature-filter');
var listings = document.getElementById('listings');
var txtCategories = document.getElementById('txtCategories');


var mapMarkers = [];

function normalize(string) {
  return string.trim().toLowerCase();
}

function createPopUp(currentFeature) {

  var popup = new mapboxgl.Popup({
      closeOnClick: true
    })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h3>' + currentFeature.properties.name + '</h3>' +
      '<h4>' + currentFeature.properties.description + '</h4>')
    .addTo(map);
}

function getUniqueFeatures(array, comparatorProperty) {    
  var existingFeatureKeys = {};
  // Because features come from tiled vector data, feature geometries may be split
  // or duplicated across tile boundaries and, as a result, features may appear
  // multiple times in query results.
  var uniqueFeatures = array.filter(function(el) 
   {
    if (existingFeatureKeys[el.properties[comparatorProperty]]) {
      return false;
    } else {
      existingFeatureKeys[el.properties[comparatorProperty]] = true;
      return true;
    }
  });

  return uniqueFeatures;
}

function buildLocationList(data) {
  // Iterate through the list of stores
  listings.innerHTML = '';
  if (data.length) {
    data.forEach(function(feature) {
      // Shorten data.feature.properties to just `prop` so we're not writing this long form over and over again.
      var prop = feature.properties;
      // Select the listing container in the HTML and append a div  with the class 'item' for each store

      var card = listings.appendChild(document.createElement('div'));
      card.className = 'item card';
      card.id = prop.id;

      var card_header = card.appendChild(document.createElement('div'));
      card_header.className = 'card-header';
      card_header.setAttribute('role', 'tab');
      card_header.setAttribute('id', 'heading' + card.id);
      card_header.id = 'heading' + card.id;

      var card_mb0 = card_header.appendChild(document.createElement('h5'));
      card_mb0.className = 'mb-0';

      // Create a new link with the class 'title' for each store and fill it with the store address
      var link = card_mb0.appendChild(document.createElement('a'));
      link.setAttribute('data-toggle', 'collapse');
      link.href = '#collapse' + card.id;
      link.setAttribute('aria-expanded', 'false');
      link.setAttribute('aria-controls', 'collapse' + card.id);
      link.className = 'title';
      link.innerHTML = prop.name;
      link.dataPosition = card.id;

      var card_collapse = card.appendChild(document.createElement('div'));
      card_collapse.className = 'collapse';
      card_collapse.setAttribute('id', 'collapse' + card.id);
      card_collapse.setAttribute('role', 'tabpanel');
      card_collapse.setAttribute('aria-labelledby', 'heading' + card.id);
      card_collapse.setAttribute('data-parent', '#listings');

      if(prop.image){
          var card_img = card_collapse.appendChild(document.createElement('img'));
          card_img.className = 'img-responsive img-listing';
          card_img.src = prop.image;
          card_img.alt = prop.name;
          card_img.title = prop.name;
      }
        
      var card_body = card_collapse.appendChild(document.createElement('div'));  
      card_body.className = 'card-body';
      card_body.innerHTML = prop.description;
      card_body.innerHTML += "</br><a href='" + prop.url + "' target='_blank' />" + prop.url + "</a>";

      // Add an event listener for the links in the sidebar listing
      link.addEventListener('click', function(e)
        {
            // Update the currentFeature to the store associated with the clicked link
            var clickedListing = stores2.features[this.dataPosition];

            var popUps = document.getElementsByClassName('mapboxgl-popup');
            // Check if there is already a popup on the map and if so, remove it
            if (popUps[0]) popUps[0].parentNode.removeChild(popUps[0]);
          
            // 1. Close all other popups and display popup for clicked store
            createPopUp(clickedListing);

            // 2. Highlight listing in sidebar (and remove highlight for all other listings)
            var activeItem = document.getElementsByClassName('is-active');
            if (activeItem[0]) {
              activeItem[0].classList.remove('is-active');
            }
            this.classList.add('is-active');

      });

    })
    // Show the filter input
    //filterEl.parentNode.style.display = 'block';
  }
    else 
    {
        var empty = document.createElement('p');
        empty.textContent = 'Ziehen Sie die Karte, um die Ergebnisse zu füllen';
        listings.appendChild(empty);

        // Hide the filter input
        //filterEl.parentNode.style.display = 'none';

        // remove features filter
        map.setFilter('locations', ['has', 'Categories']);
  }
}


/*Load stores2*/
stores2 = (function() {
  var stores2 = null;
  $.ajax({
    'async': false,
    'global': false,
    'url': "https://leipzig-einkaufen.de/location.json",
    //'url': "http://localhost/vectortiles/location.json",
    'dataType': "json",
    'success': function(data) {
      stores2 = data;
    }
  });
  return stores2;
})();


map.on('load', function(e) {

    //map.loadImage('http://localhost/vectortiles/media/Marker_with_Shadow.png', function(error, image) {
    map.loadImage('https://leipzig-einkaufen.de/media/Marker_with_Shadow.png', function(error, image) {
        if (error) throw error;
      map.addImage('marker_z', image);
            
      // Add the data to your map as a layer
      map.addSource('locations_source', {
        "type": 'geojson',
        "data": stores2 //"http://localhost/vectortiles/location.geojson"
      });

      // Add the data to your map as a layer
      map.addLayer({
            "id": 'locations',
            "type": 'symbol',
            // Add a GeoJSON source containing place coordinates and information.
            "source": 'locations_source',
            "layout": {
              "visibility": "visible",
              "icon-image": "marker_z",
              "icon-size": 0.95,
              "icon-allow-overlap": true
            }

      });

	  map.addControl(new mapboxgl.FullscreenControl());

     // When a click event occurs on a feature in the places layer, open a popup at the
     // location of the feature, with description HTML from its properties.
     map.on('click', 'locations', function (e) {
         var current_feature = e.features[0];
         // 1. Create Popup
         createPopUp(current_feature);
         
         // 2. Highlight listing in sidebar (and remove highlight for other listing)
         var activeItem = document.getElementsByClassName('is-active');
         if (activeItem[0]) 
             activeItem[0].classList.remove('is-active');
         
         var heading_Element = document.getElementById('heading' + current_feature.properties.id);
         if (heading_Element)
             heading_Element.classList.add('is-active');
         var collapse_Element = document.getElementById('collapse' + current_feature.properties.id);
         if (collapse_Element)      
             $(collapse_Element).collapse('show');
         
     });
        
      map.on('moveend', function() {
        // Query all the rendered points in the view
        var features = map.queryRenderedFeatures({
          layers: ['locations']
        });

        if (features) {

          var uniqueFeatures = getUniqueFeatures(features, "Categories");
            
          // Populate features for the listing overlay.
          buildLocationList(uniqueFeatures);

          // Clear the input container
          filterEl.value = '';

          // Store the current features in sn `locations_on_map` variable to
          // later use for filtering on `keyup`.
          locations = uniqueFeatures;
        }
      });

      map.on('mousemove', 'locations', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // // Populate the popup and set its coordinates based on the feature.
        // var feature = e.features[0];
        // popup.setLngLat(feature.geometry.coordinates)
        //   .setText(feature.properties.name + ' (' + feature.properties.abbrev + ')')
        //   .addTo(map);
      });

      map.on('mouseleave', 'locations', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });

      $('.dropdown-item').click(function() {

        var value = normalize($(this).text());

        var filtered = map.querySourceFeatures('locations_source');
        if (value !== 'alle') {
          // Filter visible features that don't match the input value.
          filtered = filtered.filter(function(feature) {
            var name = normalize(feature.properties.name);
            var Categories = normalize(feature.properties.Categories);
            return name.indexOf(value) > -1 || Categories.indexOf(value) > -1;
          });
        }
        if (!filtered)
          return;

        var uniqueFeatures = getUniqueFeatures(filtered, "Categories");
        // Populate the sidebar with filtered results
        buildLocationList(uniqueFeatures);

        // Set the filter to populate features into the layer.
        map.setFilter('locations', ['in', 'name'].concat(uniqueFeatures.map(function(feature) {
          return feature.properties.name;
        })));


        mapMarkers.forEach(function(marker) {
          marker.remove();
        });

        txtCategories.value = value;

      });

      filterEl.addEventListener('keyup', function(e) {

        var value = normalize(e.target.value);

        // Filter visible features that don't match the input value.
        var filtered = locations.filter(function(feature) {
            
          var name = normalize(feature.properties.name);
          var Categories = normalize(feature.properties.Categories);
          return name.indexOf(value) > -1 || Categories.indexOf(value) > -1;
        });

        // Populate the sidebar with filtered results
        buildLocationList(filtered);

        // Set the filter to populate features into the layer.
        map.setFilter('locations', ['in', 'name'].concat(filtered.map(function(feature) {
          return feature.properties.name;
        })));


        mapMarkers.forEach(function(marker) {
          marker.remove();
        });

      });

      // Call this function on initialization
      // passing an empty array to render an empty state
      buildLocationList([]);
    });
});







