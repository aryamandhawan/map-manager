import {React,useState} from 'react';
import { Button } from "react-bootstrap";

import Map from './components/Map';
import "./App.css";

function App() {
  const [sidebarIsOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

  return (
    <div id="App.js">
      <div id="AppMap" className={sidebarIsOpen?"mapSBopen":"mapSBclosed"}>
        <Map toggle={toggleSidebar} isOpen={sidebarIsOpen}/>
      </div>
    </div>

  );
}

export default App;
