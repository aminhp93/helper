import ReactDOM from "react-dom";
import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import {
  getAllNotesUrl,
  getCreateNoteUrl,
  getUpdateNoteUrl,
  getDeleteNoteUrl
} from "../../helpers/requests";
import CustomedCheckBox from "../_customedComponents/CustomedCheckBox";
import CustomedInput from "../_customedComponents/CustomedInput";
import RepeatedCard from "../RepeatedCard";
import LinearProgress from '@material-ui/core/LinearProgress';
import Icon from "@material-ui/core/Icon";

class CheckList extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.rowData = [];
    this.state = {
      columnDefs: [
        {
          field: "id",
          rowDrag: true,
          cellRenderer: function (params) {
            const div = document.createElement("div");
            div.className = "actionButtons";
            const deleteRowButton = document.createElement("div");
            const progressLinear = document.createElement('div');
            deleteRowButton.className = "deleteRowButton";
            ReactDOM.render(
              <div onClick={() => that.handleDelete(params.data.id, params)}>
                <Icon>delete</Icon>
              </div>,
              deleteRowButton
            );
            // ReactDOM.render(
            //   <div>{params.data.is_doing ? <LinearProgress /> : null}</div>, progressLinear
            // )
            progressLinear.className = 'progressLinear'
            div.innerText = params.data.id;
            div.appendChild(progressLinear)
            div.appendChild(deleteRowButton);

            return div;
          }
        },
        {
          field: "Done",
          width: 50,
          cellRenderer: function (params) {
            const div = document.createElement("div");
            ReactDOM.render(
              <CustomedCheckBox
                checked={params.data.is_done}
                cb={data => that.handleCbCheckBox(data, params.data.id, 'is_done')}
              />,
              div
            );
            return div;
          }
        },
        {
          field: "content",
          width: 500,
          cellRenderer: function (params) {
            const div = document.createElement("div");
            ReactDOM.render(
              <CustomedInput
                value={params.data.content}
                cb={content => that.handleCbInput({ content }, params.data.id)}
              />,
              div
            );
            return div;
          }
        },
        {
          field: "In Progress",
          width: 70,
          cellRenderer: function (params) {
            console.log(84)
            const div = document.createElement("div");
            ReactDOM.render(
              <div>
                <CustomedCheckBox
                  checked={params.data.is_doing}
                  cb={data => that.handleCbCheckBox(data, params.data.id, 'is_doing')}
                />
              </div>
              ,
              div
            );
            return div;
          }
        },
        {
          headerName: "Repeated card",
          field: "",
          cellRenderer: function (params) {
            const div = document.createElement("div");
            ReactDOM.render(<RepeatedCard />, div);
            return div;
          }
        },
        {
          field: "default_cost",
          width: 100,
          cellRenderer: function (params) {
            const div = document.createElement("div");
            ReactDOM.render(
              <CustomedInput
                type="float"
                value={params.data.default_cost}
                cb={default_cost =>
                  that.handleCbInput({ default_cost }, params.data.id)
                }
              />,
              div
            );
            return div;
          }
        },
        {
          field: "actual_cost",
          width: 100,
          cellRenderer: function (params) {
            const div = document.createElement("div");
            ReactDOM.render(
              <CustomedInput
                type="float"
                value={params.data.actual_cost}
                cb={actual_cost =>
                  that.handleCbInput({ actual_cost }, params.data.id)
                }
              />,
              div
            );
            return div;
          }
        },
        {
          field: "scheduled_time",
          cellRenderer: function (params) {
            const div = document.createElement("div");
            ReactDOM.render(
              <CustomedInput
                type="float"
                value={params.data.scheduled_time}
                cb={scheduled_time =>
                  that.handleCbInput({ scheduled_time }, params.data.id)
                }
              />,
              div
            );
            return div;
          }
        }
      ],
      defaultColDef: {
        width: 150,
        sortable: true,
        filter: true,
        resizable: true,
        enableCellChangeFlash: true
      },
      rowData: []
    };
  }

  handleDelete(id, params) {
    const url = getDeleteNoteUrl(id);
    const data = {
      id
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
          let lstRemove = [];
          lstRemove.push(params.node.data);
          this.gridApi &&
            this.gridApi.updateRowData({
              remove: lstRemove
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleCbInput(data, id) {
    console.log(data, id);
    const url = getUpdateNoteUrl(id);
    const objData = { ...data, id };
    axios
      .post(url, objData)
      .then(response => {
        //
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleCbCheckBox(checked_value, id, index) {
    const url = getUpdateNoteUrl(id);
    let done_time = new Date().getTime();
    let data = { id }
    if (index === 'is_done') {
      data.is_done = checked_value
      if (checked_value) {
        data.done_time = done_time
      }
    } else if (index === 'is_doing') {
      data.is_doing = checked_value
    }
    axios
      .post(url, data)
      .then(response => {
        const url1 = getAllNotesUrl();
        axios
          .get(url1)
          .then(response => {
            if (
              response.data &&
              response.data.posts &&
              response.data.posts.length
            ) {
              // this.gridApi.setRowData(response.data.posts);
              // this.gridApi.sizeColumnsToFit();

              this.setState({
                rowData: response.data.posts
              })
            }
          })
          .catch(error => {
            console.log(error);
          });
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
          // this.gridApi.setRowData(response.data.posts);
          // this.gridApi.sizeColumnsToFit();
          this.rowData = response.data.posts;
          this.setState({
            rowData: response.data.posts
          })
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getAllNotes();
  };

  handleCreate(e) {
    // e.preventDefault()
    const url = getCreateNoteUrl();
    const data = {
      content: "test"
    };
    axios
      .post(url, data)
      .then(response => {
        if (
          response.data &&
          response.data.data &&
          response.data.data === "Created successfully"
        ) {
          this.rowData.unshift(response.data.post);
          this.gridApi.setRowData(this.rowData);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  onRowDragStart(e) {
    console.log(e);
  }

  onRowDragEnd(e) {
    let obj = this.gridApi.getRowNode(e.overIndex).data;
    console.log(e, obj, obj.scheduled_time);
    // e.node.data.scheduled_time =
    //   this.gridApi.getRowNode(e.overIndex).data.scheduled_time + 0.01;
    // this.gridApi.updateRowData({
    //   update: [e.node.data]
    // });
    // e.node.setDataValue(
    //   "scheduled_time",
    //   this.gridApi.getRowNode(e.overIndex).data.scheduled_time + 0.01
    // );
  }

  render() {
    console.log('render')
    return (
      <div className="checkList">
        <div onClick={e => this.handleCreate(e)}>Create</div>
        <div />
        <div className="ag-theme-balham agGridContainer">
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            rowDragManaged={true}
            animateRows={true}
            onGridReady={this.onGridReady}
            rowData={this.state.rowData}
            onRowDragEnd={this.onRowDragEnd.bind(this)}
            onRowDragStart={this.onRowDragStart.bind(this)}
            // headerHeight={0}
            rowHeight={50}
          />
        </div>
      </div>
    );
  }
}

export default CheckList;