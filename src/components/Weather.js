import React from 'react'

class Weather extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            degree_c    : props.degree_c,
            description : props.description
        }
    }

    render() {
        if (typeof this.state.degree_c === 'undefined' || this.state.degree_c < -100 || this.state.degree_c > 100)
            return <div className='Weather'></div>
        return <div className='Weather'>
            <span className='DegreeC'>{this.state.degree_c}°C</span>
            <span className='WeatherDescription'> ({this.state.description})</span>
        </div>
    }
}

export default Weather