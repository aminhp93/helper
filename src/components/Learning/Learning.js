import React, { Component } from "react";
import uuid from "uuid";

const contents = [
  "Curriculum Overview",
  "Join Our Online Classroom",
  "Meet the Community",
  "First Day of Work",
  "Before You Get Started",
  "Don't be a junior developer"
];
class Learning extends Component {
  render() {
    return (
      <div className="learning">
        <div className="menu">
          <div>Introduction</div>
          <div>SSH</div>
          <div>Performance 1</div>
          <div>React + Redux + Module Bundling</div>
          <div>Performance 2</div>
          <div>Testing</div>
          <div>TypeScript</div>
          <div>SPA vs Server Side Rendering</div>
          <div>Security</div>
          <div>Code Analysis</div>
          <div>Docker</div>
          <div>Redis</div>
          <div>Sessions + JWT</div>
          <div>AWS</div>
          <div>Performance 3</div>
          <div>CICD</div>
          <div>Extra Bits</div>
          <div>The final video</div>
          <div>Extras for windows users</div>
          <div>Bonus</div>
        </div>
        <div className="content">
          {contents.map(item => {
            return <div key={uuid.v4()}>{item}</div>;
          })}
        </div>
      </div>
    );
  }
}

export default Learning;
