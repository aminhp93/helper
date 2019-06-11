import React from "react";
import axios from "axios";
import {
  getUpdateNoteUrl,
  getDeleteNoteUrl
} from "../../helpers/requests";

export default class NoteItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.item
    };
  }

  checkTotal(e, id) {
    this.handleUpdateNote({ id: id, is_done: !this.state.item.is_done });
  }

  handleUpdateNote(data = {}) {
    if (!data.id) return
    const url = getUpdateNoteUrl(data.id);
    axios
      .post(url, data)
      .then(response => {
        console.log(response);
        if (response.data && response.data.data === "Updated successfully") {
          if (response.data.post) {
            this.setState({
              item: response.data.post
            });
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleDeleteNote(id) {
    const url = getDeleteNoteUrl(id);
    const data = {
      id: id
    };
    axios
      .post(url, data)
      .then(response => {
        console.log(response);
        if (
          response.data &&
          response.data.data &&
          response.data.data === "Deleted successfully"
        ) {
          this.props.cb({ message: "Deleted successfully" });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { item } = this.state;
    return (
      <div
        key={item.id}
        className={`${item.is_done ? "strikethrough" : ""} noteItem`}
      >
        <input
          type="checkbox"
          checked={item.is_done}
          onChange={e => this.checkTotal(e, item.id)}
        />
        <div className="content">{item.content}</div>
        {/* <div onClick={() => this.handleUpdateNote(item.id)}>edit</div> */}
        <div onClick={() => this.handleDeleteNote(item.id)}>delete</div>
      </div>
    );
  }
}
