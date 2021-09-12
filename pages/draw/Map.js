import React, {Component, useRef, useEffect, useState} from 'react';
import { getData, generateQrCode } from '../work';

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = { 

        };
        this.canvRef = React.createRef();
    }



    componentDidMount = () => {
        var mount = [0]
        this.props.sendMount(mount);    
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
        let ctx = vctx;
        let canv = vcanv;
        let x;
        let y;

        ctx.fillStyle = "#fff"
        let clicked
        ctx.fillRect(0, 0, 500, 500)

        this.draw = (e) => {
            //ctx will be the context of this canv
            ctx.fillStyle = this.props.toolColor;
            var x = e.offsetX// - 10;
            var y = e.offsetY// - 10;
            //Send to math.floor function to create pixelated coloring
            let sick = this.pixelated(x, y)
            let priorColor = ctx.getImageData(sick.newX, sick.newY, 20, 20).data.slice(0,4)
            let priorMove = {
                coordX: sick.newX,
                coordY: sick.newY,
                color: priorColor
            }
            //If array does not have atleast one item so .length returns something, 
            //next if statement will break. This check insures theres atleast one item added to array.
            if(this.props.actionArray[this.props.actionArray.length -1] == undefined) {
                let newDrawingArray = this.props.actionArray
                newDrawingArray.push(priorMove)
                this.props.updateDrawingArray(newDrawingArray)
            }

            console.log(priorColor)
            if((sick.newX == this.props.actionArray[this.props.actionArray.length -1].coordX && sick.newY == this.props.actionArray[this.props.actionArray.length -1].coordY)) {
                sameBlock = true
                if(ctx.fillStyle != this.rgbToHEX(priorColor[0], priorColor[1], priorColor[2], priorColor[3]) ) {
                    sameBlock = false
                }

            } 
            else {
                //Mouse has left prior pixel area, able to work as normal now.
                sameBlock = false
            }
            //Do not do this stuff if mouse is in same pixel
            if (!sameBlock) {
            // console.log(ctx.getImageData(sick.newX, sick.newY, 20, 20).data)
                ctx.fillRect(sick.newX, sick.newY, 20, 20)
                let newDrawingArray = this.props.actionArray
                newDrawingArray.push(priorMove)
                this.props.updateDrawingArray(newDrawingArray)
            //console.log(newDrawingArray)
            }
        }

        canv.onmousedown = (e) => {
            this.draw(e)
            clicked = true;
        }

        //Offset x and y are coordinates relative to the div (canvas)
        canv.onmousemove = (event) => {
            if(clicked) {
                this.draw(event)
            }
            if(!clicked) {
                x = event.offsetX
                y = event.offsetY
            }
        }

 
        canv.onmouseup = (event) => {
            sameBlock = false;
            clicked = false;
        }

    }

    getImageArray = () => {
        let img = getData(this.canvRef.current)
        //document.body.appendChild(img)
    }

    addImage = (x) => {
        document.body.appendChild(x)
    }
    
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
    
    MapCard = () => (
        
        <div className="mapcard">
            <canvas className="canvcard" width='500' height='500' ref={this.canvRef}>
            
            </canvas>
            <button onClick={this.getImageArray}>Hello</button>

        <style jsx>{`
        .mapcard {
            grid-column-start: med 2;
            grid-column-end: med 6;
            grid-row-start: med 2;
            grid-row-end: med 7;
        }
        .canvcard {
            display: flex;
            cursor: cell;
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


