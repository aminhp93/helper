import React from "react";
import Chatkit from "@pusher/chatkit-client";
import MessagesList from "./MessagesList";
import SendMessagesForm from "./SendMessagesForm";

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      currentRoom: {},
      messages: []
    };
    this.sendMessage = this.sendMessage.bind(this);
  }

  sendMessage(text) {
    this.state.currentUser.sendMessage({
      text,
      roomId: this.state.currentRoom.id
    });
  }
  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: "v1:us1:c89d2d68-a0df-4ed6-82b0-ac8ea2d0d7f1",
      userId: this.props.currentUsername,
      tokenProvider: new Chatkit.TokenProvider({
        url: "http://localhost:3001/authenticate"
      })
    });

    chatManager
      .connect()
      .then(currentUser => {
        this.setState({ currentUser });
        return currentUser
          .subscribeToRoom({
            roomId: "31230385",
            messageLimit: 100,
            hooks: {
              onMessage: message => {
                this.setState({
                  messages: [...this.state.messages, message]
                });
              }
            }
          })
          .then(currentRoom => {
            console.log(currentRoom);
            this.setState({ currentRoom });
          });
      })
      .catch(error => console.log("error", error));
  }

  render() {
    const styles = {
      container: {
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      },
      chatContainer: {
        display: "flex",
        flex: 1
      },
      whosOnlineListContainer: {
        width: "300px",
        flex: "none",
        padding: 20,
        backgroundColor: "#2c303b",
        color: "white"
      },
      chatListContainer: {
        padding: 20,
        width: "85%",
        display: "flex",
        flexDirection: "column"
      }
    };

    return (
      <div style={styles.container}>
        <div style={styles.chatContainer}>
          <aside style={styles.whosOnlineListContainer}>
            <h2>Who's online PLACEHOLDER</h2>
          </aside>
          <section style={styles.chatListContainer}>
            <MessagesList
              messages={this.state.messages}
              styles={styles.chatListContainer}
            />
            <SendMessagesForm onSubmit={this.sendMessage} />
          </section>
        </div>
      </div>
    );
  }
}

export default ChatScreen;
