import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

mapboxgl.accessToken =
  ***REMOVED***;

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(138.60345125198364);
  const [lat, setLat] = useState(-34.929553631263);
  const [zoom, setZoom] = useState(20);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [lng, lat],
      zoom: zoom,
    });

    // Add navigation control (the +/- zoom buttons)
    // map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(26));
    });
    map.on("load", () => {
      map.addSource("image_data", {
        type: "geojson",
        // Use a URL for the value for the `data` property.
        data: "https://cdn.glitch.me/2b9e76de-99e3-4e07-b284-4340598de754/images.geojson?v=1640740024336",
      });
      map.addLayer({
        id: "image_point_layer",
        type: "circle",
        source: "image_data",
        layout: {
          // Make the layer visible by default.
          visibility: "visible",
        },
        paint: {
          "circle-radius": 5,
          "circle-stroke-width": 1,
          "circle-color": "green",
          "circle-stroke-color": "white",
        },
      });

      map.addSource("sequence_data", {
        type: "geojson",
        // Use a URL for the value for the `data` property.
        data: "https://cdn.glitch.me/2b9e76de-99e3-4e07-b284-4340598de754/sequences.geojson?v=1640794541996",
      });
      map.addLayer({
        id: "sequence_layer",
        type: "line",
        source: "sequence_data",
        layout: {
          "visibility": "none",
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-opacity": 0.6,
          "line-color": "rgb(53, 175, 109)",
          "line-width": 2,
        },
      });

      map.addSource("mapillary", {
        type: "vector",
        tiles: [
          "https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|4142433049200173|72206abe5035850d6743b23a49c41333",
        ],
        minzoom: 6,
        maxzoom: 14,
      });
      map.addLayer(
        {
          id: "mapillary", // Layer ID
          type: "line",
          source: "mapillary", // ID of the tile source created above
          // Source has several layers. We visualize the one with name 'sequence'.
          "source-layer": "sequence",
          layout: {
            "visibility": "none",
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-opacity": 0.6,
            "line-color": "rgb(53, 175, 109)",
            "line-width": 2,
          },
        },
        "road-label" // Arrange our new layer beneath this layer
      );
      

      map.on("mouseover", "image_point_layer", (e) => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "image_point_layer", (e) => {
        map.getCanvas().style.cursor = "";
      });
      map.on("click", "image_point_layer", (e) => {
        console.log("click", "image_point_layer");
        // Copy coordinates array.
        // Change the cursor style as a UI indicator.

        const coordinates = e.features[0].geometry.coordinates.slice();
        const img_id = e.features[0].properties.id;
        const seq_id = e.features[0].properties.sequence_id;

        const innerHtmlContent = `<div ><p>IMAGE_ID = ${img_id} SEQEUNCE_ID = ${seq_id}</p><p>Image_coordinates = ${coordinates}</p></div>`;

        const divElement = document.createElement("div");
        const imgElement = document.createElement("div");

        divElement.innerHTML = innerHtmlContent;
        imgElement.innerHTML =
          '<img id="image" style="object-fit:contain;width:200px;height:200px;border: solid 1px #CCC">';

        divElement.appendChild(imgElement);

        map.getCanvas().style.cursor = "pointer";
        fetch(
          `https://graph.mapillary.com/${img_id}?fields=thumb_2048_url&access_token=MLY%7C4603337513049480%7C2b5a735be0aa893f4e079309d23b1423`
        )
          .then((res) => res.json())
          .then((result) => {
            console.log(result.thumb_2048_url);
            let image = document.getElementById("image");
            image.src = result.thumb_2048_url;
          })
          .catch((err) => console.log("Error at Div Enter", err));
        setLng(coordinates[0]);
        setLat(coordinates[1]);
        setZoom(map.getZoom() + 2);
        map.on("mouseleave", "image_point_layer", (e) => {
          console.log("mouseleave", "image_point_layer");
          map.getCanvas().style.cursor = "";
          // popup.remove();
        });
        const popup = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setDOMContent(divElement)
          .addTo(map);
      });

      // map.on("click", "image_point_layer", (e) => {
      //   const clickedLayer = "image_point_layer";
      //   const visibility = map.getLayoutProperty(clickedLayer, "visibility");
      //   if (visibility === "visible") {
      //     map.setLayoutProperty(clickedLayer, "visibility", "none");
      //     map.setLayoutProperty("sequence_layer", "visibility", "visible");
      //   } else {
      //     map.setLayoutProperty("sequence_layer", "visibility", "none");
      //     map.setLayoutProperty(clickedLayer, "visibility", "visible");
      //   }
      //   console.log("clicked layer color -> yellow");
      // });
    });
    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="sidebarStyle">
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
