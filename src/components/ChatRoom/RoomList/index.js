// import React from "react";
// import axios from "axios";

// class RoomList extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       listRooms: []
//     };
//   }
//   componentDidMount() {
//     axios
//       .get(
//         "https://us1.pusherplatform.io/services/chatkit/v4/c89d2d68-a0df-4ed6-82b0-ac8ea2d0d7f1/rooms",
//         {
//           headers: {
//             Authorization:
//               "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0YW5jZSI6ImM4OWQyZDY4LWEwZGYtNGVkNi04MmIwLWFjOGVhMmQwZDdmMSIsImlzcyI6ImFwaV9rZXlzLzgyM2Q5MzIyLTUyOTAtNGIxMS1hY2IwLTZlNDRlNGZjY2EyMSIsImlhdCI6MTU2MTYwMzk4NywiZXhwIjoxNTYxNjkwMzg3LCJzdWIiOiI0NTIyYjYwNC1hMDVjLTQ1NTUtYjZmMi1iM2M1MmZhODFlZWMifQ.YcZgRw_mB-26SpeDHHVvhyJEFK1YlpV4DjNLtQKK6zs"
//           }
//         }
//       )
//       .then(response => {
//         console.log(response.data);
//         this.setState({
//           listRooms: response.data
//         });
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }
//   render() {
//     const { rooms, user, messages, current, typing, actions } = this.props;
//     const { listRooms } = this.state;
//     // console.log(rooms, user, messages, current, typing, actions)
//     return (
//       <ul>
//         {(listRooms || []).map(room => {
//           const messageKeys = Object.keys(messages[room.id] || {});
//           const latestMessage =
//             messageKeys.length > 0 && messages[room.id][messageKeys.pop()];
//           // const firstUser = room.users.find(x => x.id !== user.id)
//           return (
//             <li
//               key={room.id}
//               disabled={room.id === current.id}
//               onClick={e => actions.joinRoom(room)}
//             >
//               {/* {
//                             room.name.match(user.id) && firstUser
//                                 ? <img src={firstUser.avatarUrl} alt={firstUser.id} />
//                                 : (room.isPrivate ? 'lock' : 'public')
//                         } */}
//               <div>
//                 <p>{room.name.replace(user.id, "")}</p>
//                 <span>{latestMessage && latestMessage.text}</span>
//               </div>
//               {room.id !== current.id ? (
//                 <label>unreadCount</label>
//               ) : Object.keys(typing[room.id] || {}).length > 0 ? (
//                 <div>
//                   {[0, 1, 2].map(x => (
//                     <div key={x} />
//                   ))}
//                 </div>
//               ) : null}
//             </li>
//           );
//         })}
//       </ul>
//     );
//   }
// }

// export default RoomList;

import React from "react";
import style from "./index.module.css";
import { dots } from "../TypingIndicator/index.module.css";

const Icon = id => (
  <svg>
    <use xlinkHref={`index.svg#${id}`} />
  </svg>
);

const unreads = (user, room, messages = {}) => {
  const read = user.readCursor({ roomId: room.id });
  return (
    (read && Object.keys(messages).filter(x => x > read.position).length) ||
    undefined
  );
};

const priority = (user, room, messages = {}) => {
  const unreadMessages = unreads(user, room, messages) || 0;
  const lastMessage = Object.keys(messages).pop() || 0;
  return (10 * unreadMessages + parseInt(lastMessage)) * -1;
};

export const RoomList = ({
  rooms = [],
  user,
  messages,
  current,
  typing,
  actions
}) => (
  <ul className={style.component}>
    {rooms.map(room => {
      const messageKeys = Object.keys(messages[room.id] || {});
      const latestMessage =
        messageKeys.length > 0 && messages[room.id][messageKeys.pop()];
      const firstUser = room.users.find(x => x.id !== user.id);
      const order = priority(user, room, messages[room.id]);
      const unreadCount = unreads(user, room, messages[room.id]);
      return (
        <li
          key={room.id}
          disabled={room.id === current.id}
          onClick={e => actions.joinRoom(room)}
          style={{ order }}
        >
          {room.name.match(user.id) && firstUser ? (
            <img src={firstUser.avatarURL} alt={firstUser.id} />
          ) : (
            Icon(room.isPrivate ? "lock" : "public")
          )}
          <col->
            <p>{room.name.replace(user.id, "")}</p>
            <span>{latestMessage && latestMessage.text}</span>
          </col->
          {room.id !== current.id && unreadCount ? (
            <label>{unreadCount}</label>
          ) : Object.keys(typing[room.id] || {}).length > 0 ? (
            <div className={dots}>
              {[0, 1, 2].map(x => (
                <div key={x} />
              ))}
            </div>
          ) : null}
        </li>
      );
    })}
  </ul>
);
