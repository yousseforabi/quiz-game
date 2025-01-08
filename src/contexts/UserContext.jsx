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

  const [showLayout,setShowLayout] = useState(true);

  const hideLayout = () => setShowLayout(false);
  const showLayoutAgain = () => setShowLayout(true);
  
  return (
    <UserContext.Provider value={{ 
      user,
       setUser: login,
        logout,
        quizData,
        setQuizData,
        apiToken,
        setApiToken,
        showLayout,
        hideLayout,
        showLayoutAgain
      }}>
      {children}
    </UserContext.Provider>
  );
};
