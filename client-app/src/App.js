import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/tailwindOutput.css";
import { useLocalStorage } from "./utils/useLocalStorage";
import ProjectList from "./components/ProjectList";
import Layout from "./components/Layout";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import DeskopView from "./components/DeskopView";
import ProjectSettings from "./components/ProjectSettings";

export const UserContext = createContext({
  username: null,
  access: null,
  refresh: null,
});
export const ProjectContext = createContext({
  projectId: null,
});

function App() {
  const [userStorage, setUserStorage] = useLocalStorage("user");

  const [user, setUser] = useState(userStorage);
  useEffect(() => {
    setUserStorage(user);
  }, [user, setUserStorage]);

  const [project, setProject] = useState(null);

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: setUser,
      }}
    >
      <ProjectContext.Provider
        value={{
          project: project,
          setProject: setProject,
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
              <Route path="/:projectId/settings">
                <ProjectSettings />
              </Route>
              <Route path="/:projectId">
                <DeskopView />
              </Route>
            </Switch>
          </Layout>
        </Router>
      </ProjectContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
