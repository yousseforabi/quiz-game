import React, { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

function Game() {
  const { user, logout } = useContext(UserContext);

  return (
    <div>
      {user && user.loggedIn ? (
        <>
          <h1>Welcome, {user.username}!</h1>
          <p>Enjoy the game!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <h1>Please log in to access the game.</h1>
      )}
    </div>
  );
}

export default Game;
