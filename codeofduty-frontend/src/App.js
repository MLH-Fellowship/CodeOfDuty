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
<<<<<<< HEAD
=======
        <Route
          exact
          path="/repo/:owner/:repo/:sprintPermId"
          component={SprintLayout}
        />
        <Route exact path="/repo/:owner/:repo" component={RepoLayout} />
        <Route exact path="/createSprint" component={CreateLayout} />
>>>>>>> 26b45a76930fff78f4c09b04b00a29cdb72dc3ed
      </Router>
    </div>
  );
}

export default App;
