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
  const [zoom, setZoom] = useState(14);

  const options = ["image_point_layer", "sequence_layer"];
  const [active_layer, setActive_layer] = useState(options[1]);
  
  // INITIALIZE MAP
  useEffect(() => {
    // if (map.current) return; // initialize map only once
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
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
        paint: {
          "circle-radius": 5,
          // [
          //   "interpolate", ["linear"], ["get", "id"],
          //   // zoom is 5 (or less) -> circle radius will be 1px
          //   130586109110840, 5,
          //   // zoom is 10 (or greater) -> circle radius will be 5px
          //   504104450735431, 10,
          // ],
          "circle-stroke-width": 1,
          "circle-stroke-color": "white",
          // "rgb(53, 175, 109)"
          "circle-color": [
            // "rgb",
            // // red is higher when feature.properties.temperature is higher
            // ["%",  ["get", "id"],255],
            // // green is always zero
            // ["%",  ["get", "id"],255],
            // // blue is higher when feature.properties.temperature is lower
            // ["%",  ["get", "id"],255]
            // // 109
            // ["step"], 
            // ["number", ["%",["get", "captured_at"],4], 1], 
            // 0,"red",
            // 1,"green",
            // 2,"blue",
            // 3,"orange",
            // 4,"#FC4E2A", 
            // 5,"#E31A1C", 
            // "#BD0026", 2000, 
            // "#000000"
            'match',
            ["%",  ["get", "id"],255],
            1, '#00C0C0',
            2, '#006666',
            '#000000'
        ]
        }
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
        paint: {
          "line-opacity": 1,
          "line-width": 10,
          "line-color": 
          // "rgb(53, 175, 109)",
          [
            'match',
            ["%",  ["get", "image_id"],3],
            0,'orange',
            1, 'blue',
            2, 'red',
            '#000000'
            
          ]
        }
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
        var image=null;
        var popup=null;
        // const innerHtmlContent = `<div ><p>IMAGE_ID = ${img_id} SEQEUNCE_ID = ${seq_id}</p><p>Image_coordinates = ${coordinates}</p></div>`;
        // const divElement = document.createElement("div");
        // const imgElement = document.createElement("div");
        // divElement.innerHTML = innerHtmlContent;
        // imgElement.innerHTML = '<img id="image" >';
        // divElement.appendChild(imgElement);
    
        fetch(
          `https://graph.mapillary.com/${img_id}?fields=thumb_2048_url&access_token=MLY%7C4603337513049480%7C2b5a735be0aa893f4e079309d23b1423`
        )
          .then((res) => res.json())
          .then((result) => {
            // console.log("Fetching image", result.thumb_2048_url);
            image = result.thumb_2048_url;

            // let image = document.getElementById("image");
            // image.src = result.thumb_2048_url;
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
          .catch((err) => console.log("Error at Div Enter", err));
        setLng(coordinates[0]);
        setLat(coordinates[1]);
        console.log("call for image to set popup")
        // map.on("mouseleave", "image_point_layer", (e) => {
        //   console.log("mouseleave", "image_point_layer");
        //   map.getCanvas().style.cursor = "";
        //   popup.remove();
        // });
        
        console.log("popup set",popup);

      });
      map.on("click", "sequence_layer", (e) => {
        const seq_id = e.features[0].properties.image_id;
        console.log("Clicked layer", "sequence_layer id",seq_id);
        map.setPaintProperty('sequence_layer','line-color',
        [
          'match',
          // ["%",  ["get", "image_id"],3],
          ["get", "image_id"],
          seq_id,'yellow',    
          '#000000'      
        ]
        )
        // Copy coordinates array.
        // const coordinates = e.features[0].geometry.coordinates.slice();
        // // const img_id = e.features[0].properties.id;
        // console.log("e.features",e.features[0]);
        // console.log("e.features[0]",e.features[0]);

        // console.log(seq_id,coordinates[0]);
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
        // console.log("MOVIN MAP");
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
        // console.log("for loop options",options[j]);
      }
    }
    setActive_layer(i);

  };

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
