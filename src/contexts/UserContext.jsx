import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const [quizData, setQuizData] = useState([]);
  const [apiToken,setApiToken] = useState(null);
  
  return (
    <UserContext.Provider value={{ user, setUser: login, logout,quizData,setQuizData,apiToken,setApiToken}}>
      {children}
    </UserContext.Provider>
  );
};
