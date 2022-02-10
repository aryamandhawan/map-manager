import React from "react";
import { useState, useEffect } from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import { ToggleButton } from "react-bootstrap";
const Optionsfield = (props) => {
  const [sel, setSel] = useState(props._active[0]);
  const [region, setRegion] = useState(props._active[1]);
  const [showNeighbours, setShowNeighbours] = useState(false);
  
  useEffect(() => {
    console.log("[NAVBAR] layer", sel);
    props._functions[0](sel);
  }, [sel]);

  useEffect(() => {
    console.log("[NAVBAR] region", region);
    props._functions[1](region);
  }, [region]);

  useEffect(() => {
    console.log("[NAVBAR] showNeighbours", showNeighbours);
    props._functions[2](showNeighbours)
  }, [showNeighbours]);


  const renderLayerOptions = (option, i) => {
    return (
      <>
        <NavDropdown.Item
          key={option[i]}
          onClick={(e) => {
            setSel(option);
          }}
        >
          {option === "image_point_layer" ? "Images" : "Sequences"}
        </NavDropdown.Item>
      </>
    );
  };
  const renderRegionOptions = (option, i) => {
    return (
      <>
        <NavDropdown.Item
          key={option[i]}
          onClick={(e) => {
            setRegion(option);
          }}
        >
          {option}
        </NavDropdown.Item>
      </>
    );
  };
  
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Nav className="navbar navbar-expand-sm ">
          <div className="navbar-nav">
            <Nav.Link variant="light">Map-Manager</Nav.Link>
            <NavDropdown
              title={`Layer : ${
                sel === "image_point_layer" ? "Images" : "Sequences"
              }`}
              id="basic-nav-dropdown"
            >
              {props.options.layers.map(renderLayerOptions)}
            </NavDropdown>
            <NavDropdown title={`Region : ${region}`} id="basic-nav-dropdown">
              {props.options.regions.map(renderRegionOptions)}
            </NavDropdown>
            
            <ToggleButton
              className="mb-2"
              id="toggle-neighbours"
              type="checkbox"
              variant={showNeighbours ? 'primary' : 'secondary'}
              checked={showNeighbours}
              value="1"
              onChange={(e) => {
                setShowNeighbours(e.currentTarget.checked)
              }
            }
            >
              Show Neighbours
            </ToggleButton>
            
          </div>
        </Nav>
      </Navbar>
    </>
  );
};
export default Optionsfield;
