import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Note from "./components/Note";
import Learning from "./components/Learning";
import RealEstate from "./components/RealEstate";
import Stock from "./components/Stock";
import JobMarket from "./components/JobMarket";

ReactDOM.render(
  <Router>
    <Route path="/" exact component={App} />
    <Route path="/note" exact component={Note} />
    <Route path="/learning" component={Learning} />
    <Route path="/realestate" component={RealEstate} />
    <Route path="/stock" component={Stock} />
    <Route path="/job" component={JobMarket} />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
