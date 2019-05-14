import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Note from "./../Note";

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Note} />
      </Router>
    );
  }
}

export default App;
