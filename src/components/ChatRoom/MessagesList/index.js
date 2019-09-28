import React from "react";
import style from "./index.module.css";
import Message from "../Message/index";

const emptyList = (
  <div className={style.empty}>
    <span role="img" aria-label="post">
      📝
    </span>
    <h2>No Messages Yet</h2>
    <p>Be the first to post in this room or invite someone to join the room</p>
  </div>
);

class MessagesList extends React.Component {
  render() {
    const { messages } = this.props;
    return (
      <ul id="messages" className={style.component}>
        {Object.keys(messages || {}).length > 0 ? (
          <wrapper->
            {Object.keys(messages)
              .reverse()
              .map(k => {
                // return "hi";
                return <Message key={messages[k].id} message={messages[k]} />
                // return Message({ user, createConvo })(messages[k]);
              })}
          </wrapper->
        ) : (
            emptyList
          )}
      </ul>
    );
  }
}

export default MessagesList;
