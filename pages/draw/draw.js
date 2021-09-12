import React, {Component, PropTypes, useEffect, useState} from 'react';
import Document, { Main, NextScript } from 'next/document';
import Head from 'next/head'
import Color from './color';
import Map from './Map';
import Top from './Top';
import SelectTool from './SelectTool'
import IconsBar from './iconBar';

export default class Draw extends Document {
    constructor(props) {
        super(props)
        this.state = {
            tool: {
                tool: "Pen",
                width: 2
            },
            toolColor: "#fa8846",
            connectedUsers: [],
            canvRef: null,
            drawingActionsArray: []
        }
    }
    componentDidMount() {    
        this.setState({
            windowWidth: window.innerWidth
        })
        console.log(window.innerWidth) 
        console.log(window.devicePixelRatio)
    }

    componentDidUpdate() {
        console.log(window.innerWidth) 
        console.log(window.devicePixelRatio)
    }

    //Sent to color tool component to recieve tool color.
    _getToolColor = (col) => {
        this.setState({
            toolColor: col
        })
    }
    //Used for some crazy webhook idea
    _getDidMapMount = (yn) => {
        this.setState({
            connectedUsers: yn
        })
    }

    //Sent to Map component to get ref for drawing canvas.
    _getCanvasRef = (r) => {
        this.setState({
            canvRef: r
        })
    }

    //For handling drawing actions
    _updateDrawingArray = (act) => {
        this.setState({
            drawingActionsArray: act
        })
    }

    View = () => (
    console.log('s')
    )

    render() {
        return(
            <div className="container">
                <Head>
                    <title>Pixel Paint</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main>
                    <Top />
                    <Map 
                        sendRef={this._getCanvasRef}
                        sendMount={this._getDidMapMount} 
                        toolColor={this.state.toolColor}
                        selectedTool={this.state.tool}
                        updateDrawingArray={this._updateDrawingArray}
                        actionArray={this.state.drawingActionsArray}
                    />
                    <IconsBar 
                        updateDrawingArray={this._updateDrawingArray}
                        actionArray={this.state.drawingActionsArray}
                        currentColor={this.state.toolColor}
                        sendColor={this._getToolColor}
                        cRef={this.state.canvRef}
                    />
                </main>
                <div className="color-card">
                    <SelectTool cRef={this.state.canvRef} sendNewTool={this._getSelectedTool} />
                </div>

                <style jsx>{`
                .container {

                }

                .colorPick {
                    display: flex;
                    flex-wrap: wrap;
                }

                main {
                    display: grid;
                    grid-template-columns: repeat(8, 10vw [med]);
                    grid-template-rows: [med] 10vh repeat(6,10vh[med]) 25vh;
                    grid-column-gap: 3vw;
                    grid-row-gap: .71vh;
                }


                .color-card {
                    display: none;

                }

                @media (max-width: 600px) {
                    .grid {
                    width: 100%;
                    flex-direction: column;
                    }
                }

                @media screen and (max-width: 895px) {
                    .color-card {
                        order: 1;
                        height: 30vh;
                    }
                }

                `}</style>

                <style jsx global>{`
                @font-face {
                    font-family: 'Tungsten Bold';
                    src: url('/fonts/Tungsten-Bold.woff2');
			        font-style: normal;

                    font-family: 'LCD Solid';
                    src: url('/fonts/LCDSolid.ttf');
                    font-style: normal;
                }

                html,
                body {
                    padding: 0;
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
                    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                    background-color: #4d4d4d;
                    color: #EBEEE8;
                }

                * {
                    box-sizing: border-box;
                }
                `}</style>
            </div>
        );
    }

}

