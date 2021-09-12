import React, {Component, useEffect} from 'react';
import ReplayIcon from '@material-ui/icons/Replay';
import BrushIcon from '@material-ui/icons/Brush';
import StopIcon from '@material-ui/icons/Stop';
import SaveIcon from '@material-ui/icons/Save';
import { ChromePicker } from 'react-color';

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

        ctx.fillStyle = this.rgbToHEX(lastItem.color[0], lastItem.color[1], lastItem.color[2], lastItem.color[3]) 
        console.log(lastItem)
        console.log(this.rgbToHEX(lastItem.color[0], lastItem.color[1], lastItem.color[2], lastItem.color[3]))

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

clearCanvas = () => {
    this.props.cRef.getContext('2d').fillStyle = "#fff"
    this.props.cRef.getContext('2d').fillRect(0, 0, 500, 500)
}

colorChangeComplete = (color) => {
    this.props.sendColor(color.hex);
};

rgbToHEX = (r, g ,b ,a) => {
    r = r.toString(16)
    g = g.toString(16)
    b = b.toString(16)
    //a = Math.round(a * 255).toString(16)

    if (r.length ==1) {
        r = "0" + r
    }
    if (g.length ==1) {
        g = "0" + g
    }
    if (b.length ==1) {
        b = "0" + b
    }
    /*if (a.length ==1) {
        a = "0" + a
    }*/

    return "#" + r + g + b// + a
}

IconsBar = () => (

        <div className="icon-bar">
            <button onClick={this.sendUndoAction}><ReplayIcon/></button>
            <button onClick={this.showColorTool}><BrushIcon/></button>
            <div className="color-picker">
                <ChromePicker 
                    color={ this.props.currentColor }
                    onChange={ this.colorChangeComplete }
                    disableAlpha={true}
                />
            </div>
            <button><StopIcon/></button>
            <button><SaveIcon/></button>
            <button onClick={this.clearCanvas}>Clear</button>

        <style jsx>{`
        .icon-bar {
            grid-column-start: med 6;
            grid-row-start: med 2;
            grid-row-end: med 7;
            display: flex;
            flex-direction: column;
            width: 60%;
            eight: 88%;
        }

        .icon-bar button {
            flex-basis: 0;
            flex-grow: 1;
            flex-shrink: 1;
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
