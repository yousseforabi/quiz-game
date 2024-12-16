import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { UserProvider, UserContext } from "./contexts/UserContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Game from "./components/Game/Game";
import About from "./components/Auth/About";

function HomePage() {
  const { user } = useContext(UserContext);

  return (
    <div className="home-container">
      {user ? (
        // Content when the user is logged in
        <>
          <h1>Welcome to the AnswerMe Quiz!</h1>
          <p>Time to get a new high score, <strong>{user.username}</strong>!</p>
          <Link to="/game">
            <button className="btn-play">Play Quiz</button>
          </Link>
        </>
      ) : (
        // Content when the user is not logged in
        <>
          <h1>Welcome to the AnswerMe Quiz!</h1>
          <p>
            Create an account to join the fun 
            with exciting quizzes!
          </p>
          <Link to="/register">
            <button className="btn-register">Register an Account</button>
          </Link>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <UserProvider >
      <Router>
        <nav>
          <Link to="/">Home</Link> {" "} <Link to="/login">Login</Link> {" "}
          <Link to="/register">Register</Link> {" "}  <Link to="/game">Game</Link>  {" "}
          <Link to="/about">About</Link> 
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/" element={<h1 className="start">Welcome to the Game!</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/game" element={<Game />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}


export default App;
