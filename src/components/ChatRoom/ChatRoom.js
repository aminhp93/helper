import React, { useReducer } from "react";
import UserHeader from "./UserHeader/index";
import { RoomList } from "./RoomList/index";
import RoomHeader from "./RoomHeader/index";
import MessagesList from "./MessagesList/index";
import TypingIndicator from "./TypingIndicator/index";
import CreateMessageForm from "./CreateMessageForm/index";
import UserList from "./UserList/index";
import JoinRoomScreen from "./JoinRoomScreen/index";
import WelcomeScreen from "./WelcomeScreen/index";
import CreateRoomForm from "./CreateRoomForm/index";
import config from "./../../config";

import ChatManager from "./chatkit";
import uuidv4 from "uuid/v4";
import { message } from "antd";

const existingUser = window.localStorage.getItem("chatkit-user");

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
      // UI
      // --------------------------
      setUserList: userListOpen => this.setState({ userListOpen }),

      // --------------------------
      // Typing Indicators
      // --------------------------
      isTyping: () => { },
      notTyping: () => { },
      // --------------------------
      // Messages
      // --------------------------
      addMessage: payload => {
        console.log(payload);
        const roomId = payload.room.id;
        const messageId = payload.id;
        // Update local message cache with new message
        this.setState(prevState => ({
          messages: {
            ...prevState.messages,
            [roomId]: {
              ...prevState.messages[roomId],
              [messageId]: payload
            }
          }
        }));

        // Update cursor if the message was read

        // Send notification
      },

      runCommand: command => {
        console.log(command);
        const commands = {
          invite: ([userId]) => this.actions.addUserToRoom({ userId }),
          remove: ([userId]) => this.actions.removeUserFromRoom({ userId }),
          leave: ([userId]) => this.actions.removeUserFromRoom({ userId: this.state.user.id })
        }

        const name = command.split(' ')[0]
        const args = command.split(' ').slice(1)
        const exec = commands[name]
        exec && exec(args) && exec(args).catch(error => console.log('error', error))

      },
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
      createRoom: options =>
        this.state.user.createRoom(options).then(this.actions.joinRoom),
      setRoom: room => {
        this.setState({ room, sidebarOpen: false });
        // this.actions.scrollToEnd()
      },
      subscribeToRoom: room => {
        console.log(room);
        !this.state.user.roomSubscriptions[room.id] &&
          this.state.user.subscribeToRoom({
            roomId: room.id,
            hooks: { onMessage: this.actions.addMessage }
          });
      },
      removeRoom: () => { },
      joinRoom: room => {
        this.actions.setRoom(room);
        this.actions.subscribeToRoom(room);
      },

      createConvo: options => {
        console.log(options)
        if (options.user.id !== this.state.user.id) {
          const exists = this.state.user.rooms.find(
            x => (x.name === options.user.id + this.state.user.id) ||
              (x.name === this.state.user.id + options.user.id)
          )

          exists
            ? this.actions.joinRoom(exists)
            : this.actions.createRoom({
              name: this.state.user.id + options.user.id,
              addUserIds: [options.user.id],
              private: true,
            })
        }
      },

      addUserToRoom: ({ userId, roomId = this.state.room.id }) => {
        this.state.user
          .addUserToRoom({ userId, roomId })
          .then(this.actions.setRoom)
      },

      removeUserFromRoom: ({ userId, roomId = this.state.room.id }) => {
        userId === this.state.user.id
          ? this.state.user.leaveRoom({ roomId })
          : this.state.user
            .removeUserFromRoom({ userId, roomId })
            .then(this.actions.setRoom)
      },
      // --------------------------
      // Presence
      // --------------------------
      setUserPresence: () => { }
    };
  }

  componentDidMount() {
    let new_user = String(uuidv4());
    console.log(existingUser);
    existingUser
      ? ChatManager(this, JSON.parse(existingUser))
      : fetch(`${
        process.env.NODE_ENV === 'production'
          ? "https://helper-react.herokuapp.com"
          : "http://localhost:3333"
        }/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username: new_user })
        })
        // .then(response => response.json())
        .then(res => {
          // console.log(res.body);
          window.localStorage.setItem(
            "chatkit-user",
            JSON.stringify({ id: new_user })
          );
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
    const { createRoom, createConvo, removeUserFromRoom } = this.actions;
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
            actions={this.actions}
          />
          {user.id && <CreateRoomForm submit={createRoom} />}
        </aside>
        <section>
          <RoomHeader state={this.state} actions={this.actions} />
          {room.id ? (
            <row->
              <col->
                <MessagesList
                  user={user}
                  messages={messages[room.id]}
                  createConvo={createConvo}
                />
                <TypingIndicator />
                <CreateMessageForm state={this.state} actions={this.actions} />
              </col->
              {userListOpen && (
                <UserList
                  room={room}
                  current={user.id}
                  createConvo={createConvo}
                  removeUser={removeUserFromRoom} />
              )}
            </row->
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
