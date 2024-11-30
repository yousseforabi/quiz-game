import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";

function Login() {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username); // Call the login function from context
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
