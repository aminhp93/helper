import React from "react";
import UsernameForm from "./UsernameForm";
import ChatScreen from "./ChatScreen";
// import config from "./../../config";

class ChatApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsername: "",
      currentScreen: "WhatIsYourUsernameScreen"
    };
    this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this);
  }

  onUsernameSubmitted(username) {
    fetch(
      `${
      process.env.NODE_ENV === 'production'
        ? "https://helper-react.herokuapp.com"
        : "http://localhost:3333"
      }/api/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username })
      }
    )
      .then(response => {
        this.setState({
          currentUsername: username,
          currentScreen: "ChatScreen"
        });
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  render() {
    if (this.state.currentScreen === "WhatIsYourUsernameScreen") {
      return <UsernameForm onSubmit={this.onUsernameSubmitted} />;
    }

    if (this.state.currentScreen === "ChatScreen") {
      return <ChatScreen currentUsername={this.state.currentUsername} />;
    }
  }
}

export default ChatApp;
