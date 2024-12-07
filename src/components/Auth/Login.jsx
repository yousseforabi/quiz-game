import React, { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    //matching user in localStorage
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      setUser({ username, loggedIn: true });
      alert("Login successful!");
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default Login;



