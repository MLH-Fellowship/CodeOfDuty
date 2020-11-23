import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import Home from "./routes/Home";
import SprintLayout from "./routes/SprintLayout";
import RepoLayout from "./routes/RepoLayout";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Router>
        <Route exact path="/" render={(props) => <Home {...props} />} />
        <Route
          exact
          path="/repo/:owner/:repo/:sprintPermId"
          component={SprintLayout}
        />
        <Route exact path="/repo/:owner/:repo" component={RepoLayout} />
      </Router>
    </div>
  );
}

export default App;
