import React from "react";
import { useState, useEffect } from "react";
import { Navbar,Container,Row,Col } from "react-bootstrap";
import "./SideBar.css"
const SideBar = (props) => {
  
    // console.log("Neighbourdata",typeof(props.Neighbourdata),props.Neighbourdata)
    const [srcs, setSrcs] = useState(null);

    function loadimages(neighbour_list){
      console.log("LOADIMAGES CALLED",neighbour_list)
    }

    useEffect(()=>{
      loadimages(props.Neighbourdata)
      setSrcs(props.Neighbourdata)
    },[props.Neighbourdata])
    
    const renderLayerOptions = (option, i) => {
      console.log("renderLayerOptions called")
      let image = null;
      fetch(
        `https://graph.mapillary.com/${option}?fields=thumb_256_url&access_token=${process.env.REACT_APP_MAPILLARY_TOKEN}`
      )
        .then((res) => res.json())
        .then((result) => {
          image = result.thumb_256_url;
          document.getElementById(option).src = image;
          console.log("SIDEBAR IMAGE",image)
        })
        .catch((err) => console.log(err));
        console.log("image=",image)
      return (
        <>
          <Row
          >
            {option}
            <img className="img-fluid" id={option}></img>
          </Row>
        </>
      );
    };

  
  return (
    <>
     
            <div className={props.sidebarIsOpen ? "sidebarIsopen" : "sidebar"}>
              <Container className="imgconatiner">
              {/* {props.Neighbourdata && props.Neighbourdata.map(renderLayerOptions)} */}
              {props.Neighbourdata && props.Neighbourdata.map(renderLayerOptions)}
              </Container>
            </div>
    </>
  );
};

export default SideBar;
