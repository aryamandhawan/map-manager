import {React,useState} from 'react';
import { Button } from "react-bootstrap";
import SideBar from "./components/sidebar/SideBar";
import Map from './components/Map';
import "./App.css";

function App() {
  const [sidebarIsOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

  return (
    <div id="App.js">
        <Map toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen}/>
    </div>

  );
}

export default App;
