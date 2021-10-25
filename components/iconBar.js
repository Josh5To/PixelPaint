import React, {Component} from 'react';
import ReplayIcon from '@material-ui/icons/Replay';
import OpacityIcon from '@material-ui/icons/Opacity';
import StopIcon from '@material-ui/icons/Stop';
import BrushIcon from '@material-ui/icons/Brush';
import SaveIcon from '@material-ui/icons/Save';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import { ChromePicker } from 'react-color';
import { connectWallet, rgbToHEX, pinImage } from '../work';
const keyName = "movementObj"

export default class IconBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            colorPickerVisability: "none",
            errorIterations: 0,
            statusOpacity: 0,
            statusMessage: ""
        }
    }

sendUndoAction = () => {
    if(sessionStorage.getItem(keyName) != null) {
        if(JSON.parse(sessionStorage.getItem(keyName)).dataArray.length > 0) {
            let dataArray = JSON.parse(sessionStorage.getItem(keyName)).dataArray
            if ( dataArray == null ) {
                //Don't do anything if array is empty as it will break.
                
            } else {
                //grab context, copy array from prop
                let ctx = this.props.cRef.getContext('2d');
                //lastItem is the most recent array item, and actionArray is reduced by this value.
                let lastItem = dataArray.pop() 

                ctx.fillStyle = rgbToHEX(lastItem.color[0], lastItem.color[1], lastItem.color[2], lastItem.color[3]) 

                ctx.fillRect(lastItem.coordX, lastItem.coordY, 20, 20)
                sessionStorage.setItem(keyName, JSON.stringify({dataArray}))
            }
        }
    }
}

handlToolChange = (tool) => {
    this.props.sendTool(tool)
}

clearCanvas = () => {
    this.props.cRef.getContext('2d').fillStyle = "#fff"
    this.props.cRef.getContext('2d').fillRect(0, 0, 500, 500)
    if ( sessionStorage.getItem(keyName) == null ) {
        //Don't do anything if array is empty as it will break.
        
    } else {
        sessionStorage.removeItem(keyName)
    }
}

colorChangeComplete = (color) => {
    this.props.sendColor(color.hex);
};

getWallet = async () => {
    this.updateMessage("Connecting to wallet...")
    this.setState({
        statusOpacity: 1
    })
    connectWallet().then((wallet) => {
        console.log(wallet)
        if(wallet) {
            this.updateMessage("Succesfully connected to user via wallet.")
            this.props.sendConnected(true)
            this.setState({
                statusOpacity: 0
            });
        }
        else {
            this.updateMessage("Unable to succesfully connect to wallet. Please make sure you are signed in to MetaMask.")
            this.props.sendConnected(false)
            this.setState({
                statusOpacity: 0
            });
        }
    })
}

toPin = async () => {
    pinImage(this.props.cRef).then((pinResponse) => {
        if(pinResponse) {
            this.setState({
                statusMessage: JSON.parse(pinResponse).IpfsHash
            });
            this.iterateError()
            console.log(this.statusMessage)
        }
    })
}

iterateError = () => {
    let iterate = this.state.errorIterations + 1
    this.setState({
        errorIterations: iterate
    })
}

updateMessage = (message) => {
    this.setState({
        statusMessage: message
    })
}


IconsBar = () => (
        <div className="icon-bar">
            <div className="ib-topSet">
                <button onClick={this.sendUndoAction}><ReplayIcon/></button>
                <button onClick={() => this.props.sendTool("draw")}><BrushIcon/></button>
                <button onClick={() => this.props.sendTool("fill")}><FormatColorFillIcon/></button>
                <button onClick={() => this.getWallet()}><StopIcon/></button>
                <button onClick={this.clearCanvas}>Clear</button>
            </div>
            <div className="ib-bottomSet">
                <button><SaveIcon/></button>
                <button onClick={() => this.toPin()}>Mint</button>
            </div>
            <div className="error-popup"><p>{this.state.statusMessage}</p></div>

        <style jsx>{`
        @keyframes example {
            0% {background: none;}
            25% {background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 49%);}
            50% {background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);}
            75% {background: radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%);}
            100% {background: radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%, rgba(255,255,255,0) 100%);}
        }

        @keyframes errorVisibility {
            from {
                opacity: 0;
            }

            5% {
                opacity: 1;
            }

            75% {
                opacity: 0;
            }
        }

        .icon-bar {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 6vw;
            align-self: stretch;
        }

        .ib-topSet {
            display: flex;
            flex-direction: column;
            height: 60%;
            max-width: 6vw;
        }

        .ib-topSet button, .ib-bottomSet button {
            flex-grow: 1;
            width: 9vh;
            height: 9vh;
            background: transparent;
            color: white;
            border: solid 2px white;
            cursor: pointer;
            transition: background 5000ms
        }

        .ib-topSet button:focus, .ib-bottomSet button:focus {
            animation-name: example;
            animation-duration: .2s;
            animation-timing-function: ease;
        }

        .ib-bottomSet {
            display: flex;
            margin-top: auto;
            flex-direction: column;
        }

        .icon-bar:nth-child(2): {
            color: ${this.props.currentColor}
        }

        .error-popup {
            position: fixed;
            right: 5%;
            top: 20px;
            width: 20vw;
            text-align: center;
            margin: auto;
            display: inline;
            
            opacity: ${this.state.statusOpacity};
            box-shadow: 0px 0px 6px 1px rgba(255,255,255,0.81);
            border-radius: 1px;
            animation-name: errorVisibility;
            animation-duration: 10s;
            animation-timing-function: ease;
            animation-iteration-count: ${this.state.errorIterations};
            transition: opacity 2s ease-out;
        }

        .error-popup p {
            word-wrap: anywhere;
            animation-name: errorVisibility;
            animation-duration: 10s;
            animation-timing-function: ease;
            animation-iteration-count: ${this.state.errorIterations};
        }
       
        @media screen and (max-width: 895px) {

        }

        @media screen and (min-width: 895px) {

        }

        `}</style>
        </div>
    )

    render() {
        return(
            <this.IconsBar/>
        );
    }
}   
