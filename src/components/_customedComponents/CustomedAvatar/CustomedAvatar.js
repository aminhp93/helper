import React from "react";
import { Avatar } from "antd";

class CustomedAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: props.size || 200
    };
  }

  handleChangeSize = () => {
    this.setState({
      size: this.state.size === 200 ? 650 : 200
    });
  };

  render() {
    const { size } = this.state;
    return (
      <Avatar
        {...this.props}
        size={size}
        onClick={() => this.handleChangeSize()}
      />
    );
  }
}

export default CustomedAvatar;
