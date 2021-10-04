import React, {Component, useEffect} from 'react';
import ReplayIcon from '@material-ui/icons/Replay';
import OpacityIcon from '@material-ui/icons/Opacity';
import StopIcon from '@material-ui/icons/Stop';
import BrushIcon from '@material-ui/icons/Brush';
import SaveIcon from '@material-ui/icons/Save';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import { ChromePicker } from 'react-color';
import { connectWallet, rgbToHEX } from '../work';

export default class IconBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            colorPickerVisability: "none"
        }
    }

sendUndoAction = () => {
    
    if( this.props.actionArray[this.props.actionArray.length - 1] == undefined ) {
        //Don't do anything if array is empty as it will break.
        
    } else {
        //grab context, copy array from prop
        let ctx = this.props.cRef.getContext('2d');
        let actionArray = this.props.actionArray
        //lastItem is the most recent array item, and actionArray is reduced by this value.
        let lastItem = actionArray.pop() 

        ctx.fillStyle = rgbToHEX(lastItem.color[0], lastItem.color[1], lastItem.color[2], lastItem.color[3]) 
        console.log(lastItem)
        console.log(rgbToHEX(lastItem.color[0], lastItem.color[1], lastItem.color[2], lastItem.color[3]))

        ctx.fillRect(lastItem.coordX, lastItem.coordY, 20, 20)
        this.props.updateDrawingArray(actionArray)
    }
}

showColorTool = () => {
    let visible = this.state.colorPickerVisability
    let changeVisability = (visible == "none") ? "initial": "none"
    this.setState({
        colorPickerVisability: changeVisability
    })
    
}

handlToolChange = (tool) => {
    this.props.sendTool(tool)
}

clearCanvas = () => {
    this.props.cRef.getContext('2d').fillStyle = "#fff"
    this.props.cRef.getContext('2d').fillRect(0, 0, 500, 500)
}

colorChangeComplete = (color) => {
    this.props.sendColor(color.hex);
};

getWallet = () => {
    connectWallet()
}


IconsBar = () => (

        <div className="icon-bar">
            <div className="ib-topSet">
                <button onClick={this.sendUndoAction}><ReplayIcon/></button>
                <button onClick={this.showColorTool}><OpacityIcon/></button>
                <div className="color-picker">
                    <ChromePicker 
                        color={ this.props.currentColor }
                        onChange={ this.colorChangeComplete }
                        disableAlpha={true}
                    />
                </div>
                <button onClick={() => this.props.sendTool("draw")}><BrushIcon/></button>
                <button onClick={() => this.props.sendTool("fill")}><FormatColorFillIcon/></button>
                <button onClick={() => this.getWallet()}><StopIcon/></button>
                <button onClick={this.clearCanvas}>Clear</button>
            </div>
            <div className="ib-bottomSet">
                <button><SaveIcon/></button>
                <button >Mint</button>
            </div>

        <style jsx>{`
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
            height: 7vh;
        }

        .ib-bottomSet {
            display: flex;
            margin-top: auto;
            flex-direction: column;
        }

        .icon-bar:nth-child(2): {
            color: ${this.props.currentColor}
        }

        .color-picker {
            display: ${this.state.colorPickerVisability};
            flex-grow: 2;
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
