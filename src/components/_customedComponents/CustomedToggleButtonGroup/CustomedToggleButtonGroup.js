import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import uuid from "uuid";

class CustomedToggleButtonGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.options[0].value
    };
  }

  handleChangeData(event, newData) {
    if (!newData) return;
    this.setState(
      {
        data: newData
      },
      () => this.props.cb(newData)
    );
  }

  render() {
    let options = this.props.options || [];
    if (options && options.length && options.length > 0) {
      return (
        <ToggleButtonGroup
          value={this.state.data}
          exclusive
          onChange={this.handleChangeData.bind(this)}
        >
          {options.map(item => {
            return (
              <ToggleButton key={uuid.v4()} value={item.value}>
                {item.display_value}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      );
    } else {
      return null;
    }
  }
}

export default CustomedToggleButtonGroup;
