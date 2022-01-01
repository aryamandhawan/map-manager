import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const Map = (props) => {
  const ref = useRef(null);
  
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 6000)
    console.log("use Effect ",loading)
    if (ref.current && !map) {
      
      const map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 0],
        zoom: 1
      });
      setMap(map);
      
    }
    
  }, [ loading,map]);
//   return <div className="map-container" ref={ref} />;
// }
  return (
  <div>
  {
  loading === true ? (
  <div>
    <div className="sidebarStyle">
      <div>Loading True</div>
    </div>
  </div>
  

  ):(
  <div>
     <div>
      <div className="map-container" ref={ref} />
      <div className="sidebarStyle">
        
        <div>Longitude </div>
      </div>
    </div>
  </div>)
  }
    </div>
  )
};

export default Map;
