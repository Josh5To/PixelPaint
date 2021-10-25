import React, {Component} from 'react';
import { hexToRGB, rgbToHEX, pinImage } from '../work';
import {connectionStatus} from './middleComponents/connectionStatus'

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = { 

        };
        this.canvRef = React.createRef();
    }



    componentDidMount = () => {
        this.drawCtx = this.canvRef.current.getContext('2d');
        this.rendCanvas(this.canvRef.current, this.drawCtx)
    }

    updateTool = (ncanv) => {
        ncanv.fillStyle = this.props.toolColor
        ncanv.strokeStyle = this.props.toolColor
    }

    clearCanvas = () => {
        ctx.fillStyle = "#fff"
        this.canvRef.current.getContext('2d').fillRect(0, 0, 500, 500)
    }

    /*
     Recieves pixel coordinates, divides them by 20 and rounds down to closest number, 
     then multiplies again. This way, only 25 blocks of 20 pixels wide can be filled, creating the pixelation effect.
    */
    pixelated = (x, y) => {
        let divX = x / 20  
        let newX = Math.floor(divX) * 20
        //console.log(newX)

        let divY = y / 20 
        let newY = Math.floor(divY) * 20
        //console.log(newY)

        return {newX, newY}
    }

    rendCanvas = (vcanv, vctx) => {  
        //sameBlock is set to false if mouse is moving but on the same 'pixelated' area. 
        //This keeps priormove array size down do to not reporting duplicates, which makes the undo button work more betterly
        let sameBlock

        this.props.sendRef(vcanv)  
        //Get parsed json object of moves
        let ctx = vctx;
        let canv = vcanv;
        let x;
        let y;
        let keyName = "movementObj"
        var dataArray
        let clicked



        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, 500, 500)
        sessionStorage.removeItem(keyName)

        this.draw = (e) => {
            if(sessionStorage.getItem(keyName) != null) {
                dataArray = JSON.parse(sessionStorage.getItem(keyName)).dataArray
            }
            //ctx will be the context of this canv
            ctx.fillStyle = this.props.toolColor;
            let sizeOffX = (500 / parseInt(this.canvRef.current.offsetWidth))
            let sizeOffY = (500 / parseInt(this.canvRef.current.offsetHeight))

            var x = e.offsetX * sizeOffX
            var y = e.offsetY * sizeOffY

            //Send to math.floor function to create pixelated coloring
            let sick = this.pixelated(x, y)
            let priorColor = ctx.getImageData(sick.newX, sick.newY, 20, 20).data.slice(0,4)
            let priorMove = {
                coordX: sick.newX,
                coordY: sick.newY,
                color: priorColor,
                type: "draw"
            }
            //If array does not have atleast one item so .length returns something, 
            //next if statement will break. This check insures theres atleast one item added to array.
            if(sessionStorage.getItem(keyName) == null) {
                let movementObj = {
                    dataArray: []
                }
                ctx.fillRect(sick.newX, sick.newY, 20, 20)
                movementObj.dataArray.push(priorMove)
                sessionStorage.setItem(keyName, JSON.stringify(movementObj))
                console.log(dataArray)
            } else if(dataArray[dataArray.length -1] != undefined) {
                if((sick.newX == dataArray[dataArray.length -1].coordX && sick.newY == dataArray[dataArray.length -1].coordY)) {
                    if(rgbToHEX(priorColor[0], priorColor[1], priorColor[2], priorColor[3]) === ctx.fillStyle) {

                    } else {
                        ctx.fillRect(sick.newX, sick.newY, 20, 20)
                        dataArray.push(priorMove)
                        sessionStorage.setItem(keyName, JSON.stringify({dataArray}))
                    }
                } else {
                    if(ctx.fillStyle != rgbToHEX(priorColor[0], priorColor[1], priorColor[2], priorColor[3]) ) {
                        ctx.fillRect(sick.newX, sick.newY, 20, 20)
                        dataArray.push(priorMove)
                        sessionStorage.setItem(keyName, JSON.stringify({dataArray}))
                    }
                }
            } else {
                if(ctx.fillStyle != rgbToHEX(priorColor[0], priorColor[1], priorColor[2], priorColor[3]) ) {
                    ctx.fillRect(sick.newX, sick.newY, 20, 20)
                    dataArray.push(priorMove)
                    sessionStorage.setItem(keyName, JSON.stringify({dataArray}))
                }
            }
        }

        this.canvRef.current.onmousedown = (e) => {   
            clicked = true;
            if (this.props.currentTool == "fill") {
                this.fillArea(e, ctx)
            }
            else {
                this.draw(e)
            }
        }

        //Offset x and y are coordinates relative to the div (canvas)
        this.canvRef.current.onmousemove = (event) => {
            if(clicked) {
                if (this.props.currentTool == "fill") {
                }
                else {
                    this.draw(event)
                }
            }
            if(!clicked) {
                x = event.offsetX
                y = event.offsetY
            }
        }

        this.canvRef.current.onmouseleave = () => {
            sameBlock = false;
            clicked = false;
        }
 
        this.canvRef.current.onmouseup = (event) => {
            sameBlock = false;
            clicked = false;
        }

    }

    addImage = (x) => {
        document.body.appendChild(x)
    }

    //Thank you, William (www.williammalone.com)
    fillArea = (e, ctx) => {
        //This can remain the static "should be" size of the canvas
        let canvasWidth = 500
        let canvasHeight = 500
        //Get offset (ratio) of actual canvas size vs set canvas size (x,y)
        let sizeOffX = (500 / parseInt(this.canvRef.current.offsetWidth))
        let sizeOffY = (500 / parseInt(this.canvRef.current.offsetHeight))
        //Floor the click coord * the offset ratio to recieve where click is. (Can't be a float)
        let calcX = Math.floor(e.offsetX * sizeOffX)
        let calcY = Math.floor(e.offsetY * sizeOffY)


        let pixelStack = [[calcX, calcY]];
        let pixelCoord = this.pixelated(calcX, calcY)
        //get copy of imagedata to update here and paint ctx later
        let colorLayer = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
        //get startColor HEX value
        let startColor = ctx.getImageData(pixelCoord.newX, pixelCoord.newY, 2, 2).data.slice(0,4)
        //get tool color for scope sake
        let fillColor = hexToRGB(this.props.toolColor)


        //This breaks if you try to use the fill tool to fill the same color, so this prevents this.
        if(rgbToHEX(startColor[0],startColor[1],startColor[2]) != this.props.toolColor) {
            while(pixelStack.length) {
                let newPos = pixelStack.pop();
                let x = newPos[0];
                let y = newPos[1];
                
                let pixelPos = (y*canvasWidth + x) * 4;
                //This loop ensures logic stops at top of canvas
                while(y-- >= 0 && matchStartColor(pixelPos))
                {
                    pixelPos -= canvasWidth * 4;
                }
                pixelPos += canvasWidth * 4;
                ++y;
                let reachLeft = false;
                let reachRight = false;
                while(y++ < canvasHeight-1 && matchStartColor(pixelPos)) {
                    colorPixel(pixelPos);

                    if(x > 0)
                    {
                        if(matchStartColor(pixelPos - 4))
                        {
                            if(!reachLeft){
                                pixelStack.push([x - 1, y]);
                                reachLeft = true;
                            }
                        }
                        else if(reachLeft)
                        {
                            reachLeft = false;
                        }
                    }
                    
                    if(x < canvasWidth-1)
                    {
                        if(matchStartColor(pixelPos + 4))
                        {
                            if(!reachRight)
                            {
                            pixelStack.push([x + 1, y]);
                            reachRight = true;
                            }
                        }
                        else if(reachRight)
                        {
                            reachRight = false;
                        }
                    }
                            
                    pixelPos += canvasWidth * 4;
                }
            }    
            ctx.putImageData(colorLayer, 0, 0);
        }

        function matchStartColor(pixelPos) {
            var r = colorLayer.data[pixelPos];	
            var g = colorLayer.data[pixelPos+1];	
            var b = colorLayer.data[pixelPos+2];
    
            return (r == startColor[0] && g == startColor[1] && b == startColor[2]);
        }

        function colorPixel(pixelPos) {
            colorLayer.data[pixelPos] = fillColor[0];
            colorLayer.data[pixelPos+1] = fillColor[1];
            colorLayer.data[pixelPos+2] = fillColor[2];
            colorLayer.data[pixelPos+3] = 255;
        }

    }

    
    MapCard = () => (
        
        <div className="mapcard">
            <canvas className="canvcard" width='500' height='500' ref={this.canvRef}>
            
            </canvas>
            <div className="connection-notice">{connectionStatus(this.props.userConnected)}</div>

        <style jsx>{`
        .mapcard {
            cursor: ${this.props.currentTool == "fill" ? "url(images/fill-cursor2.png), pointer" : "cell"};
            display: flex;
            flex-direction: column;
        }
        .canvcard {
            height: 100%;
        }
        .connection-notice {
            cursor: default;
            position: absolute;
            top: 15%;
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
            <this.MapCard/>
        );
    }
}


