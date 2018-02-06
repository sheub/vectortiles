# Vectortiles ![Marker mit Schatten](https://github.com/sheub/vectortiles/blob/master/media/Marker_with_Shadow.png)

Store locator using Mapbox-GL and tileserver-php from klokantech.
It can be hosted on a standard Apache+PHP web hosting.

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/992d2af0bf6b4704a3ea96791b25cb52)](https://www.codacy.com/app/sheub/vectortiles?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=sheub/vectortiles&amp;utm_campaign=Badge_Grade) [![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://leipzig-einkaufen.de)

### Features

- [x] Self-hosted
- [x] Filter locations categories with dropdown box
- [x] Interactive Location Listing
- [x] Filter Listing within the map view
- [x] Custom Markers


### Map rendering and listing

![Leipzig_Einkaufen_Map_List](https://github.com/sheub/vectortiles/blob/master/media/Leipzig_Einkaufen_Map_List.png)The map tiles are served with tileserver-php, the rendering is done using mapboxgl.js library. The listing and filtering features have been implemented using the following examples from mapbox:



Filter the store locations *with dropdown box*: 

https://www.mapbox.com/mapbox-gl-js/example/filter-markers/

Filter the store list *within the map view*:

 https://www.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/

Add *Custom Marker*: 

https://www.mapbox.com/mapbox-gl-js/example/add-image/

Add *Fullscreen button*:

https://www.mapbox.com/mapbox-gl-js/example/fullscreen/

### Installing

Web Project written in php Javascript css html. Simply clone or download and extract the repository to your host server.

### Vectortiles in xyz format

For higher performance the .mbtile file has been extracted to .pbf files format. This can be done using the python utility mb-util from mapbox, then the files must be gzip decompressed. The following commands lines will do the tricks.

```
./mb-util --image_format=pbf countries.mbtiles countries
gzip -d -r -S .pbf *
find . -type f -exec mv '{}' '{}'.pbf \;
```

### Acknowledgement

This project has been created to ease the localisation of local retail stores in the city of Leipzig-Germany.
Please feel free to send us your comments or any suggestions you may have to improve it functionality.

### License

The original tiles of Leipzig-Germany have been purchased at https://openmaptiles.org/ . They are subject to license restriction (see [license](https://github.com/sheub/vectortiles/blob/master/LICENSE)).


Copyright (c) 2018 Sébastien Barré, Licensed under BSD 3-Clause License.
