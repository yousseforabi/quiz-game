import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username) => setUser({ username });
  const logout = () => setUser(null);

  const [quizData, setQuizData] = useState([]);
  const [apiToken,setApiToken] = useState(null)

  return (
    <UserContext.Provider value={{ user, login, logout, quizData, setQuizData, apiToken, setApiToken }}>
      {children}
    </UserContext.Provider>
  );
};
