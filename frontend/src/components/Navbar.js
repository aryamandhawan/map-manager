import React from "react";
import { useState, useEffect } from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import { Form, ToggleButton, Container } from "react-bootstrap";
import "./Navbar.css";
const Optionsfield = (props) => {
  // console.log("{sidebar.js}")
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

    props._functions[2](showNeighbours); //Map.js ->toggleNeighboursState
    
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
        <Container>
          <Navbar.Brand onClick={props.toggleSidebar}>Map-Manager</Navbar.Brand>
          <Nav className="me-auto">
            {/* <div className="navbar-nav"> */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              {/* <Nav.Link variant="light"></Nav.Link> */}
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
              <Navbar.Text style={{ paddingRight: 10 }}>
                Show Neighbours
              </Navbar.Text>
              <Form>
                <Form.Switch
                  onChange={(e) => {
                    props.toggleSidebar();
                    setShowNeighbours(e.currentTarget.checked);
                  }}
                  id="neighbour-switch"
                  checked={showNeighbours}
                  disabled = {sel === "image_point_layer" && props._active[2]!=null? false : true}// disabled
                />
              </Form>
            </Navbar.Collapse>
            {/* </div> */}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};
export default Optionsfield;
