import React from "react";
import classNames from "classnames";


const SideBar = ({ isOpen, toggle }) => (
  <div className={isOpen?"sidebarIsopen":"sidebar"}>
    Nearest Neighbours
  </div>
);


export default SideBar;
