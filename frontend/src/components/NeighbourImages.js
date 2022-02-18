import React from "react";
import { useState, useEffect } from "react";
import { Carousel, NavDropdown, Nav } from "react-bootstrap";
import { Form, ToggleButton, Container } from "react-bootstrap";
// import "./NeighbourImages.css";
const NeighbourCarousel = (props) => {
  return (
    <div id="Neighbour-carousel">
      {/* <div className="position-absolute bottom-0 end-0">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZLLySgSoxO_2YdpLDPJ-Zq8pHE07QsFH6w&usqp=CAU" class="rounded float-left" alt="..."/>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZLLySgSoxO_2YdpLDPJ-Zq8pHE07QsFH6w&usqp=CAU" class="rounded float-right" alt="..."/>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZLLySgSoxO_2YdpLDPJ-Zq8pHE07QsFH6w&usqp=CAU" class="rounded float-right" alt="..."/>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZLLySgSoxO_2YdpLDPJ-Zq8pHE07QsFH6w&usqp=CAU" class="rounded float-right" alt="..."/>
      </div> */}
      <Carousel variant="dark" className="w-50">
        <Carousel.Item className="align-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZLLySgSoxO_2YdpLDPJ-Zq8pHE07QsFH6w&usqp=CAU"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item className="align-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZLLySgSoxO_2YdpLDPJ-Zq8pHE07QsFH6w&usqp=CAU"
            alt="First slide"
          />
        </Carousel.Item>
        
      </Carousel>
    </div>
  );
};
export default NeighbourCarousel;
