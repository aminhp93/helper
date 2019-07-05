import React from "react";
import Chatkit from "@pusher/chatkit-client";
import MessagesList from "./MessagesList";
import SendMessagesForm from "./SendMessagesForm";
import TypingIndicator from "./TypingIndicator";
import WhosOnlineList from "./WhosOnlineList";
import config from "./../../config";

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      currentRoom: {},
      messages: [],
      usersWhoAreTyping: []
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.sendTypingEvent = this.sendTypingEvent.bind(this);
  }

  sendTypingEvent() {
    this.state.currentUser
      .isTypingIn({ roomId: this.state.currentRoom.id })
      .catch(error => console.log("error", error));
  }
  sendMessage(text) {
    this.state.currentUser.sendMessage({
      text,
      roomId: this.state.currentRoom.id
    });
  }
  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: config.instanceLocator,
      userId: this.props.currentUsername,
      tokenProvider: new Chatkit.TokenProvider({
        url: `${
          config.isProduction
            ? "https://helper-react.herokuapp.com"
            : "http://localhost:3333"
          }/api/authenticate`
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
              },
              onUserStartedTyping: user => {
                this.setState({
                  usersWhoAreTyping: [
                    ...this.state.usersWhoAreTyping,
                    user.name
                  ]
                });
              },
              onUserStoppedTyping: user => {
                this.setState({
                  usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                    username => username !== user.name
                  )
                });
              },
              onPresenceChange: () => this.forceUpdate()
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
            <WhosOnlineList
              currentUser={this.state.currentUser}
              users={this.state.currentRoom.users}
            />
          </aside>
          <section style={styles.chatListContainer}>
            <MessagesList
              messages={this.state.messages}
              styles={styles.chatListContainer}
            />
            <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping} />
            <SendMessagesForm
              onSubmit={this.sendMessage}
              onChange={this.sendTypingEvent}
            />
          </section>
        </div>
      </div>
    );
  }
}

export default ChatScreen;
