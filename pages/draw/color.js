import React, {useEffect, useState } from 'react';
import Document from 'next/document';


export default class Color extends Document {
    constructor(props) {
        super(props)
        this.state = {
            circleColor: null,
        }
        this.canvRef = React.createRef();
    }

    windowSize = () => {
        const [windowHeight, setCurrentHeight] = useState(1920);
        const [windowWidth, setCurrentWdith] = useState(1080);

        useEffect(() => {

        })
    }

    handleChangeComplete = (color) => {
        console.log(color.hex)
        this.props.sendColor(color.hex);
    };

    colorPick = () => {
        
        return(
            <ChromePicker 
                color={ this.props.paintColor }
                onChange={ this.handleChangeComplete }
                disableAlpha={true}
            />
            );
    }
    
    handleClick = name => {
        console.log(name);
         
    }

    render() {

        return(
            <this.colorPick/>
        );
    }
}

