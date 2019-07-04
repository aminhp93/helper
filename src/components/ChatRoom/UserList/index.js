import React from "react";
import style from "./index.module.css";

class UserList extends React.Component {
  render() {
    const { current, createConvo, removeUser } = this.props;
    const room = this.props.room || {};
    return (
      <ul className={style.component}>
        {(room.users || []).map(user => (
          <li
            key={user.id}
            className={user.presence.state === "online" ? style.online : null}
            onClick={null}
            style={{ order: user.presence.state === "online" && -1 }}
          >
            <img src={user.avatarURL} alt={user.name} />
            <p>{user.name}</p>
          </li>
        ))}
        {(room.users || []).length < 5 ? (
          <li className={style.hint}>
            <div>
              Type <span>/invite &lt;username&gt;</span> to invite
            </div>
          </li>
        ) : null}
      </ul>
    );
  }
}

export default UserList;
