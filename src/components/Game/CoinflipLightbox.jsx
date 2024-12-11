import { useState,useEffect } from "react";
import "./CoinflipLightbox.css";
import AngelSvg from "./angel-svg.svg";
import SkullSvg from "./skull-svg.svg";


function CoinflipLightbox(){
    
    const [isFlipping,setIsFlipping] = useState(false);
    const [flipResult,setFlipResult] = useState(null);
    const [userChoice,setUserChoice] = useState(null);
    useEffect(() => {
    if(flipResult === null)return
    console.log(flipResult)

    },[flipResult])

    const handleFlip = () => {
        setIsFlipping(true);
        setFlipResult(null)
        setTimeout(() => {
            const randomFlipResult = Math.random() < 0.5 ? "Heads" : "Tails";
            setFlipResult(randomFlipResult);
        },3500)

        setTimeout(() => {
          setIsFlipping(false);
        },4000)
    }


    return(
        <div className="light-box">
            <div className={`coin ${isFlipping ? "flip" : ""}`}>
                <div 
                className={`coin-heads ${flipResult === null ? "front" : flipResult === "Heads" ? "front" : "back"}`}
                ><img className="angel-svg" src={AngelSvg} ></img></div>
                <div className={`coin-tails ${flipResult === null ? "back" : flipResult === "Tails" ? "front" : "back"}`}
                > <img className="skull-svg" src = {SkullSvg}></img>
                </div>
            </div>
            <h1 style={{color:"white"}}>{flipResult && (userChoice === flipResult ?"You won" : "You lost")}</h1>
        <button onClick={() => {handleFlip(), setUserChoice("Heads")}}>Heads</button>
        <button onClick={() => {handleFlip(), setUserChoice("Tails")}}>Tails</button>
        </div>
    )
}
export default CoinflipLightbox;
