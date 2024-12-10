import "./TimeoutLightbox.css";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';


function TimeoutLightbox(props){
    
    const [copied,setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(props.question).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false),1500);
        })
    }
    
    return(
        <div className="light-box">
            <h1 className="light-box-timer">{props.timer}</h1>
            <h2 style={{color:"white"}}>{props.question}</h2>
            <div className="clipboard-container">
                <button title="Copy to clipboard" className="clipboard-button" onClick={handleCopy}> <FontAwesomeIcon className="copy-icon" icon={faCopy}/> </button>
                <h2 className={`copy-feedback ${copied ? "show" : ""}`}>Copied</h2>
            </div>
            
        </div>
    )
}


export default TimeoutLightbox