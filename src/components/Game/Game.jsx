import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { fetchApiData,fetchApiToken } from "./GameApi";


function Game() {
  const { user, logout, quizData,setQuizData,apiToken,setApiToken } = useContext(UserContext);
  
  const [gameState,setGameState] = useState({
    questionIndex:0,
    gameIsActive:false,
    isGameOver:false,
    roundIsOver:false,
    correctAnswers:0,
    playerLives:10,
    timer:10
  })
  
  
  
  useEffect(() => {
    fetchApiToken(setApiToken)
  },[])
  
  useEffect(() => {
    console.log(gameState.questionIndex)
  },[gameState.questionIndex])
  
  useEffect(() => {
      
    if(!gameState.gameIsActive) return;

    const timerTimeout = setTimeout(() => {
      if(gameState.roundIsOver){
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
      setGameState((prevState) => ({
        ...prevState,
        roundIsOver: true,
        playerLives: prevState.playerLives - 1,
        isGameOver: prevState.playerLives -1 === 0 ? true:prevState.isGameOver
      }))
      return;
    }

    return () => clearTimeout(timerTimeout)
  },[gameState.timer,gameState.gameIsActive,gameState.roundIsOver])

  const updateQuestionIndex = () => {
    setGameState((prevState) => {
      const nextIndex = prevState.questionIndex + 1;
      if(prevState.questionIndex === quizData.length -2){
        fetchApiData(apiToken,setQuizData); 
      }
      if(nextIndex % 10 === 0){
          console.log("checkpoint reached")
      }
      return {
        ...prevState,
        timer:10,
        questionIndex:prevState.questionIndex + 1,
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
          correctAnswers: prevState.correctAnswers + 1,
          roundIsOver:true
        }))
    }else{
      console.log("Wrong answer")
      setGameState((prevState) => {
        const newLivesRemaning = prevState.playerLives - 1;
        return {
          ...prevState,
          roundIsOver:true,
          playerLives:newLivesRemaning,
          isGameOver: newLivesRemaning === 0 ? true : prevState.isGameOver
        };
      })
    }
    
  }
  const renderQuizElements = () => {
    const currentQuestion = quizData[gameState.questionIndex];  
    if (!currentQuestion) return null; 
    return (
      <div key={gameState.questionIndex}>
        <h2>{currentQuestion.question}</h2>
        {currentQuestion.answers.map((answer, index) => (
          <button style={{color:gameState.roundIsOver ? answer === currentQuestion.correctAnswer ? "green" : "red" : "black"}} key={index} disabled={gameState.roundIsOver} onClick={(e) => checkAnswer(e, gameState.questionIndex)} value={answer}>
            {answer}
          </button>
        ))}
      </div>
    );      
  }
  
 const resetGame = () => {
  
  setGameState((prevState) => {
    return {
      ...prevState,
      playerLives:10,
      correctAnswers:0,
      timer:10,
      gameIsActive:false,
      isGameOver:false,
      roundIsOver:false,
      questionIndex:0,
    }
  })
  setQuizData([])

 }
  
  return (
    <div>
    {user? (
      <>
      <h2>Round {gameState.questionIndex + 1}</h2>
      <h2>{gameState.timer}</h2>
        {gameState.isGameOver && <h1>GAME IS OVER</h1>}
        <h2>CORRECT ANSWERS:{gameState.correctAnswers}</h2>
        <h2>PLAYER LIVES :{gameState.playerLives}</h2>
        {!gameState.gameIsActive &&  <button onClick={() => {setGameState((prevState) => ({...prevState,gameIsActive:true})),fetchApiData(apiToken,setQuizData)}}>Start Quiz</button>}
        {gameState.isGameOver && <button onClick={resetGame}>Play again</button>}
        {gameState.gameIsActive && !gameState.isGameOver ? renderQuizElements(): null}
        {gameState.roundIsOver && !gameState.isGameOver ? <button onClick={() => {updateQuestionIndex(),setGameState((prevState) => ({...prevState,roundIsOver:false}))}}>Next question</button>:null}
        </>
      )
       : (
        <h1>Please log in to play the game.</h1> 
       )
        
      }
    </div>
  );
}

export default Game;
