import React, {Component, PropTypes, useEffect, useState} from 'react';
import Document, { Main, NextScript } from 'next/document';
import Head from 'next/head'
import Colors from './color';
import Map from './Map';
import Top from './Top';
import SelectTool from './SelectTool'
import IconsBar from './iconBar';

export default class Draw extends Document {
    constructor(props) {
        super(props)
        this.state = {
            tool: "draw",
            toolColor: "#fa8846",
            connectedUsers: false,
            canvRef: null,
            drawingActionsArray: []
        }
    }
    componentDidMount() {    
        this.setState({
            windowWidth: window.innerWidth
        })
    }

    componentDidUpdate() {
    }

    //Sent to color tool component to recieve tool color.
    _getToolColor = (col) => {
        this.setState({
            toolColor: col
        })
    }
    //Used for some crazy webhook idea
    _getUserConnected = (yn) => {
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

    _updateTool = (r) => {
        this.setState({
            tool: r
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
                    <div className="middle-row">
                        <Colors
                            sendColor={this._getToolColor}
                            currentColor={this.state.toolColor}
                        />
                        <Map 
                            sendRef={this._getCanvasRef}
                            sendConnected={this._getUserConnected} 
                            userConnected={this.state.connectedUsers}
                            toolColor={this.state.toolColor}
                            currentTool={this.state.tool}
                            updateDrawingArray={this._updateDrawingArray}
                            actionArray={this.state.drawingActionsArray}
                        />
                        <IconsBar 
                            updateDrawingArray={this._updateDrawingArray}
                            actionArray={this.state.drawingActionsArray}
                            currentColor={this.state.toolColor}
                            sendColor={this._getToolColor}
                            currentTool={this.state.tool}
                            sendTool={this._updateTool}
                            cRef={this.state.canvRef}
                            sendConnected={this._getUserConnected} 
                            userConnected={this.state.connectedUsers}
                        />
                    </div>
                </main>
                <footer>

                </footer>

                <style jsx>{`
                .container {

                }

                .colorPick {

                }

                main {
                    display: flex;
                    flex-direction: column;
                }

                .middle-row {
                    order: 2;
                    display: flex;
                    justify-content: center;

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
                    background-color: #242424;
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

