import React from "react";
import { useState, useEffect } from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import { Form,ToggleButton, Container } from "react-bootstrap";
const Optionsfield = (props) => {
  const [sel, setSel] = useState(props._active[0]);
  const [region, setRegion] = useState(props._active[1]);
  const [showNeighbours, setShowNeighbours] = useState(false);
  const [v,setv] = useState(props._active[2]);

  useEffect(() => {
    console.log("[NAVBAR] v", props._active[2]);
    // props._functions[0](sel);
  }, [v]);

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
    props._functions[2](showNeighbours);
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
          <Navbar.Brand>Map-Manager</Navbar.Brand>
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

              {/* <ToggleButton
                className="mb-2"
                id="toggle-neighbours"
                type="checkbox"
                variant={showNeighbours ? "primary" : "secondary"}
                checked={showNeighbours}
                value="1"
                onChange={(e) => {
                  setShowNeighbours(e.currentTarget.checked);
                }}
              >
                Show Neighbours
              </ToggleButton>         */}
              <Navbar.Text style={{ "paddingRight": 10 }}>Show Neighbours  </Navbar.Text>
              <Form>
                <Form.Switch
                  onChange={(e) => {
                    setShowNeighbours(e.currentTarget.checked);
                  }}
                  id="neighbour-switch"
                  checked={showNeighbours}
                  // disabled = {showNeighbours}// disabled 
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
