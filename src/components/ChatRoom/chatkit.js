import Chatkit from "@pusher/chatkit-client";
import config from "../../config";

export default ({ state, actions }, { id, token }) =>
  new Chatkit.ChatManager({
    instanceLocator: config.instanceLocator,
    userId: id,
    tokenProvider: new Chatkit.TokenProvider({
      url: `${
        process.env.NODE_ENV === 'production'
          ? "https://helper-react.herokuapp.com"
          : "http://localhost:3333"
        }/api/authenticate`
    })
  })
    .connect({
      onUserStartedTyping: actions.isTyping,
      onUserStoppedTyping: actions.notTyping,
      onAddedToRoom: actions.subscribeToRoom,
      onRemovedFromRoom: actions.removeRoom,
      onPresenceChanged: actions.setUserPresence
    })
    .then(user => {
      // Subscribe to all rooms the user is member of
      console.log(26, user, user.rooms);
      Promise.all(
        user.rooms.map(room =>
          user.subscribeToRoom({
            roomId: room.id,
            hooks: { onMessage: actions.addMessage }
          })
        )
      ).then(rooms => {
        console.log(300, rooms, user);
        actions.setUser(user);
        //   Join the first room in the users room list
        user.rooms.length > 0 && actions.joinRoom(user.rooms[0]);
      });
    })
    .catch(error => console.log("Error on connection", error));
