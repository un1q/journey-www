import React from 'react'

//set props.lat and props.lon
class MapLink extends React.Component {
    render() {
        var lat = this.props.lat
        var lon = this.props.lon
        var link = `http://www.openstreetmap.org/index.html?lat=${lat}&lon=${lon}&zoom=10&mlat=${lat}&mlon=${lon}`
        return <div className='MapLink'><a href={link}>Mapa OSM (zewnętrzny link)</a></div>
    }
}

export default MapLink