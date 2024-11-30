import React, { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

function Game() {
  const { user, logout } = useContext(UserContext);

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.username}!</h1>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <h1>Please log in to play the game.</h1>
      )}
    </div>
  );
}

export default Game;
