import React from 'react'
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

class PhotosList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            photos     : props.photos //for example: [{src: 'path/to/jpg', miniature: 'path/to/jpg', width: 100, height: 200},...]
        }
    }

    handleClick(e, i) {
        e.preventDefault()
        
        var pswpElement = document.querySelectorAll('.pswp')[0];

        var items = this.state.photos.map( photo => {
            return {
                src : photo.src,
                w   : photo.width,
                h   : photo.height
            }
        })

        var options = {
            index: i
        };

        var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    }

    render() {
        var photos = [];
        for (var i=0; i<this.state.photos.length; i++) {
            var photo = this.state.photos[i]
            const nr = i;
            photos.push(<img className='PhotoMiniature' key={i} src={photo.miniature} onClick={(e) => this.handleClick(e, nr)} alt={photo.src}/>)
        }
        return <div>
            {photos}
        </div>
    }
}

export default PhotosList