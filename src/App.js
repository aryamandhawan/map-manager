import React,{ReactDOM} from 'react';
import Map from './Map';

class App extends React.Component {
  
  constructor(props){
    super(props);
    this.state ={
    layer:"image_point_layer",
    style:"mapbox://styles/mapbox/streets-v11"
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(){
    console.log(this.state.layer);
    this.setState({ layer : "sequence_layer" }); 
  }
 
  render() {
    return (
      <div>
        <div className="btn">
        <button onClick={this.handleClick}>{this.state.layer}</button>
        </div>
        <div >
          <Map lng="138.60345125198364" lat="-34.929553631263" layer={this.state.layer} style={this.state.style}/>
        </div>
      </div>
    );
  }
}
  
export default App;