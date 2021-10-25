import React, {useEffect, useState} from 'react';

export function connectionStatus(props) {
    const [connectedStatus, setConnectedStatus] = useState("🚫")

    useEffect(() => {
        setConnectedStatus(((props == true) ? `✅ Connected` : `🚫 Not Connected`))
    })

    const buttonStyle = {
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

    return(
        <>
            <div>
                 <p>{connectedStatus} &#9432;</p>
            </div>
            <style jsx>{`
                div {
                    
                }
            `}</style>
        </>
    );
}