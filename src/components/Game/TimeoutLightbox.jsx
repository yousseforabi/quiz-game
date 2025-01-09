import "./TimeoutLightbox.css";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';


function TimeoutLightbox(props){
    
    const [copied,setCopied] = useState(false);

    const handleCopy = () => {
        let copyText ="Give me the correct answer." + "\n" + props.question + "\n"

        for(let i = 0; i < props.answers.length; i++){
            copyText += props.answers[i] + (i === props.answers.length - 1 ? " ": ", ")
        }

        navigator.clipboard.writeText(copyText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false),1500);
        })
    }
    const resumeGame = () => {
        props.setGameState((prevState) => ({
            ...prevState,
            googleTimeoutActive:false,
            googleTimer:45
        }))
    }
    return(
        <div className="light-box">
            <h1 className="light-box-timer">{props.timer}s</h1>
            <h2 className="light-box-timeout-header">{props.question}</h2>
            <div className="clipboard-container">
                <button title="Copy to clipboard" className="clipboard-button" onClick={handleCopy}> <FontAwesomeIcon className="copy-icon" icon={faCopy}/> </button>
                <h2 className={`copy-feedback ${copied ? "show" : ""}`}>Copied</h2>
            </div>
            <a className="chatgpt-link" href="https://chatgpt.com/" target="_blank">Chatgpt.com</a>
            <button onClick={resumeGame}>Ready to answer</button>
        </div>
    )
}


export default TimeoutLightbox