import React from 'react';
import Map from './components/Map';

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
