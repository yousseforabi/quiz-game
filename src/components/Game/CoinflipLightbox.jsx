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
        setTimeout(() => {
            const randomFlipResult = Math.random() < 0.5 ? "Heads" : "Tails";
            props.setFlipResult(randomFlipResult);
        

        setTimeout(() => {
          props.setIsFlipping(false);
        },2500)

        setTimeout(() => {
            props.setGameState((prevState) => ({
                ...prevState,
                coinFlipsAvailable:0,
                activeCoinFlip:false,
                playerLives: randomFlipResult === "Heads" ? prevState.playerLives + 1 : 0,
                isGameOver: randomFlipResult === "Tails" ? true : prevState.isGameOver
            }))
        },4500)
    },1500)
    }


    return(
        <div className="light-box">
           <h1 className="coin-flavor-text">
                {props.flipResult && !props.isFlipping
                    ? props.flipResult === "Heads"
                    ? "You live to see another question!"
                    : "The coin wasn’t in your favor."
                    : "Game over... or is it? Flip the coin to find out."
                }
            </h1>
            <div className={`coin ${props.flipResult !== null ? "disable-coin": ""} ${props.isFlipping ? "flip" : ""}`} onClick={handleFlip}>
                <div 
                className={`coin-heads ${props.flipResult === null ? "front" : props.flipResult === "Heads" ? "front" : "back"}`}
                ><img className="angel-svg" src={AngelSvg} ></img></div>
                <div className={`coin-tails ${props.flipResult === null ? "back" : props.flipResult === "Tails" ? "front" : "back"}`}
                > <img className="skull-svg" src = {SkullSvg}></img>
                </div>
            </div>
            
        </div>
    )
}
export default CoinflipLightbox;
