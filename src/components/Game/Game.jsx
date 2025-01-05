import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { fetchApiData,fetchApiToken } from "./GameApi";
import TimeoutLightbox from "./TimeoutLightbox";
import CoinflipLightbox from "./CoinflipLightbox";
import "./powerUp-buttons.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { CSSTransition } from "react-transition-group";
import fiftyFiftySvg from "./fiftyFifty.svg";
import chatGptSvg from "./chatgpt.svg";
import skipSvg from "./skip-question.svg";
import shieldSvg from "./shield.svg";



function Game() {
  const { user, logout, quizData,setQuizData,apiToken,setApiToken} = useContext(UserContext);
  
const initialGameState = {
  questionIndex:0,
  gameIsActive:false,
  isGameOver:false,
  roundIsOver:false,
  correctAnswers:0,
  playerLives:5,
  timer:20,
  atCheckpoint:false,
  fiftyFiftyActive:false,
  googleTimeoutActive:false,
  googleTimer:45,
  pointsMultiplier:1,
  hotStreak:0,
  doublePointsIndices:[],
  luckOfTheDrawIndex:null,
  coinFlipsAvailable:1,
  activeCoinFlip:false,
  isShieldActive:false
}

  const [gameState,setGameState] = useState({
    questionIndex:0,
    gameIsActive:false,
    isGameOver:false,
    roundIsOver:false,
    correctAnswers:0,
    playerLives:50,
    timer:20,
    atCheckpoint:false,
    fiftyFiftyActive:false,
    googleTimeoutActive:false,
    googleTimer:45,
    pointsMultiplier:1,
    hotStreak:0,
    doublePointsIndices:[],
    luckOfTheDrawIndex:null,
    coinFlipsAvailable:1,
    activeCoinFlip:false,
    isShieldActive:false
  })
  
  const [powerUpStock,setPowerUpStock] = useState({
    fiftyFiftyStock:1,
    googleTimeoutStock:1,
    skipQuestionStock:1,
    shieldStock:1
  })

  const [checkpointInfo,setCheckpointInfo] = useState([]);

  const [correctFirst,setCorrectFirst] = useState();

  const [isFlipping,setIsFlipping] = useState(false);
  const [flipResult,setFlipResult] = useState(null);

  const [tokenReady,setTokenReady] = useState(false);

  const [userPlayedAgain,setUserPlayedAgain] = useState(false);

  

  const renamePowerUps = {
    fiftyFiftyStock:fiftyFiftySvg,
    googleTimeoutStock:chatGptSvg,
    skipQuestionStock:skipSvg,
    shieldStock: shieldSvg
  }
  
  useEffect(() => {
   let isMounted = true;
    const getToken = async () => {
      if(isMounted){
        const token = await fetchApiToken();
        setApiToken(token);
        setTokenReady(true);
      }
    }
    getToken()
    return () => {isMounted = false}
  },[])

  useEffect(() => {
    if(!apiToken)return;
    
    if(quizData.length === 0 && !userPlayedAgain){
      fetchApiData(apiToken,setQuizData)
      return;
    }

    if(userPlayedAgain){
      fetchApiData(apiToken,setQuizData)
      setTimeout(() => {
        setUserPlayedAgain(false)
      },1000)
      
      return;
    }
      
    
  },[tokenReady,userPlayedAgain])

  useEffect(() => {
    setCorrectFirst(Math.random() < 0.5);
  },[gameState.fiftyFiftyActive])
  



const generateRandomSeeds = () => {
  let fetchedQuestions = quizData.slice(gameState.questionIndex);

  const randomChance = Math.random() * 100;
  let numDoublePoints = 0;
  let luckIndex = null;
  
  if(randomChance < 20){
    numDoublePoints = 0;
  }else if (randomChance < 60){
    numDoublePoints = 1;
  }else{
    numDoublePoints = 2;
  }
  
  if(randomChance < 30){
    const randomIndex = Math.floor(Math.random() * (fetchedQuestions.length) + gameState.questionIndex );
    luckIndex = randomIndex;
  }

  let tempDoublePointsIndices = new Set();

  while(tempDoublePointsIndices.size < numDoublePoints){
    const randomIndex = Math.floor(Math.random() * (fetchedQuestions.length) + gameState.questionIndex );
    tempDoublePointsIndices.add(randomIndex);
  }

  setGameState((prevState) => ({
    ...prevState,
    doublePointsIndices:Array.from(tempDoublePointsIndices),
    luckOfTheDrawIndex: luckIndex
  }))
}

  useEffect(() => {
    if(quizData.length <= 0)return;
    
    generateRandomSeeds()
   
  },[quizData])
 
  useEffect(() => {
    console.log(gameState.pointsMultiplier)
    if(gameState.questionIndex === quizData.length - 3){
      fetchApiData(apiToken,setQuizData); 
    }
    if(gameState.questionIndex % 10 === 0 && gameState.questionIndex > 0){
        console.log("checkpoint reached")
        handleCheckpointReached()
        setGameState((prevState) => ({
          ...prevState,
          atCheckpoint:true
        }))
    }
  },[gameState.questionIndex])


  useEffect(() => {
    if(!gameState.googleTimeoutActive)return

    if(gameState.googleTimer === 0){
      setGameState((prevState) => ({
        ...prevState,
        googleTimer:45,
        googleTimeoutActive:false
      }))
    }

    const googleTimerTimeout = setTimeout(() => {
        setGameState((prevState) => ({
          ...prevState,
          googleTimer:prevState.googleTimer - 1
        }))
    },1000)

    return () => clearTimeout(googleTimerTimeout)
  },[gameState.googleTimeoutActive,gameState.googleTimer])
  
  useEffect(() => {
      
    if(!gameState.gameIsActive || gameState.atCheckpoint) return;

    const timerTimeout = setTimeout(() => {
      if(gameState.roundIsOver || gameState.googleTimeoutActive){
       clearTimeout(timerTimeout)
      }
      else{
        setGameState((prevState) => ({
          ...prevState,
          timer:prevState.timer - 1
        }))
      }
    },1000)

    if(gameState.timer === 0 && !gameState.roundIsOver){
      clearTimeout(timerTimeout)
      setGameState((prevState) => {
        const newLivesRemaning = prevState.playerLives - 1;
        return {
          ...prevState,
          roundIsOver:true,
          playerLives:prevState.isShieldActive ? prevState.playerLives : newLivesRemaning,
          isGameOver: newLivesRemaning === 0 && prevState.coinFlipsAvailable === 0 && !prevState.isShieldActive ? true : prevState.isGameOver,
          activeCoinFlip: newLivesRemaning === 0 && prevState.coinFlipsAvailable > 0 && !prevState.isShieldActive ? true : prevState.activeCoinFlip,
          hotStreak: 0,
          isShieldActive: prevState.isShieldActive ? false : prevState.isShieldActive
        };
      })
    }

    return () => clearTimeout(timerTimeout)
  },[gameState.timer,gameState.gameIsActive,gameState.roundIsOver,gameState.atCheckpoint,gameState.googleTimeoutActive,gameState.activeCoinFlip])

  const updateQuestionIndex = () => {
    
    setGameState((prevState) => {
      const nextIndex = prevState.questionIndex + 1;
      const isDoublePoints = prevState.doublePointsIndices.includes(nextIndex);
     
     return {
        ...prevState,
        timer:20,
        fiftyFiftyActive:false,
        questionIndex:prevState.questionIndex + 1,
        pointsMultiplier: isDoublePoints
        ? (prevState.hotStreak >= 3 ? 4 : 2)
        : prevState.hotStreak >= 3
        ? 2
        : 1,
        // Test checkpoint might change later.
        playerLives:prevState.playerLives + (nextIndex % 10 === 0 ? 1 : 0)
      };
    });
  }

  const checkAnswer = (e,index) => {
    const {value} = e.target;

    if(value === quizData[index].correctAnswer){
        console.log("correct answer")
        setGameState((prevState) => ({
          ...prevState,
          correctAnswers: prevState.correctAnswers + 1 * gameState.pointsMultiplier ,
          roundIsOver:true,
          hotStreak: prevState.hotStreak + 1
        }))
    }else{
      console.log("Wrong answer")
      setGameState((prevState) => {
        const newLivesRemaning = prevState.playerLives - 1;
        return {
          ...prevState,
          roundIsOver:true,
          playerLives:prevState.isShieldActive ? prevState.playerLives : newLivesRemaning,
          isGameOver: newLivesRemaning === 0 && prevState.coinFlipsAvailable === 0 ? true : prevState.isGameOver,
          activeCoinFlip: newLivesRemaning === 0 && prevState.coinFlipsAvailable > 0 && !prevState.isShieldActive ? true : prevState.activeCoinFlip,
          hotStreak: 0,
          isShieldActive: prevState.isShieldActive ? false : prevState.isShieldActive
        };
      })
    }
  }
  const renderQuizElements = () => {
    const currentQuestion = quizData[gameState.questionIndex];  
    if (!currentQuestion) return null; 
    if(gameState.fiftyFiftyActive){
      return fiftyFiftyRender()
    }else if (gameState.luckOfTheDrawIndex === gameState.questionIndex){
      return correctOnlyRender()
    }else{
      return (
        <div className="quiz-content-container" key={gameState.questionIndex}>
          <div className="answers-container">
          {currentQuestion.answers.map((answer, index) => (
            <button className={`quiz-answer ${gameState.roundIsOver ? (answer === currentQuestion.correctAnswer ? "correct" : "incorrect") : ""}`} key={index} disabled={gameState.roundIsOver} onClick={(e) => checkAnswer(e, gameState.questionIndex)} value={answer}>
              {answer}
            </button>
          ))}
          </div>
        </div>
      );      
    }
  }
  
  const correctOnlyRender = () => {
   
    const currentQuestion = quizData[gameState.questionIndex];  
    if (!currentQuestion) return null; 
    const correctButtonsArray = [];
    for(let i = 0;  i < 4; i++){
     const correctButton = <button 
        className={`quiz-answer ${gameState.roundIsOver ? "correct": "" }`}
         key={i} disabled={gameState.roundIsOver} 
         onClick={(e) => checkAnswer(e, gameState.questionIndex)} value={currentQuestion.correctAnswer}>
         {currentQuestion.correctAnswer}
       </button>
       correctButtonsArray.push(correctButton)
    }
    return (
      <div className="quiz-content-container" key={gameState.questionIndex}>
          <div className="answers-container">
            {correctButtonsArray}
          </div>
        </div>
    )
    
  }

  const fiftyFiftyRender = () => {
    const currentQuestion = quizData[gameState.questionIndex];
    if (!currentQuestion) return null; 

    return (
      <div className="quiz-content-container">
        {correctFirst ? (
          <div className="answers-container">
            <button
              disabled={gameState.roundIsOver}
              className={`quiz-answer ${gameState.roundIsOver ? "correct" : ""}`}
              onClick={(e) => checkAnswer(e, gameState.questionIndex)}
              value={currentQuestion.correctAnswer}
            >
              {currentQuestion.correctAnswer}
            </button>
            <button
              disabled={gameState.roundIsOver}
              className={`quiz-answer ${gameState.roundIsOver ? "incorrect" : ""}`}
              onClick={(e) => checkAnswer(e, gameState.questionIndex)}
              value={currentQuestion.incorrectAnswers[0]}
            >
              {currentQuestion.incorrectAnswers[0]}
            </button>
          </div>
        ) : (
          <div className="answers-container">
            <button
              disabled={gameState.roundIsOver}
              className={`quiz-answer ${gameState.roundIsOver ? "incorrect" : ""}`}
              onClick={(e) => checkAnswer(e, gameState.questionIndex)}
              value={currentQuestion.incorrectAnswers[0]}
            >
              {currentQuestion.incorrectAnswers[0]}
            </button>
            <button
              disabled={gameState.roundIsOver}
              className={`quiz-answer ${gameState.roundIsOver ? "correct" : ""}`}
              onClick={(e) => checkAnswer(e, gameState.questionIndex)}
              value={currentQuestion.correctAnswer}
            >
              {currentQuestion.correctAnswer}
            </button>
          </div>
        )}
      </div>
    );      
};

const handleCheckpointReached = () => {
    
  const powerUps = ["fiftyFiftyStock","googleTimeoutStock","skipQuestionStock","shieldStock"]

  const itemsPool = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 0];

  const amountOfItems = itemsPool[Math.floor(Math.random() * itemsPool.length)]

  let newItems = {}

    for(let i = 0; i < amountOfItems; i++){
      const randomItem = powerUps[Math.floor(Math.random() * powerUps.length)]
      
      if(newItems[randomItem]){
        newItems[randomItem] += 1;
      }else{
        newItems[randomItem] = 1
      }
    }

    setCheckpointInfo(Object.entries(newItems))

   setPowerUpStock((prevState) => {
      const updatedStock = {...prevState};
      for(const [key,value] of Object.entries(newItems)){
        updatedStock[key] = prevState[key] + value
      }
      return updatedStock
   })
}

const handleNextQuestion = () => {
   updateQuestionIndex();
   setGameState((prevState) => ({...prevState,roundIsOver:false}));
}
  

 const resetGame = () => {
  setGameState(initialGameState);
  setQuizData([]);
  setFlipResult(null);
  setUserPlayedAgain(true);
  setPowerUpStock(({
    fiftyFiftyStock:1,
    googleTimeoutStock:1,
    skipQuestionStock:1,
    shieldStock:1
  }))
 }
 if(quizData.length > 0 ){
  console.log(quizData[gameState.questionIndex].correctAnswer)

 }

  
  return (
    <div className="game-container">
   { (user && user.loggedIn) ? (
      gameState.questionIndex >= 10 && (gameState.questionIndex + 1)% 10 === 1 && gameState.atCheckpoint?(
        <div className="checkpoint">
            <h1>Checkpoint reached</h1>
            <h2>Life gained + 1</h2>
            <h2>{checkpointInfo.length > 0 ? `Items gained`: "0 items gained"}</h2>
            <ul className="item-gained-list">
              {checkpointInfo.map(([key,value], index) => {
                return <div className="item-gained-container">
                <h3 className="item-gained-value">{value}x</h3>
                <li className="power-up-button" key={index}>
                  <img className="power-up-image" src={renamePowerUps[key]}></img>
                </li>
                </div>
              })}
            </ul>
            <button className="next-round" onClick={() => setGameState(prevState => ({ ...prevState, atCheckpoint: false }))}>Continue</button>
        </div>
      ): !gameState.isGameOver && gameState.gameIsActive ? (
        <div className="game-content-container"> 
            
            <CSSTransition
              in={gameState.activeCoinFlip}
              timeout={1200}
              classNames="lightbox-anim"
              unmountOnExit
            >
              <CoinflipLightbox
                isFlipping={isFlipping}
                setIsFlipping={setIsFlipping}
                flipResult={flipResult}
                setFlipResult={setFlipResult}
                gameState={gameState}
                setGameState={setGameState}
              />
            </CSSTransition>
          

          {gameState.googleTimeoutActive ? <TimeoutLightbox setGameState = {setGameState} timer = {gameState.googleTimer}answers = {quizData[gameState.questionIndex].answers} question ={quizData[gameState.questionIndex].question}/> : null}
          {gameState.isShieldActive && <h2>Shield is Active</h2>}
          
          <h2 className="quiz-round">Question {gameState.questionIndex + 1}</h2>
          <h2 className="quiz-timer">Time left: {gameState.timer}s</h2>
          {quizData.length > 0 && <h2 className="quiz-question">{quizData[gameState.questionIndex].question}</h2>}
          {gameState.doublePointsIndices.includes(gameState.questionIndex) ? <h2>Double points round</h2> : null}
          {gameState.isGameOver && <h1>GAME IS OVER</h1>}
          <div className="quiz-points">
            {gameState.hotStreak >= 3 ? <DotLottieReact 
            src= "https://lottie.host/9dfccc48-7538-47e8-a86d-47ee219be9d1/aFET9NPLzR.lottie"
            loop 
            autoplay 
            style = {{width:"100px", height:"50px"}}
          />:null}
            <h2 >Points:{gameState.correctAnswers}</h2>
          </div>
          
          <h2 className="quiz-lives">PLAYER LIVES :{gameState.playerLives}</h2>
          {!gameState.gameIsActive &&  <button className="start-quiz" onClick={() => setGameState((prevState) => ({...prevState,gameIsActive:true}))}>Start Quiz</button>}
          {gameState.gameIsActive && !gameState.isGameOver ? renderQuizElements(): null}
          {gameState.roundIsOver && !gameState.isGameOver ? <button  className="next-question" onClick={handleNextQuestion} >Next question</button>:null}
          
          {gameState.gameIsActive && !gameState.isGameOver &&
            <div className="power-up-container">
            
              <button className="power-up-button" disabled = {powerUpStock.fiftyFiftyStock <= 0 || gameState.fiftyFiftyActive || gameState.roundIsOver}
              onClick={() => 
              {setGameState((prevState) => ({ ...prevState, fiftyFiftyActive: true }))
              setPowerUpStock((prevState) => ({...prevState,fiftyFiftyStock:prevState.fiftyFiftyStock - 1}))
              }}> 
              <img className="power-up-image" src={fiftyFiftySvg}></img> 
              <span className={`power-up-stock ${powerUpStock.fiftyFiftyStock > 0 ? "have-stock" : "no-stock"}`}>{powerUpStock.fiftyFiftyStock}</span>
              </button>
              
              <button className="power-up-button" disabled = {powerUpStock.googleTimeoutStock <= 0 || gameState.roundIsOver }
              onClick={() => 
              {setGameState((prevState) => ({...prevState,googleTimeoutActive:true}))
              setPowerUpStock((prevState) => ({...prevState,googleTimeoutStock:prevState.googleTimeoutStock - 1}))
              }}>
               <img className="power-up-image" src={chatGptSvg}></img>
               <span className={`power-up-stock ${powerUpStock.googleTimeoutStock > 0 ? "have-stock" : "no-stock"}`} >{powerUpStock.googleTimeoutStock}</span>
              </button>
              
              <button className="power-up-button" disabled = {powerUpStock.skipQuestionStock <= 0 || gameState.roundIsOver}
              onClick={() => 
              {updateQuestionIndex()
              setPowerUpStock((prevState) => ({...prevState,skipQuestionStock:prevState.skipQuestionStock - 1}))
              }}> 
              <img className="power-up-image" src={skipSvg}></img>
              <span  className={`power-up-stock ${powerUpStock.skipQuestionStock > 0 ? "have-stock" : "no-stock"}`}>{powerUpStock.skipQuestionStock}</span>
              </button>
              
              <button className="power-up-button" disabled = {powerUpStock.shieldStock <= 0 || gameState.isShieldActive ||gameState.roundIsOver}
              onClick={() => 
              {setGameState((prevState) => ({...prevState,isShieldActive:true}))
              setPowerUpStock((prevState) => ({...prevState,shieldStock:prevState.shieldStock - 1}))
              }}> 
              <img className="power-up-image" src={shieldSvg}></img>
              <span className={`power-up-stock ${powerUpStock.shieldStock > 0 ? "have-stock" : "no-stock"}`}  >{powerUpStock.shieldStock}</span>
              </button>
         
            </div>
          }
          
          
        </div>
      ):gameState.gameIsActive && gameState.isGameOver ? (
        <>
          <h1>Game over</h1>
          <h2>You're Score : {gameState.correctAnswers}</h2>
          <button className="play-again" onClick={resetGame} >Play again</button>
          <button className="logout" onClick={logout}>Logout</button>
        </>
      ):(
        <>
          <h1>AnswerMe Quiz!</h1>
          {!gameState.gameIsActive &&  <button className="start-quiz" onClick={() => setGameState((prevState) => ({...prevState,gameIsActive:true}))}>Start Quiz</button>}
          <button className="logout" onClick={logout}>Logout</button>
        </>
      )
      )
       : (
        <h1 className="welcome">Please log in to play the game.</h1> 
       )
      }
    </div>
  );
}

export default Game;
