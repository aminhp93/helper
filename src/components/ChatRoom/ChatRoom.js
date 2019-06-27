import React, { useReducer } from "react";
import UserHeader from "./UserHeader";
import RoomList from "./RoomList";
import RoomHeader from "./RoomHeader/index";
import MessagesList from "./MessagesList/index";
import TypingIndicator from "./TypingIndicator";
import CreateMessageForm from "./CreateMessageForm/index";
import UserList from "./UserList";
import JoinRoomScreen from "./JoinRoomScreen/index";
import WelcomeScreen from "./WelcomeScreen";
import CreateRoomForm from "./CreateRoomForm/index";

import ChatManager from "./chatkit";
import uuidv4 from "uuid/v4";

const existingUser = window.localStorage.getItem('chatkit-user')

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
      isTyping: () => { },
      notTyping: () => { },
      // --------------------------
      // Messages
      // --------------------------
      addMessage: () => { },
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
      createRoom: options => this.state.user.createRoom(options).then(this.actions.joinRoom),
      setRoom: room => {
        this.setState({ room, sidebarOpen: false })
        // this.actions.scrollToEnd()
      },
      subscribeToRoom: room => {
        console.log(room);
        !this.state.user.roomSubscriptions[room.id] && this.state.user.subscribeToRoom({
          roomId: room.id,
          hooks: { onMessage: this.actions.addMessage }
        })
      },
      removeRoom: () => { },
      joinRoom: room => {
        this.actions.setRoom(room);
        this.actions.subscribeToRoom(room);
      },
      // --------------------------
      // Presence
      // --------------------------
      setUserPresence: () => { }
    };
  }

  componentDidMount() {
    let new_user = String(uuidv4());
    console.log(existingUser)
    existingUser
      ? ChatManager(this, JSON.parse(existingUser))
      : fetch("http://localhost:3333/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: new_user }),
      })
        // .then(response => response.json())
        .then(res => {
          // console.log(res.body);
          window.localStorage.setItem('chatkit-user', JSON.stringify({ id: new_user }))
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
    const { createRoom } = this.actions;
    return (
      <main>
        <aside data-open={sidebarOpen}>
          <UserHeader user={user} />
          <RoomList
            user={user}
            rooms={user.rooms}
            messages={messages}
            typing={typing}
            current={room}
            actions={this.actions} />
          {user.id && <CreateRoomForm submit={createRoom} />}
        </aside>
        <section>
          <RoomHeader state={this.state} actions={this.actions} />
          {room.id ? (
            <div>
              <div>
                <MessagesList user={user} messages={messages[room.id]} />
                <TypingIndicator />
                <CreateMessageForm state={this.state} actions={this.actions} />
              </div>
              {userListOpen && <UserList />}
            </div>
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
