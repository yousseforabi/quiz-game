import { useState,useEffect } from "react";
import "./CoinflipLightbox.css";
import AngelSvg from "./angel-svg.svg";
import SkullSvg from "./skull-svg.svg";


function CoinflipLightbox(props){
    
    useEffect(() => {
    if(props.flipResult === null)return
    console.log(props.flipResult)

    },[props.flipResult])

    const handleFlip = () => {
        props.setIsFlipping(true);
        props.setFlipResult(null)
        setTimeout(() => {
            const randomFlipResult = Math.random() < 0.5 ? "Heads" : "Tails";
            props.setFlipResult(randomFlipResult);
        },1500)

        setTimeout(() => {
          props.setIsFlipping(false);
        },4000)
    }


    return(
        <div className="light-box">
            <div className={`coin ${props.isFlipping ? "flip" : ""}`} onClick={handleFlip}>
                <div 
                className={`coin-heads ${props.flipResult === null ? "front" : props.flipResult === "Heads" ? "front" : "back"}`}
                ><img className="angel-svg" src={AngelSvg} ></img></div>
                <div className={`coin-tails ${props.flipResult === null ? "back" : props.flipResult === "Tails" ? "front" : "back"}`}
                > <img className="skull-svg" src = {SkullSvg}></img>
                </div>
            </div>
            <h1 style={{color:"white"}}>{props.flipResult && !props.isFlipping && (props.flipResult === "Heads" ? "You Survive" : " You lost ")}</h1>
        </div>
    )
}
export default CoinflipLightbox;
