import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Game from "./components/Game/Game";
import About from "./components/About";

function App() {
  return (
    <UserProvider>
      <Router>
        <nav>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link> | <Link to="/game">Game</Link>
        </nav>
        <Routes>
          <Route path="/" element={<h1>Welcome to the Game!</h1>} />
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
