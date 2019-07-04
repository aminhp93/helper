import React from "react";
import style from "./index.module.css";

const dots = (
  <div className={style.dots}>
    {[0, 1, 2].map(x => (
      <div key={x} />
    ))}
  </div>
);

class TypingIndicator extends React.Component {
  render() {
    const typing = this.props.typing || {};
    if (Object.keys(typing).length) {
      return (
        <div className={style.component}>
          <div>{dots}</div>
          <div>
            {`${Object.keys(typing)
              .slice(0, 2)
              .join(" and ")} is typing`}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default TypingIndicator;
