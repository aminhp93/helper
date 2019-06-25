import React from "react";
import UserHeader from "./UserHeader";
import RoomList from "./RoomList";
import RoomHeader from "./RoomHeader";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";
import CreateMessageForm from "./CreateMessageForm";
import UserList from "./UserList";
import JoinRoomScreen from "./JoinRoomScreen";
import WelcomeScreen from "./WelcomeScreen";

import ChatManager from "./chatkit";
import uuidv4 from "uuid/v4";

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      room: {},
      messages: {},
      typing: {},
      sidebarOpen: false,
      userListOpen: window.innerWidth > 1000
    };

    this.actions = {
      // --------------------------
      // Typing Indicators
      // --------------------------
      isTyping: () => {},
      notTyping: () => {},
      // --------------------------
      // Messages
      // --------------------------
      addMessage: () => {},
      // --------------------------
      // Room
      // --------------------------

      setUser: user => {
        console.log(42, user);
        this.setState({
          user
        });
      },
      // --------------------------
      // Room
      // --------------------------
      subscribeToRoom: () => {},
      removeRoom: () => {},
      joinRoom: () => {},
      // --------------------------
      // Presence
      // --------------------------
      setUserPresence: () => {}
    };
  }

  componentDidMount() {
    let new_user = String(uuidv4());
    fetch("http://localhost:3333/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: new_user })
    })
      .then(response => {
        console.log(response);
        ChatManager(this, { id: new_user });
      })
      .catch(error => console.log(error));
  }

  render() {
    const {
      user,
      room,
      messages,
      typing,
      sidebarOpen,
      userListOpen
    } = this.state;
    console.log(user);
    return (
      <main>
        <aside>
          <UserHeader />
          <RoomList />
        </aside>
        <section>
          <RoomHeader />
          {room.id ? (
            <row>
              <col>
                <MessageList />
                <TypingIndicator />
                <CreateMessageForm />
              </col>
              {userListOpen && <UserList />}
            </row>
          ) : user.id ? (
            <JoinRoomScreen />
          ) : (
            <WelcomeScreen />
          )}
        </section>
      </main>
    );
  }
}

export default ChatRoom;
