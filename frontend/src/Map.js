import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; 
import Navbar from "./components/Navbar";
import "./Map.css";

mapboxgl.accessToken =
  "***REMOVED***";

export default function Map() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  // // Adealide
  const [lng, setLng] = useState(138.603451251989);
  const [lat, setLat] = useState(-34.929553631263);
  // Delhi
  // const [lng, setLng] = useState(77.0478);
  // const [lat, setLat] = useState(28.6013);
  const [zoom, setZoom] = useState(12);
  const options = ["image_point_layer", "sequence_layer"];
  const jsonOptions = {
    layers: ["image_point_layer", "sequence_layer"],
    regions: ["Delhi", "Adelaide"],
    region_coordinates: [
      {
        Delhi: [77.0478, 28.6013],
        Adelaide: [138.6034, -34.9295],
      },
    ],
  };
  // console.log(jsonOptions,jsonOptions.layers,jsonOptions.locations)
  const [active_layer, _setactive_layer] = useState(jsonOptions.layers[0]);
  const active_layerRef = useRef(active_layer);
  const setactive_layer = (data) => {
    active_layerRef.current = data;
    _setactive_layer(data);
  };
  const [active_region, setactive_region] = useState(jsonOptions.regions[1]);
  const [fully_loaded, setFully_loaded] = useState(false);
  const img_data_url = `https://cdn.glitch.global/2b9e76de-99e3-4e07-b284-4340598de754/${active_region.toLowerCase()}_images.geojson`;
  const seq_data_url = `https://cdn.glitch.global/2b9e76de-99e3-4e07-b284-4340598de754/${active_region.toLowerCase()}_sequences.geojson`;
  var popup = null;
  // Store Focused SEQ
  const [focusSeq, _setfocusSeq] = useState(null);
  const focusSeqRef = useRef(focusSeq);
  const setfocusSeq = (data) => {
    focusSeqRef.current = data;
    _setfocusSeq(data);
  };
  const default_image_layer_paint = {
    "circle-radius": 4,
    "circle-stroke-width": 0.6,
    "circle-stroke-color": "black",
    "circle-color": "white",
  };
  const default_seq_layer_paint = {
    "line-opacity": 0.6,
    "line-width": 5,
    "line-color": [
      "match",
      ["%", ["get", "image_id"], 3],
      0,
      "orange",
      1,
      "blue",
      2,
      "red",
      "#000000",
    ],
  };
  // INITIALIZE MAP
  useEffect(() => {
    console.log(img_data_url);
    // if (map.current) return; // initialize map only once
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [lng, lat],
      zoom: zoom,
    });
    // ON MAP ADD DATA SOURCES AND RENDER MAP | HANDLE IMAGE CLICK
    map.on("load", () => {
      map.addSource("image_data", {
        type: "geojson",
        // Use a URL for the value for the `data` property.
        // Adelaide
        // data: "https://cdn.glitch.global/2b9e76de-99e3-4e07-b284-4340598de754/adelaide_images.geojson?v=1641403815022",
        // Delhi
        data: img_data_url,
      });
      map.addLayer({
        id: "image_point_layer",
        type: "circle",
        source: "image_data",
        layout: {
          // Make the layer visible by default.
          visibility: "none",
        },
        paint: default_image_layer_paint,
      });

      map.addSource("sequence_data", {
        type: "geojson",
        // Use a URL for the value for the `data` property.
        // Adelaide
        // data: "https://cdn.glitch.global/2b9e76de-99e3-4e07-b284-4340598de754/adealide_sequences.geojson?v=1641403805122",
        // Delhi
        data: seq_data_url,
      });
      map.addLayer({
        id: "sequence_layer",
        type: "line",
        source: "sequence_data",
        layout: {
          visibility: "none",
          "line-cap": "round",
          "line-join": "round",
        },
        paint: default_seq_layer_paint,
      });

      setMap(map);
      map.setLayoutProperty(active_layer, "visibility", "visible");

      map.on("click", active_layerRef.current, (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        console.log("FLY TP", coordinates);
        //corresponds to img_id in case of img_layer and seq_id in sequence_layer
        const sel_id = e.features[0].properties.id;
        const seq_id = e.features[0].properties.sequence_id;
        var fly_to_coord = null;
        var fly_zoom = null;
        console.log(e.lngLat);
        if (sel_id !== focusSeqRef.current) {
          fly_to_coord =
            active_layerRef.current === "image_point_layer"
              ? [coordinates[0], coordinates[1] + 0.0001]
              : e.lngLat;
          console.log(fly_to_coord);
          fly_zoom = map.getZoom() > 18 ? map.getZoom() : 18;
          map.flyTo({
            center: fly_to_coord,
            zoom: fly_zoom,
            speed: 1,
            curve: 1,
            // easing(t) {
            //   return t;
            // },
          });

          if (active_layerRef.current === "image_point_layer") {
            showPopup(
              active_layerRef.current,
              map,
              coordinates,
              sel_id,
              seq_id
            );
            map.setPaintProperty("image_point_layer", "circle-color", [
              "match",
              ["get", "id"],
              sel_id,
              "white",
              "#000000",
            ]);
            setfocusSeq(sel_id);
          } else {
            showPopup(active_layerRef.current, map, e.lngLat, sel_id, seq_id);
            map.setPaintProperty("sequence_layer", "line-width", [
              "match",
              ["get", "id"],
              sel_id,
              10,
              0,
            ]);
            setfocusSeq(sel_id);
          }
        } else {
          if (active_layerRef.current === "image_point_layer") {
            popup.remove();
            map.setPaintProperty(
              "image_point_layer",
              "circle-color",
              default_image_layer_paint["circle-color"]
            );
            setfocusSeq(null);
          } else {
            map.setPaintProperty(
              "sequence_layer",
              "line-color",
              default_seq_layer_paint["line-color"]
            );
            map.setPaintProperty("sequence_layer", "line-width", 8);
            map.setPaintProperty("sequence_layer", "line-opacity", 0.6);
            setfocusSeq(null);
          }
        }
      });
      // BASIC MAP INTERACTION HANDLERS
      map.on("mouseover", active_layer, (e) => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", active_layer, (e) => {
        map.getCanvas().style.cursor = "";
      });
      map.on("move", () => {
        setLng(map.getCenter().lng.toFixed(4));
        setLat(map.getCenter().lat.toFixed(4));
        setZoom(map.getZoom().toFixed(1));
      });
      map.on("idle", () => {
        setFully_loaded(true);
      });
    });
    return () => map.remove();
  }, [active_layer, active_region]);

  const showPopup = (layer_name, map, coordinates, sel_id, seq_id) => {
    if (layer_name === "image_point_layer") {
      var image = null;
      fetch(
        `https://graph.mapillary.com/${sel_id}?fields=thumb_256_url&access_token=MLY%7C4603337513049480%7C2b5a735be0aa893f4e079309d23b1423`
      )
        .then((res) => res.json())
        .then((result) => {
          image = result.thumb_256_url;
        })
        .then(() => {
          popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
              `<div className="black div-center d-inline-block text-truncate">
              IMAGE_ID = ${sel_id} SEQEUNCE_ID = ${seq_id}
              Image_coordinates = ${coordinates}
              <img src=${image} />
            </div>`
            )
            .addTo(map);
        })
        .catch((err) => console.log("Error Setting Image POPUP", err));
    } else {
      popup = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<div className="black div-center d-inline-block text-truncate">
              SEQEUNCE_ID = ${sel_id}
            </div>`
        )
        .addTo(map);
    }
  };
  // HANDLE UPDATES FROM USER INTERACTION WITH NAVBAR.
  const changeLayer = (i) => {
    if (map) {
      map.setLayoutProperty(i, "visibility", "visible");
      for (var j = 0; j < options.length; j++) {
        if (options[j] !== i) {
          map.setLayoutProperty(options[j], "visibility", "none");
        }
      }
      setactive_layer(i);
    }
  };
  const changeRegion = (i) => {
    // jsonOptions.region_coordinates[0][i]
    setLng(jsonOptions.region_coordinates[0][i][0]);
    setLat(jsonOptions.region_coordinates[0][i][1]);
    setactive_region(i);
  };

  return (
    <div>
      <div className="sidebarStyle">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainerRef} className="map-container" />
      <Navbar
        options={jsonOptions}
        _active={[active_layer, active_region]}
        _functions={[changeLayer, changeRegion]}
      />
    </div>
  );
}