import React         from 'react';
import Epoch         from './Epoch';
import PhotosList    from './PhotosList';
import MapLink       from './MapLink';
import Weather       from './Weather';
import MarkMapMarker from './MarkMapMarker';
import Movie         from './Movie';

class Article extends React.Component {
  constructor(props) {
    super(props)
    //jsonUrl - url to json with article, for example:
    //  {"text":"...","date_modified":0,"date_journal":0,"id":"0","preview_text":"...","address":"","music_artist":"","music_title":"","lat":0,"lon":0,"mood":0,"weather":{"id":0,"degree_c":0,"description":"","place":"Montego Bay"},"photos":["1.jpg","2.jpg"],"tags":[]};
    //photosData - additional data of all photos, for example:
    //[
    // {
    // "Width": 1080,
    // "Name": "1520462657525-3fd76fc42b23cada-3fcc8bc7aee39f80.jpg",
    // "Height": 607,
    // "Miniature": "resized_1520462657525-3fd76fc42b23cada-3fcc8bc7aee39f80.jpg"
    // },
    // {
    // "Width": 1080,
    // "Name": "1520462657525-3fd76fc42b23cada-3fe1c5d3116b2c37.jpg",
    // "Height": 607,
    // "Miniature": "resized_1520462657525-3fd76fc42b23cada-3fe1c5d3116b2c37.jpg"
    // }
    //]
    this.state = {
      loaded   : false,
      title    : '',
      text     : ''
    }
    this.textRegex    = /\*(.*)\*(.*)/s
    this.titleRegexId = 1
    this.textRegexId  = 2
  }

  componentDidMount() {
    fetch(this.props.directory + "/" + this.props.jsonUrl)
    .then(res => {
      return res.json()
    }).then( data => {
      var title = data.address
      var text  = data.text
      var res   = this.textRegex.exec(data.text)
      if (res !== null) {
        title = res[this.titleRegexId]
        text  = res[this.textRegexId]
      }
      this.setState({
        jsonUrl : this.props.jsonUrl,
        loaded  : true,
        json    : data,
        title   : title,
        text    : text
      })
      if (typeof this.props.onFetch !== 'undefined')
        this.props.onFetch(this);
    }).catch( error => {
        console.log('error while parsing article json ' + this.props.jsonUrl)
        console.log(error)
    })
  }

  getPhotoData(name) {
    var photoData = this.props.photosData.find(d => d.Name === name)
    if (typeof photoData === 'undefined') {
      console.log("Error: Photo definition not found: " + name + "; article: " + this.props.jsonUrl)
      console.log("all photo definitions:")
      console.log(this.props.photosData)
      return {
        Miniature: this.props.directory + '/resized_' + name,
        Width  : 1024,
        Height   : 768
      }
    }
    return photoData
  }

  getLon() {
    return this.state.json.lon
  }
  
  getLat() {
    return this.state.json.lat
  }
  
  getId() {
    return this.props.jsonUrl
  }
  
  getEpoch() {
    return <Epoch time={this.state.json.date_journal} timezone={this.props.timezone}/>
  }
  
  getTitle() {
    return this.state.title
  }
  
  getText() {
    return this.state.text
  }
  
  getAddress() {
    return this.state.json.address
  }
  
  createAttachments() {
    if (this.state.json.photos.length === 1 && /.*\.mp4$/.test(this.state.json.photos[0])) {
      return <Movie src={this.state.json.photos[0]}/>
    } else {
      var photos = this.state.json.photos.map(name => {
        var data = this.getPhotoData(name)
        return {
          'src'    : this.props.directory + '/' + name, 
          'miniature': this.props.directory + '/' + data.Miniature,
          'width'  : data.Width,
          'height'   : data.Height
        }
      })
      return <PhotosList photos={photos} photosData={this.props.photosData}/>
    }

  }
  
  render() {
    if (!this.state.loaded)
      return <div>...</div>;
    return <div className='Article' id={this.getId()}>
      <div className='ArticleHeader'>
        {this.getEpoch()}
        <div className='ArticleAdditionalInfo'>
          <div className='Address'>{this.getAddress()}</div>
          <MarkMapMarker id={this.getId()}/>
          <MapLink lon={this.getLon()} lat={this.getLat()}/>
          <Weather degree_c={this.state.json.weather.degree_c} description={this.state.json.weather.description}/>
        </div>
      </div>
      <div className='ArticleMain'>
        <div className='ArticleTitle'>{this.getTitle()}</div>
        <div>{this.getText()}</div>
        {this.createAttachments()}
        <div className='ArticleName'>{this.props.jsonUrl}</div>
      </div>
    </div>
  }
}

export default Article