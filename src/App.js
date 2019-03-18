import React, { Component } from "react";
import "./App.css";
import moment from "moment";
import faker from "faker";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: moment().format("HH:mm")
    };
  }

  handleOnChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  renderHeader() {
    return (
      <div className="header">
        <div>
          <div>Links</div>
          <div>search</div>
        </div>
        <div>
          {faker.random.number()} {faker.address.city()}
        </div>
      </div>
    );
  }

  renderFooter() {
    return (
      <div className="footer">
        <div>
          <img style={{ height: 20, width: 20 }} src={faker.image.image()} />
          <div>
            {faker.address.city()}, {faker.address.country()}
          </div>
          <div>Photo by {faker.name.firstName()}</div>
        </div>
        <div>{faker.lorem.sentence()}</div>
        <div>Todo</div>
      </div>
    );
  }

  render() {
    return (
      <div className="momentum">
        {this.renderHeader()}
        <div>{this.state.currentTime}</div>
        <div>Good evening, Amin</div>
        <div>What is your main focus for today?</div>
        <input
          value={this.state.value}
          onChange={this.handleOnChange.bind(this)}
        />
        {this.renderFooter()}
      </div>
    );
  }

  componentDidMount() {
    const momentum = document.querySelector(".momentum");
    momentum.style.backgroundImage = `url('${faker.image.image()}')`;
    momentum.style.backgroundRepeat = "no-repeat";
    momentum.style.backgroundSize = "cover";
    // setInterval(() => {
    this.setState({
      currentTime: moment().format("HH:mm")
    });
    // }, 1000);
  }
}

export default App;
