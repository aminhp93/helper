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
        <li>
          <Link to="/realestate">Real Estate</Link>
        </li>
        <li>
          <Link to="/stock">Stock</Link>
        </li>
        <li>
          <Link to="/job">Job Market</Link>
        </li>
        <li>
          <Link to="/book">Book</Link>
        </li>
        <li>
          <Link to="/checklist">CheckList</Link>
        </li>
        <li>
          <Link to="/ecommerce">Delta Sport</Link>
        </li>
        <li>
          <Link to="/test">Test</Link>
        </li>
        <li>
          <Link to="/chat">Chat</Link>
        </li>
        <div id="output" />
      </ul>
    );
  }
}

export default App;
