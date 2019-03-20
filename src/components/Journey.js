import React from 'react'
import Article from './Article'
import MapView from './MapView'

/* json example:
  {
    "text": "*title* description.",
    "date_journal": 1520462657525, //date as epoch
    "address": "whatever location it is",
    "lat": 18.47440249999999,
    "lon": -77.92221484375,
    "weather": {
      "degree_c": 26,
      "description": "Few clouds"
    },
    "photos": [
      "photo1.jpg",
      "photo2.jpg",
      "photo3.jpg"
    ]
  }
*/

class Journey extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      directory : props.directory,
      jsonUrl   : props.jsonUrl,
      loaded  : false,
      name    : props.name,
      timezone  : props.timezone
    }
    this.mapRef = React.createRef()
    this.newMapMarkers = []
    this.onArticleFetch = this.onArticleFetch.bind(this)
  }

  componentDidMount() {
    fetch(this.state.jsonUrl)
    .then(res => {
      return res.json()
    }).then( data => {
      this.setState({
        jsonUrl : this.state.jsonUrl,
        loaded  : true,
        data  : data
      })
    })
  }

  componentDidUpdate() {
    this.updateMapMarkers()
  }

  updateMapMarkers() {
    if (this.newMapMarkers.length > 0 && this.mapRef.current) {
    this.newMapMarkers.forEach(m => {
      this.mapRef.current.addMarker(m.id, m.lon, m.lat, m.desc)
    })
    this.newMapMarkers = []
    }
  }

  onArticleFetch(article) {
    var desc = <div>
    <div>{article.getTitle()}</div>
    {article.getEpoch()}
    </div>
    this.newMapMarkers.push({id: article.getId(), lon: article.getLon(), lat: article.getLat(), desc: desc})
    this.updateMapMarkers()
  }

  render() {
    if (!this.state.loaded)
      return <div>....</div>
    var articles = this.state.data.articles.map(art => 
      <Article key={art} directory={this.state.directory} jsonUrl={art} photosData={this.state.data.photos} timezone={this.state.timezone} onFetch={this.onArticleFetch}/>
    )
    var googlePhotosLink = ''
    if (typeof this.props.googlePhotosUrl !== 'undefined' && this.props.googlePhotosUrl.length > 0)
      googlePhotosLink = <div className='GooglePhotosUrl'><a href={this.props.googlePhotosUrl}>google photos album (all photos)</a></div>
    return <div>
      <div className='JourneyName'>{this.state.name}</div>
        {googlePhotosLink}
      <MapView ref={this.mapRef} lon={this.state.data.mapLon} lat={this.state.data.mapLat} zoom={this.state.data.mapZoom}/>
      {articles}
    </div>
  }
}

export default Journey