import React from 'react';
import Moment from 'react-moment';

class Epoch extends React.Component {
    constructor(props) {
        super(props)
        var cheatedEpochTime = 0 + props.time + props.timezone * 3600000;
        var d = new Date(cheatedEpochTime)
        this.state = {
            date    : d,
            timezone: props.timezone
        };
    }

    render() {
        return <div>
            <div className="Date">
                <Moment date={this.state.date} format="YYYY/MM/DD"/>
            </div>
            <div className="Time">
                <Moment date={this.state.date} format="HH:mm:ss"/> GMT{this.state.timezone}
            </div>
        </div>
        
    }
}

export default Epoch