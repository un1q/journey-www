import React from 'react'
import 'ol/ol.css';
import {Map, View, Overlay} from 'ol';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import {Tile as TileLayer} from 'ol/layer.js';


class MapView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      markers   : [],
      newMarkers: []
    }
    this.updateSize = this.updateSize.bind(this)
  }

  componentDidMount() {
    var layer = new TileLayer({
      source: new OSM()
    });
    var map = new Map({
      layers: [layer],
      target: 'map',
      view: new View({
      center: fromLonLat([this.props.lon, this.props.lat]),
      zoom: this.props.zoom
      })
    });
    this.map = map
    window.addEventListener("resize", this.updateSize)
    this.updateSize()
  }
  
  componentWillUnmount() {
      window.removeEventListener("resize", this.updateSize)
  }
  
  componentDidUpdate() {
    if (this.state.newMarkers.length === 0)
      return;
    this.state.newMarkers.forEach((m => {
      var marker = new Overlay({
        position: fromLonLat([m.lon, m.lat]),
        positioning: 'center-center',
        element: document.getElementById('mapMarker'+m.id),
        stopEvent: false
      });
      this.map.addOverlay(marker);
    }))
    var newState = this.state
    newState.newMarkers = []
    this.setState(newState)
    //this.state.newMarkers = []
  }

  addMarker(id, lon, lat, desc) {
    var state = this.state
    var marker = {
      id  : id,
      lon : lon,
      lat : lat,
      desc: desc
    }
    state.newMarkers.push(marker)
    state.markers.push(marker)
    this.setState(state)
  }
  
  updateSize() {
    setTimeout( this.map.updateSize, 200)
  }
  
  render() {
    var markers = this.state.markers.map(m => {
      return <a href={'#'+m.id} key={'mapMarker'+m.id} id={'mapMarker'+m.id} className='MapMarker'>
        <div className='MapMarkerPin'/>
        <div className='MapMarkerText'>{m.desc}</div>
      </a>
    })
    return <div className='MapView'>
      <div id="map"></div>
      {markers}
    </div>
  }
}

export default MapView