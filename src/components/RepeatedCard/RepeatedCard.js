import React from "react";

import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

class RepeatedCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  handleOpen() {
    this.setState({ open: true });
  }

  closeModal() {
    this.setState({ open: false });
  }
  render() {
    return (
      <div className="repeatedCard">
        <Button onClick={this.handleOpen.bind(this)}>Open Modal</Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.closeModal.bind(this)}
        >
          <div className="modalContent">
            1 - Dropdown daily/monthly/weekly 2 - Time 3 - Date Monday to Sunday
            Save/Remove Button
          </div>
        </Modal>
      </div>
    );
  }
}

export default RepeatedCard;
