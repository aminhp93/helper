import React from "react";
import axios from "axios";
import {
  getAllNotesUrl,
  getCreateNoteUrl,
  getUpdateNoteUrl,
  getDeleteNoteUrl
} from "../../helpers/requests";

export default class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
  }

  handleCreateNote() {
    console.log("Clicked add note");
    this.createNote();
  }

  handleOnChangeNote(e) {
    console.log(e.target.value);
  }

  createNote() {
    const url = getCreateNoteUrl();
    const data = {
      content: "test content"
    };
    axios
      .post(url, data)
      .then(response => {
        console.log(response);
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

  handleUpdateNote() {
    const url = getUpdateNoteUrl();
    const data = {};
    axios
      .post(url, data)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleDeleteNote(id) {
    const url = getDeleteNoteUrl();
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
          this.getAllNotes();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="note">
        <div>List notes</div>
        <div className="noteInput">
          <input onChange={e => this.handleOnChangeNote(e)} />
          <div onClick={() => this.handleCreateNote()}>Add note</div>
        </div>
        {this.state.notes && this.state.notes.length ? (
          this.state.notes.map(item => {
            return (
              <div key={item.id} className="noteItem">
                <div>{item.content}</div>
                {/* <div onClick={() => this.handleUpdateNote(item.id)}>edit</div> */}
                <div onClick={() => this.handleDeleteNote(item.id)}>delete</div>
              </div>
            );
          })
        ) : (
          <div>Please add some notes</div>
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
        console.log(response);
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
