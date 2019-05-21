import React from "react";
import axios from "axios";
import {
  getAllNotesUrl,
  getCreateNoteUrl
} from "../../helpers/requests";
import NoteItem from "./NoteItem";

export default class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
    this.note = "";
  }

  handleCreateNote() {
    this.createNote();
  }

  createNote() {
    const url = getCreateNoteUrl();
    const data = {
      content: this.inputNoteDom.value
    };
    this.inputNoteDom.value = "";
    axios
      .post(url, data)
      .then(response => {
        if (
          response.data &&
          response.data.data &&
          response.data.data === "Created successfully"
        ) {
          this.getAllNotes();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleCb(data) {
    if (data.message === "Deleted successfully") {
      this.getAllNotes();
    }
  }

  handleOnKeyPress(e) {
    if (e.key === "Enter") {
      this.handleCreateNote();
    }
  }

  render() {
    return (
      <div className="note">
        <div className="noteInput">
          <input
            onKeyPress={e => this.handleOnKeyPress(e)}
            ref={dom => (this.inputNoteDom = dom)}
          />
          <div onClick={() => this.handleCreateNote()}>Add note</div>
        </div>
        {this.state.notes && this.state.notes.length ? (
          <div className="noteItems">
            {this.state.notes.map(item => {
              return (
                <NoteItem
                  key={item.id}
                  item={item}
                  cb={data => this.handleCb(data)}
                />
              );
            })}
          </div>
        ) : (
            <div className="noNote">Please add some notes</div>
          )}
        <div />
      </div>
    );
  }

  getAllNotes() {
    const url = getAllNotesUrl();
    axios
      .get(url)
      .then(response => {
        if (
          response.data &&
          response.data.posts &&
          response.data.posts.length
        ) {
          this.setState({
            notes: response.data.posts
          });
        } else {
          this.setState({
            notes: []
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getAllNotes();
  }
}
