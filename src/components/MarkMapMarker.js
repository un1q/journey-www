import React from 'react'

class MarkMapMarker extends React.Component {
  static marked = false
  
  //set props.id
  constructor(props) {
    super(props)
    this.clicked = this.clicked.bind(this)
  }
  
  clicked(e) {
    if (MarkMapMarker.marked) {
      MarkMapMarker.marked.style.backgroundColor = ''
      MarkMapMarker.marked.style.borderColor     = ''
    }
    var mm = document.getElementById('mapMarker'+this.props.id)
    if (mm !== null) {
      MarkMapMarker.marked = mm.getElementsByClassName('MapMarkerPin')[0]
      MarkMapMarker.marked.style.backgroundColor = 'red'
      MarkMapMarker.marked.style.borderColor     = 'red'
    }
  }
  
  render() {
    return <div><a href="#map" onClick={this.clicked}>Pokaż na mapie</a></div>
  }
}

export default MarkMapMarker