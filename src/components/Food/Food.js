import React from "react";

class Food extends React.Component {
  render() {
    return (
      <div>
        <div>
          <a
            target="_blank"
            href="https://www.youtube.com/watch?v=kT73Od1mIEY"
            rel="noopener noreferrer"
          >
            Thịt hầm Osso buco
          </a>
        </div>
        <div>
          <a target="_blank" href="" rel="noopener noreferrer">
            Cừu kho tộ, thịt cừu
          </a>
        </div>
        <div>
          <a target="_blank" href="" rel="noopener noreferrer">
            Thịt lợn nướng trong tương miso
          </a>
        </div>
        <div>
          <a target="_blank" href="" rel="noopener noreferrer">
            Feijoada (thịt heo Brasil và hầm đậu đen)
          </a>
        </div>
      </div>
    );
  }
}

export default Food;
