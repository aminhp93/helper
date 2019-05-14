import React, { Component } from "react";
import { Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/note">Note</Link>
        </li>
        <li>
          <Link to="/learning">Learning</Link>
        </li>
      </ul>
    );
  }
}

export default App;
