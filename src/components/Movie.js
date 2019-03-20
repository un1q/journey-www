import React from 'react'

class Movie extends React.Component {
  //props.src
  //constructor(props) {
  //  super(props)
  //}
  //
  //componentDidMount() {
  //}
  //
  //componentDidUpdate() {
  //}

  render() {
    return <video width="320" height="240" controls>
      <source src={this.props.src} type="video/mp4"/>
      Your browser does not support the video tag.
    </video>
  }
}

export default Movie
