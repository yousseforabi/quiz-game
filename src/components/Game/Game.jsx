import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { fetchApiData, fetchApiToken } from './GameApi';

function Game() {
    const {
        user,
        logout,
        quizData,
        setQuizData,
        apiToken,
        setApiToken
    } = useContext(UserContext);

    const [gameState, setGameState] = useState({
        questionIndex: 0,
        gameIsActive: false,
        isGameOver: false,
        roundIsOver: false,
        correctAnswers: 0,
        playerLives: 10,
        timer: 10,
        atCheckpoint: false
    });

    useEffect(() => {
        fetchApiToken(setApiToken);
    }, []);

    useEffect(() => {
        if (!gameState.gameIsActive || gameState.atCheckpoint) return;

        const timerTimeout = setTimeout(() => {
            if (gameState.roundIsOver) {
                clearTimeout(timerTimeout);
            } else {
                setGameState(prevState => ({
                    ...prevState,
                    timer: prevState.timer - 1
                }));
            }
        }, 1000);

        if (gameState.timer === 0 && !gameState.roundIsOver) {
            clearTimeout(timerTimeout);
            setGameState(prevState => ({
                ...prevState,
                roundIsOver: true,
                playerLives: prevState.playerLives - 1,
                isGameOver: prevState.playerLives - 1 === 0
            }));
        }

        return () => clearTimeout(timerTimeout);
    }, [gameState.timer, gameState.gameIsActive, gameState.roundIsOver, gameState.atCheckpoint]);

    const updateQuestionIndex = () => {
        setGameState(prevState => {
            const nextIndex = prevState.questionIndex + 1;
            if (nextIndex === quizData.length - 1) {
                fetchApiData(apiToken, setQuizData);
            }
            const atCheckpoint = nextIndex % 10 === 0;
            return {
                ...prevState,
                questionIndex: nextIndex,
                atCheckpoint: atCheckpoint,
                timer: 10,
                roundIsOver: false,
                playerLives: prevState.playerLives + (atCheckpoint ? 1 : 0),
            };
        });
    };

    const checkAnswer = (e, index) => {
        const { value } = e.target;
        if (value === quizData[index].correctAnswer) {
            setGameState(prevState => ({
                ...prevState,
                correctAnswers: prevState.correctAnswers + 1,
                roundIsOver: true
            }));
        } else {
            setGameState(prevState => ({
                ...prevState,
                roundIsOver: true,
                playerLives: prevState.playerLives - 1,
                isGameOver: prevState.playerLives === 0
            }));
        }
    };

    const renderQuizElements = () => {
        const currentQuestion = quizData[gameState.questionIndex];
        if (!currentQuestion) return null;
        return (
            <div key={gameState.questionIndex} className="quiz-question">
                <h2>{currentQuestion.question}</h2>
                {currentQuestion.answers.map((answer, index) => (
                    <button
                        className={`quiz-answer ${gameState.roundIsOver ? (answer === currentQuestion.correctAnswer ? "correct" : "incorrect") : ""}`}
                        key={index}
                        disabled={gameState.roundIsOver}
                        onClick={(e) => checkAnswer(e, gameState.questionIndex)}
                        value={answer}
                    >
                        {answer}
                    </button>
                ))}
            </div>
        );
    };

    const resetGame = () => {
        setQuizData([]);
        setGameState({
            questionIndex: 0,
            gameIsActive: false,
            isGameOver: false,
            roundIsOver: false,
            correctAnswers: 0,
            playerLives: 10,
            timer: 10,
            atCheckpoint: false
        });
    };

    return (
        <div className="game-container">
            {user && user.loggedIn ? (
                <>
                    {gameState.atCheckpoint ? (
                        <div className="checkpoint">
                            <h1>Checkpoint reached</h1>
                            <button className="next-round" onClick={() => setGameState(prevState => ({ ...prevState, atCheckpoint: false }))}>Continue</button>
                        </div>
                    ) : (
                        <>
                            <h2>Round {gameState.questionIndex + 1}</h2>
                            <h2>Timer: {gameState.timer}s</h2>
                            {gameState.isGameOver && <h1>GAME OVER</h1>}
                            <h2>Correct Answers: {gameState.correctAnswers}</h2>
                            <h2>Player Lives: {gameState.playerLives}</h2>
                            {!gameState.gameIsActive && <button className="start-quiz" onClick={() => { setGameState(prevState => ({ ...prevState, gameIsActive: true })); fetchApiData(apiToken, setQuizData); }}>Start Quiz</button>}
                            {gameState.isGameOver && <button className="play-again" onClick={resetGame}>Play Again</button>}
                            {gameState.gameIsActive && !gameState.isGameOver && renderQuizElements()}
                            {gameState.roundIsOver && !gameState.isGameOver && <button className="next-question" onClick={updateQuestionIndex}>Next Question</button>}
                        </>
                    )}
                    <button className="logout" onClick={logout}>Logout</button>
                </>
            ) : (
                <h1 className="welcome">Please log in to play the game.</h1>
            )}
        </div>
    );
}

export default Game;
