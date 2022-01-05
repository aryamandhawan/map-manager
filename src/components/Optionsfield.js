import React from "react";
import { useState, useEffect } from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Optionsfield = (props) => {
  const [sel, setSel] = useState(props.active_layer);
  useEffect(() => {
    console.log("seleced", sel);
    props.changeLayer(sel);
  }, [sel]);

  const renderOptions = (option, i) => {
    return (
      <>
        <NavDropdown.Item
          key={option[i]}
          onClick={(e) => {
            setSel(option);
          }}
        >
          {option}
        </NavDropdown.Item>
      </>
    );
  };
  return (
    <>
      <Navbar  bg="dark" variant="dark" expand="lg">
        <Nav className="navbar navbar-expand-sm ">
          <div class="navbar-nav ">
            <Nav.Link >Map-Manager v2.0</Nav.Link>
            <NavDropdown title={`Layer : ${sel}`} id="basic-nav-dropdown">
              {props.options.map(renderOptions)}
            </NavDropdown>
          </div>
        </Nav>
      </Navbar>
    </>
  );
};
export default Optionsfield;
