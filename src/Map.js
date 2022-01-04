import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Optionsfield from "./components/Optionsfield";
import "./Map.css";
mapboxgl.accessToken =
  "***REMOVED***";

export default function Map() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  const [lng, setLng] = useState(138.603451251989);
  const [lat, setLat] = useState(-34.929553631263);
  const [zoom, setZoom] = useState(12);

  const options = ["image_point_layer", "sequence_layer"];
  const [active_layer, setActive_layer] = useState(options[0]);
  var popup = null;
  // Store Focused SEQ
  const [focusSeq,_setfocusSeq] = useState(null);
  const focusSeqRef = useRef(focusSeq);
  const setfocusSeq = data => {
    focusSeqRef.current = data;
    _setfocusSeq(data);
  };
  const default_image_layer_paint ={
    "circle-radius": 4,
    "circle-stroke-width": 0.5,
    "circle-stroke-color": "black",
    "circle-color": "blue"
  }
  const default_seq_layer_paint ={
    "line-opacity": 0.6,
    "line-width": 5,
    "line-color": 
    [
      'match',
      ["%",  ["get", "image_id"],3],
      0,'orange',
      1, 'blue',
      2, 'red',
      '#000000'
    ]
  }
  // INITIALIZE MAP
  useEffect(() => {
    // if (map.current) return; // initialize map only once
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [lng, lat],
      zoom: zoom
    });
    // ON MAP ADD DATA SOURCES AND RENDER MAP | HANDLE IMAGE CLICK
    map.on("load", () => {
      // console.log("Map Load | props =", props);
      map.addSource("image_data", {
        type: "geojson",
        // Use a URL for the value for the `data` property.
        data:
          "https://cdn.glitch.me/2b9e76de-99e3-4e07-b284-4340598de754/images.geojson?v=1640740024336"
      });
      map.addLayer({
        id: "image_point_layer",
        type: "circle",
        source: "image_data",
        layout: {
          // Make the layer visible by default.
          visibility: "none"
        },
        paint: default_image_layer_paint
      });

      map.addSource("sequence_data", {
        type: "geojson",
        // Use a URL for the value for the `data` property.
        data:
          "https://cdn.glitch.me/2b9e76de-99e3-4e07-b284-4340598de754/sequences.geojson?v=1640794541996"
      });
      map.addLayer({
        id: "sequence_layer",
        type: "line",
        source: "sequence_data",
        layout: {
          "visibility": "none",
          "line-cap": "round",
          "line-join": "round"
        },
        paint: default_seq_layer_paint
      });
      setMap(map);
      map.setLayoutProperty(active_layer, "visibility", "visible");
      // HANDLE image_point_layer CLICK
      map.on("click", "image_point_layer", (e) => {
        console.log("Clicked layer", "image_point_layer");
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const img_id = e.features[0].properties.id;
        const seq_id = e.features[0].properties.sequence_id;
        
        if(img_id !== focusSeqRef.current)
        {
          showPopup(map,coordinates,img_id,seq_id);
        }
        else {
          
          popup.remove();
        }
        setLng(coordinates[0]);
        setLat(coordinates[1]);
        console.log("call for image to set popup")
      });

      // CHANGE PROPERTIES OF LAYERS ON INTERACTION
      map.on("click", "image_point_layer", (e) => {
        const seq_id = e.features[0].properties.id;
       
        if(seq_id !== focusSeqRef.current)
        {
          map.setPaintProperty('image_point_layer','circle-color', [
            'match',
            ["get", "id"],
            seq_id,'gold',
            '#000000'
          ]
          )
          setfocusSeq(seq_id);
        }
        else 
        {
          
          map.setPaintProperty('image_point_layer','circle-color',default_image_layer_paint["circle-color"]);
          setfocusSeq(null);
        }
      }); 
      map.on("click", "sequence_layer", (e) => {
        const seq_id = e.features[0].properties.id;
       
        if(seq_id !== focusSeqRef.current)
        {
          map.setPaintProperty('sequence_layer','line-width',
          [
            'match',
            ["get", "id"],
            seq_id,10,    
            0     
          ]
          )
          setfocusSeq(seq_id);
        }
        else 
        {

          console.log(default_seq_layer_paint["line-color"])
          map.setPaintProperty('sequence_layer','line-color',default_seq_layer_paint["line-color"]);
          map.setPaintProperty('sequence_layer','line-width',8)
          map.setPaintProperty('sequence_layer','line-opacity',0.6)
          setfocusSeq(null);
        }
      }); 
    });
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (map) {
      map.setLayoutProperty(active_layer, "visibility", "visible");
    }
  }, [active_layer]);

  // BASIC MAP INTERACTION HANDLERS
    if (map) {
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
    }
  // HANDLE UPDATES FROM USER INTERACTION WITH OPTIONS FIELD.
  const changeLayer = (i) => {
    map.setLayoutProperty(i, "visibility", "visible");
    for(var j=0;j<options.length;j++)
    {
      if(options[j]!==i)
      {
        map.setLayoutProperty(options[j], "visibility", "none");
      }
    }
    setActive_layer(i);
  };

  const showPopup = (map,coordinates,img_id,seq_id)=>{
    var image=null;
    fetch(
      `https://graph.mapillary.com/${img_id}?fields=thumb_2048_url&access_token=MLY%7C4603337513049480%7C2b5a735be0aa893f4e079309d23b1423`
    )
      .then((res) => res.json())
      .then((result) => {
        image = result.thumb_2048_url;
      })
      .then(()=>{
        popup = new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`<div >
                    <p>
                      IMAGE_ID = ${img_id} SEQEUNCE_ID = ${seq_id}
                    </p>
                    <p>
                      Image_coordinates = ${coordinates}
                    </p>
                    <img src=${image}>
                  </div>`)
      .addTo(map);
      })
      .catch((err) => console.log("Error Setting up POPUP", err));
  }

  return (
    <div>
      <div className="sidebarStyle">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainerRef} className="map-container" />
      <Optionsfield
        options={options}
        active_layer={active_layer}
        changeLayer={changeLayer}
      />
    </div>
  );
}
