import React from 'react'

class Pass extends React.Component {

    constructor(props) {
        super(props)
        this.state = { 
            input    : false
        }

        this.passInputRef = React.createRef()
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        this.setState({
            input : this.passInputRef.current.value
        })
        e.preventDefault();
    }

    render() {
        if (process.env.NODE_ENV === 'development' || (this.state.input && this.props.pass === this.state.input)) {
            return <div>
                {this.props.children}
            </div>
        }
        return <div className='Pass'>
            {(this.state.input)?<div className='WrongPass'>WRONG</div>:''}
            <form onSubmit={this.handleSubmit}>
                <label>
                    Password: <input type='password' ref={this.passInputRef}></input>
                </label>
                <input type='submit' value='Submit'/>
            </form>
        </div>
    }
}

export default Pass