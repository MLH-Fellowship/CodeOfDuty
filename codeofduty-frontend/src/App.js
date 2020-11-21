import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./routes/Home";
import SprintLayout from "./routes/SprintLayout";
import RepoLayout from "./routes/RepoLayout";
import CreateLayout from "./routes/CreateLayout";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Home} />
        <Route
          exact
          path="/repo/:owner/:repo/:sprintPermId"
          component={SprintLayout}
        />
        <Route exact path="/repo/:owner/:repo" component={RepoLayout} />
        <Route exact path="/createSprint" component={CreateLayout} />
      </Router>
    </div>
  );
}

export default App;
