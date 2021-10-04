import { useState } from "react";

const IconButton = (props) => {
    const[text, setText] = useState("Loading")
    const[icon, setIcon] = useState("null")

    return(
        <div>
            <button></button>
            <p>{text}</p>
            <style jsx>{`

            `}
            </style>
        </div>
    );
}
export default IconButton;