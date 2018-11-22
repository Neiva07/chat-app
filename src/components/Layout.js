import React, {Component} from 'react';
import io from 'socket.io-client';

const socketUrl = "http://localhost:3231"

export default class Layout extends Component {

    constructor(props) {
        super(props);

        this.state ={
            socket: null
        }
    }
    componentDidMount() {
        this.initSocket();
    }

    initSocket = () => {
        const socket = io(socketUrl) 
        socket.on('connect', () => {
            console.log('client connect!')
        })
        this.setState({socket})
    }

    render(){
        const {title} = this.props; 
        return (
            <div className="container">
                {title}
            </div>
        )
    }
}
