import React, {Component} from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { Pencil, CircleFill } from 'react-bootstrap-icons';

const Pen = {
    tool: "Pen",
    width: 2
}

const Circle = {
    tool: "Circle",
    width: 6
}

export default class SelectTool extends Document {
    constructor(props) {
        super(props)
        this.state = {
            selected: 'pen'
        }
    }

    updateTool = (sent) => {
        switch(sent){
            case 'pen':
                this.props.sendNewTool(Pen.tool, Pen.width)
                break;
                
            case 'circle':
                this.props.sendNewTool(Circle.tool, Circle.width)
                break;
        }
        this.setState({
            selected: sent
        })
    }

    clearCanvas = () => {
        this.props.cRef.getContext('2d').fillStyle = "#fff"
        this.props.cRef.getContext('2d').fillRect(0, 0, 500, 500)
    }

    selectOption = () => (
        <div className="tool-select">
            <div className="clrButton">
                <button onClick={this.clearCanvas}>
                    Clear
                </button>
            </div>
            <style jsx>{`
            .tool-select select {
                background-color: fff;
                border: .6px solid #a4a4a4;
                appearance: none;
                -webkit-appearance: none;
                background-image: url(/down-arrow.svg);
                background-repeat: no-repeat, repeat;
                background-position: right .7em top 50%, 0 0;
                background-size: .65em auto, 100%;
                height: 5vh;

            }
            .tool-select select:hover {
                border: .6px solid #f29797;
            }

            .tool-select div {
                display: flex;
                justify-content: space-evenly;
                font-size: 4vh;
                padding-top: 2vh;
            }

            .tool-select div a {
                padding: 1vh;
                cursor: pointer;
            }

            .clrButton button {
                padding: 10px;
                background-color: #202b43;
                border: none;
                color: white;
                height: 6vh;
                width: 11vw;
                font-size: 1rem;
                cursor: pointer;
            }

            .pen{
                
                color: ${this.state.selected === 'pen' ? '#202b43' : 'white'};
                background-color: ${this.state.selected === 'pen' ? 'white' : '#202b43'};
            }

            .circle {
                color: ${this.state.selected === 'circle' ? '#202b43' : 'white'};
                background-color: ${this.state.selected === 'circle' ? 'white' : '#202b43'};
            }

            `}</style>
        </div>
    )

    render() {
        return(
            <this.selectOption />
        );
    }
}