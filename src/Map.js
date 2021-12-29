import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(138.6029202153935);
  const [lat, setLat] = useState(-34.929499170005435);
  const [zoom, setZoom] = useState(15);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation control (the +/- zoom buttons)
    // map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
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
        paint: {
          "circle-radius": 5,
          "circle-stroke-width": 1,
          "circle-color": "green",
          "circle-stroke-color": "white",
        },
      });

      map.on("mouseenter", "image_point_layer", (e) => {
        console.log("mouseenter", "image_point_layer");
        // Copy coordinates array.
        // Change the cursor style as a UI indicator.

        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.id;

        const innerHtmlContent = `<div ><p>IMAGE_ID = ${description}</p><p>Image_coordinates = ${coordinates}</p></div>`;

        const divElement = document.createElement("div");
        const imgElement = document.createElement("div");

        divElement.innerHTML = innerHtmlContent;
        imgElement.innerHTML =
          '<img id="image" style="object-fit:contain;width:200px;height:200px;border: solid 1px #CCC">';

        divElement.appendChild(imgElement);

        map.getCanvas().style.cursor = "pointer";
        fetch(
          `https://graph.mapillary.com/${description}?fields=thumb_2048_url&access_token=MLY%7C4603337513049480%7C2b5a735be0aa893f4e079309d23b1423`
        )
          .then((res) => res.json())
          .then((result) => {
            console.log(result.thumb_2048_url);
            let image = document.getElementById("image");
            image.src = result.thumb_2048_url;
          })
          .catch((err) => console.log("Error at Div Enter", err));
        map.on("mouseleave", "image_point_layer", (e) => {
          console.log("mouseleave", "image_point_layer");
          map.getCanvas().style.cursor = "";
          popup.remove();
        });
        const popup = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setDOMContent(divElement)
          .addTo(map);
      });
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='sidebarStyle'>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

export default Map;
