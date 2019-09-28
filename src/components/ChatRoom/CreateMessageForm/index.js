import React from "react";
import style from "./index.module.css";

class CreateMessageForm extends React.Component {
  render() {
    const { state, actions } = this.props;
    const room = (state && state.room) || {};
    const user = (state && state.user) || {};
    // const message = (state && state.message) || "";
    const runCommand = actions && actions.runCommand;
    return room.id ? (
      <form
        className={style.component}
        onSubmit={e => {
          e.preventDefault();
          const message = e.target[0].value.trim();
          if (message.length === 0) return;

          e.target[0].value = "";
          message.startsWith("/")
            ? runCommand(message.slice(1))
            : user.sendMessage({
                text: message,
                roomId: room.id
              });
        }}
      >
        <input placeholder="Type a message" />
        <button type="submit">
          <svg>
            <use xlinkHref="index.svg#send" />
          </svg>
        </button>
      </form>
    ) : null;
  }
}

export default CreateMessageForm;
