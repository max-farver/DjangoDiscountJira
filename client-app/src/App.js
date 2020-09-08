import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./styles/tailwindOutput.css";
import { useLocalStorage } from "./utils/useLocalStorage";
import Board from "./components/Board";
import ProjectList from "./components/ProjectList";
import Layout from "./components/Layout";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

export const UserContext = createContext({
  username: null,
  access: null,
  refresh: null,
});

function App() {
  const [userStorage, setUserStorage] = useLocalStorage("user");
  const [user, setUser] = useState(userStorage);
  useEffect(() => {
    setUserStorage(user);
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: setUser,
      }}
    >
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/">
              <ProjectList />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route path="/:projectId">
              <Board />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
