import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from "./routes/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Home}></Route>
      </Router>
    </div>
  );
}

export default App;
