import { useState,useEffect } from "react";
import "./CoinflipLightbox.css";
import { use } from "react";


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
            <div className={`coin ${isFlipping ? "flip" : ""}`} onClick={handleFlip}>
                <div 
                className={`coin-face coin-heads ${flipResult === null ? "front" : flipResult === "Heads" ? "front" : "back"}`}
                ></div>
                <div className={`coin-face coin-tails ${flipResult === null ? "back" : flipResult === "Tails" ? "front" : "back"}`}>
                </div>
            </div>
            <h1>{flipResult && (userChoice === flipResult ?"You won" : "You lost")}</h1>
        <button onClick={() => {handleFlip(), setUserChoice("Heads")}}>Heads</button>
        <button onClick={() => {handleFlip(), setUserChoice("Tails")}}>Tails</button>
        </div>
    )
}
export default CoinflipLightbox;
