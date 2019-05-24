"use strict";
import ReactDOM from 'react-dom';
import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import {
  getAllNotesUrl,
  getCreateNoteUrl,
  getUpdateNoteUrl
} from "../../helpers/requests";
import CustomedCheckBox from '../_customedComponents/CustomedCheckBox';
import CustomedInput from '../_customedComponents/CustomedInput';

class CheckList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.rowData = []
    this.state = {
      columnDefs: [
        {
          field: "id",
          rowDrag: true,
          cellRenderer: function (params) {
            const div = document.createElement('div')
            div.className = 'actionButtons'
            const deleteRowButton = document.createElement('div')
            deleteRowButton.className = 'deleteRowButton'
            ReactDOM.render(<div onClick={() => console.log('Deleted')}>Delete</div>, deleteRowButton)
            div.innerText = params.data.id
            div.appendChild(deleteRowButton)

            return div
          }
        },
        {
          field: "content",
          cellRenderer: function (params) {
            const div = document.createElement('div')
            ReactDOM.render(<CustomedInput value={params.data.content} cb={(content) => that.handleCbInput({ content }, params.data.id)} />, div)
            return div
          }
        },
        {
          field: "is_done",
          cellRenderer: function (params) {
            const div = document.createElement('div')
            ReactDOM.render(<CustomedCheckBox checked={params.data.is_done} cb={(data) => that.handleCbCheckBox(data, params.data.id)} />, div)
            return div
          }
        },
        {
          field: "default_cost",
          cellRenderer: function (params) {
            const div = document.createElement('div')
            ReactDOM.render(<CustomedInput type='float' value={params.data.default_cost} cb={(default_cost) => that.handleCbInput({ default_cost }, params.data.id)} />, div)
            return div
          }
        },
        {
          field: "actual_cost",
          cellRenderer: function (params) {
            const div = document.createElement('div')
            ReactDOM.render(<CustomedInput type='float' value={params.data.actual_cost} cb={(actual_cost) => that.handleCbInput({ actual_cost }, params.data.id)} />, div)
            return div
          }
        },
        {
          field: "update"
        },
        {
          field: "timestamp"
        }
      ],
      defaultColDef: {
        width: 150,
        sortable: true,
        filter: true
      },
      rowData: []
    };
  }

  handleCbInput(data, id) {
    console.log(data, id)
    const url = getUpdateNoteUrl();
    const objData = { ...data, id }
    axios
      .post(url, objData)
      .then(response => {
        //
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleCbCheckBox(is_done, id) {
    const url = getUpdateNoteUrl();
    let data = { id, is_done }
    axios
      .post(url, data)
      .then(response => {
        // 
      })
      .catch(error => {
        console.log(error);
      });
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
          this.gridApi.setRowData(response.data.posts)
          this.rowData = response.data.posts
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getAllNotes()
  };

  handleCreate(e) {
    // e.preventDefault()
    const url = getCreateNoteUrl();
    const data = {
      content: 'test'
    };
    axios
      .post(url, data)
      .then(response => {
        if (
          response.data &&
          response.data.data &&
          response.data.data === "Created successfully"
        ) {
          this.rowData.unshift(response.data.post)
          this.gridApi.setRowData(this.rowData)
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div style={{ width: "100%", height: "500px" }} className='checkList'>
        <div onClick={(e) => this.handleCreate(e)}>Create</div>
        <div
          id="myGrid"
          style={{
            height: "100%",
            width: "100%"
          }}
          className="ag-theme-balham"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            rowDragManaged={true}
            animateRows={true}
            onGridReady={this.onGridReady}
            rowData={this.state.rowData}
            headerHeight={0}
            rowHeight={50}
          />
        </div>
      </div>
    );
  }
}

export default CheckList;