import React from "react";

const Optionsfield = (props) => {
  // console.log("options field", props);
  const renderOptions = (option, i) => {
    return (
      <label key={option[i]} className="toggle-container">
        <input
          onChange={() => props.changeLayer(option)}
          checked={option === props.active_layer}
          name="toggle"
          type="radio"
        />
        <div className="toggle txt-s py3 toggle--active-white">
          {option}
        </div>
      </label>
    );
  };
  return (
    <div className="toggle-group absolute top left ml12 mt12 border border--2 border--white bg-white shadow-darken10 z1">
      {props.options.map(renderOptions)}
    </div>
  );
};

export default Optionsfield;
