import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import './App.css';
import Journey from './components/Journey';

var configuration = require('./configuration.js')

class App extends Component {
  render() {
    var nav = configuration.blogs.map(blog => {
      return <div key={blog.directory} className='NavigationLink'>
          <Link to={blog.directory}>{blog.name}</Link>
        </div>
    })
    var routes = configuration.blogs.map(blog => {
      return <Route key = {blog.directory} path={blog.directory} render={() => {
        return <Journey 
          name            = {blog.name           }
          directory       = {blog.directory      }
          jsonUrl         = {blog.jsonUrl        }
          timezone        = {blog.timezone       }
          googlePhotosUrl = {blog.googlePhotosUrl}
        />
      }}/>
    })
    
    return <Router>
      <div>
        <div className='Navigation'>{nav}</div>
        <div className='App'>{routes}</div>
      </div>
    </Router>
  }
}

export default App;
