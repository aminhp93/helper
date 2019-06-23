import React from "react";
import UsernameForm from "./UsernameForm";

class ChatApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsername: ""
    };
    this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this);
  }

  onUsernameSubmitted(username) {
    fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username })
    })
      .then(response => {
        this.setState({
          currentUsername: username
        });
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  render() {
    return <UsernameForm onSubmit={this.onUsernameSubmitted} />;
  }
}

export default ChatApp;
