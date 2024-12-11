import { useState,useEffect } from "react";
import "./CoinflipLightbox.css";


function CoinflipLightbox(){
    
    const [isFlipping,setIsFlipping] = useState(false);
    const [flipResult,setFlipResult] = useState(null);
    useEffect(() => {
    if(flipResult === null)return
    console.log(flipResult)

    },[flipResult])

    const handleFlip = () => {
        setIsFlipping(true);
        setTimeout(() => {
            const randomFlipResult = Math.random() < 0.5 ? "Heads" : "Tails";
            setFlipResult(randomFlipResult);
        },1500)

        setTimeout(() => {
            setIsFlipping(false);
            
        },4000)
    }


    return(
        <div className="light-box">
            <div className={`coin ${isFlipping ? "flip" : ""}`} onClick={handleFlip}>
                <div 
                className={`coin-face coin-heads ${flipResult === null ? "front" : flipResult === "Heads" ? "front" : "back"}`}
                >Heads</div>
                <div className={`coin-face coin-tails ${flipResult === null ? "back" : flipResult === "Tails" ? "front" : "back"}`}>
                Tails</div>
            </div>
        </div>
    )
}
export default CoinflipLightbox;
