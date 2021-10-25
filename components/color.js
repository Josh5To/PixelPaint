import React, {Component, useState} from 'react';
import { ChromePicker } from 'react-color';

const Red = "#e31010"
const Orange = "#f28313"
const Yellow = "#dde00d"
const Green = "#33d406"
const Blue = "#1710e3"
const Violet = "#5c00c4"
const Empty = "#b5b5b5"
var firstCustom = Empty
var secondCustom = Empty
var thirdCustom = Empty
var fourthCustom = Empty
const recentKey = "recentKey"

var activeColors = JSON.stringify({
    "recent": ["#e31010", "#f28313", "#dde00d", "#1710e3", "#ffffff", "#000000"],
    "favorites": [null, null, null, null, null]
})


const showColorPicker = (props) => {
    const [vis, setVis] = useState(false)

    const changeCol = (color) => {
        props.sendColor(color.hex)
    }

    const buttonStyle = {
        display: (vis  ? 'none' : 'initial'),
        display: "initial",
        alignSelf: "flex-start",
        alignContent: "stretch",
        width: "100%",
        background: "transparent",
        color: "white",
        border: "solid 2px white",
        cursor: "pointer",
        height: "100%"
    }

    const closeButtonStyle = {
        background: "transparent",
        color: "black",
        border: "none",
        position: "absolute",
        top: "-12%",
        marginLeft: "45%",
        textShadow: `0px 1px 0px white,
                     1px 0px 0px white,
                     0px -1px 0px white,
                     -1px 0px 0px white,
                     1px 0px 0px white,
                     1px 1px 0px white,  
                     -1px 1px 0px white, 
                     1px -1px 0px white,
                     -1px -1px 0px white  
        `,
        cursor: "pointer",
        fontSize: "1.2em"
    }

    const pickerStyle = {
        display: (vis  ? 'initial' : 'none'),
        position: "absolute"
    };

    return(
        <>
            <button style={buttonStyle} onClick={() => setVis((true))}>Custom</button>
            <div style={pickerStyle} className="chromePicker">
                <ChromePicker 
                    color={ props.currentColor }
                    onChange={ changeCol }
                    disableAlpha={true}
                />
                <button style={closeButtonStyle} onClick={() => setVis(false)}>X</button>
            </div>
        </>
    );
}

export default class Colors extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            recents: ["#e31010", "#f28313", "#dde00d", "#1710e3", "#ffffff", "#000000"]
        };   
    }
    

    colorChangeComplete = (color) => {
        this.props.sendColor(color.hex);
    };

    curColor = () => {
        return this.props.currentColor
    }


    changeColor = (color) => {
        this.props.sendColor(color);
        console.log("hhsss")
    }

    Color = () => {
        const recents = this.state.recents
        return(
            <div>
                <div className="ColorPicker">
                    <div className="activeColor"></div>
                    <div className="colors">
                        <div style={{backgroundColor: recents[0]}} onClick={() => this.changeColor(recents[0])}></div>
                        <div style={{backgroundColor: recents[1]}} onClick={() => this.changeColor(recents[1])}></div>
                        <div style={{backgroundColor: recents[2]}} onClick={() => this.changeColor(recents[2])}></div>
                        <div style={{backgroundColor: recents[3]}} onClick={() => this.changeColor(recents[3])}></div>
                        <div style={{backgroundColor: recents[4]}} onClick={() => this.changeColor(recents[4])}></div>
                        <div style={{backgroundColor: recents[5]}} onClick={() => this.changeColor(recents[5])}></div>
                        <div style={{backgroundColor: firstCustom}} onClick={() => this.changeColor(firstCustom)}></div>
                        <div style={{backgroundColor: secondCustom}} onClick={() => this.changeColor(secondCustom)}></div>
                        <div style={{backgroundColor: thirdCustom}} onClick={() => this.changeColor(thirdCustom)}></div>
                        <div style={{backgroundColor: fourthCustom}} onClick={() => this.changeColor(fourthCustom)}></div>
                    </div>
                </div>
                <div className="CustomColor">
                    {showColorPicker(this.props)}
                </div>
                <style jsx>{`
                    .ColorPicker {
                        max-height: 100%;
                    }

                    .activeColor {
                        height: 6vw;
                        width: 7vw;
                        border: solid 2px white;
                    }

                    .colors {
                        width: 7vw;
                        height: 31vh;
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        background-color: white;
                    }

                    .colors div {
                        width: 47%;
                        cursor: pointer;
                        margin: 1px 2% 1px 1%;
                    }

                    .CustomColor {
                        height: 5vh;
                        display: flex;
                        flex-direction: row;
                    }

                    .CustomColor button {

                    }

                    .chromePicker {
                        position: absolute;
                    }
                `}
                </style>
            </div>
        );
    }

    render() {
        return(
            <this.Color/>
        );
    }
}
