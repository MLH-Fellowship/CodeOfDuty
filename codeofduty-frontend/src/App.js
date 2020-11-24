import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import Home from "./routes/Home";
import SprintLayout from "./routes/SprintLayout";

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
        <Route exact path="/repo/:owner/:repo" component={SprintLayout} />
      </Router>
    </div>
  );
}

export default App;
