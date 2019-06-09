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
          cellRenderer: function(params) {
            const div = document.createElement("div");
            div.className = "actionButtons";
            const deleteRowButton = document.createElement("div");
            deleteRowButton.className = "deleteRowButton";
            ReactDOM.render(
              <div onClick={() => that.handleDelete(params.data.id, params)}>
                Delete
              </div>,
              deleteRowButton
            );
            div.innerText = params.data.id;
            div.appendChild(deleteRowButton);

            return div;
          }
        },
        {
          field: "content",
          width: 500,
          cellRenderer: function(params) {
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
          field: "is_done",
          width: 50,
          cellRenderer: function(params) {
            const div = document.createElement("div");
            ReactDOM.render(
              <CustomedCheckBox
                checked={params.data.is_done}
                cb={data => that.handleCbCheckBox(data, params.data.id)}
              />,
              div
            );
            return div;
          }
        },
        {
          headerName: "Repeated card",
          field: "",
          cellRenderer: function(params) {
            const div = document.createElement("div");
            ReactDOM.render(<RepeatedCard />, div);
            return div;
          }
        },
        {
          field: "default_cost",
          width: 100,
          cellRenderer: function(params) {
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
          cellRenderer: function(params) {
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
          cellRenderer: function(params) {
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
    console.log(params);
    const url = getDeleteNoteUrl();
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
    const url = getUpdateNoteUrl();
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

  handleCbCheckBox(is_done, id) {
    const url = getUpdateNoteUrl();
    let done_time = new Date().getTime();
    let data = is_done ? { id, is_done, done_time } : { id, is_done };
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
          this.gridApi.setRowData(response.data.posts);
          this.gridApi.sizeColumnsToFit();
          this.rowData = response.data.posts;
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

// "use strict";

// import React, { Component } from "react";
// import { render } from "react-dom";
// import { AgGridReact } from "ag-grid-react";

// export default class CheckList extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       columnDefs: [
//         {
//           headerName: "Make",
//           field: "make"
//         },
//         {
//           headerName: "Model",
//           field: "model"
//         },
//         {
//           headerName: "Price",
//           field: "price"
//         },
//         {
//           headerName: "Zombies",
//           field: "zombies"
//         },
//         {
//           headerName: "Style",
//           field: "style"
//         },
//         {
//           headerName: "Clothes",
//           field: "clothes"
//         }
//       ],
//       rowData: [
//         {
//           make: "Toyota",
//           model: "Celica",
//           price: 35000,
//           zombies: "Elly",
//           style: "Smooth",
//           clothes: "Jeans"
//         },
//         {
//           make: "Ford",
//           model: "Mondeo",
//           price: 32000,
//           zombies: "Shane",
//           style: "Filthy",
//           clothes: "Shorts"
//         },
//         {
//           make: "Porsche",
//           model: "Boxter",
//           price: 72000,
//           zombies: "Jack",
//           style: "Dirty",
//           clothes: "Padded"
//         }
//       ],
//       rowSelection: "multiple"
//     };
//   }

//   onGridReady = params => {
//     this.gridApi = params.api;
//     this.gridColumnApi = params.columnApi;
//   };

//   getRowData() {
//     var rowData = [];
//     this.gridApi.forEachNode(function(node) {
//       rowData.push(node.data);
//     });
//     console.log("Row Data:");
//     console.log(rowData);
//   }
//   clearData() {
//     this.gridApi.setRowData([]);
//   }
//   onAddRow() {
//     var newItem = createNewRowData();
//     var res = this.gridApi.updateRowData({ add: [newItem] });
//     printResult(res);
//   }
//   addItems() {
//     var newItems = [createNewRowData(), createNewRowData(), createNewRowData()];
//     var res = this.gridApi.updateRowData({ add: newItems });
//     printResult(res);
//   }
//   addItemsAtIndex() {
//     var newItems = [createNewRowData(), createNewRowData(), createNewRowData()];
//     var res = this.gridApi.updateRowData({
//       add: newItems,
//       addIndex: 2
//     });
//     printResult(res);
//   }
//   updateItems() {
//     var itemsToUpdate = [];
//     this.gridApi.forEachNodeAfterFilterAndSort(function(rowNode, index) {
//       if (index >= 5) {
//         return;
//       }
//       var data = rowNode.data;
//       data.price = Math.floor(Math.random() * 20000 + 20000);
//       itemsToUpdate.push(data);
//     });
//     var res = this.gridApi.updateRowData({ update: itemsToUpdate });
//     printResult(res);
//   }
//   onInsertRowAt2() {
//     var newItem = createNewRowData();
//     var res = this.gridApi.updateRowData({
//       add: [newItem],
//       addIndex: 2
//     });
//     printResult(res);
//   }
//   onRemoveSelected() {
//     var selectedData = this.gridApi.getSelectedRows();
//     console.log(selectedData);
//     var res = this.gridApi.updateRowData({ remove: selectedData });
//     printResult(res);
//   }
//   render() {
//     return (
//       <div style={{ width: "100%", height: "100%" }}>
//         <div
//           style={{
//             height: "100%",
//             paddingTop: "60px",
//             boxSizing: "border-box"
//           }}
//         >
//           <div
//             id="myGrid"
//             style={{
//               height: "500px",
//               width: "100%"
//             }}
//             className="ag-theme-balham"
//           >
//             <AgGridReact
//               columnDefs={this.state.columnDefs}
//               rowData={this.state.rowData}
//               animateRows={true}
//               rowSelection={this.state.rowSelection}
//               onGridReady={this.onGridReady}
//             />
//           </div>
//         </div>

//         <div style={{ position: "absolute", top: "0px", left: "0px" }}>
//           <div>
//             <button onClick={this.onAddRow.bind(this)}>Add Row</button>
//             <button onClick={this.onInsertRowAt2.bind(this)}>
//               Insert Row @ 2
//             </button>
//             <button onClick={this.updateItems.bind(this)}>
//               Update First 5
//             </button>
//             <button onClick={this.onRemoveSelected.bind(this)}>
//               Remove Selected
//             </button>
//             <button onClick={this.getRowData.bind(this)}>Get Row Data</button>
//           </div>
//           <div style={{ marginTop: "4px" }}>
//             <button onClick={this.clearData.bind(this)}>Clear Data</button>
//             <button onClick={this.addItems.bind(this)}>Add Items</button>
//             <button onClick={this.addItemsAtIndex.bind(this)}>
//               Add Items @ 2
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// var newCount = 1;
// function createNewRowData() {
//   var newData = {
//     make: "Toyota " + newCount,
//     model: "Celica " + newCount,
//     price: 35000 + newCount * 17,
//     zombies: "Headless",
//     style: "Little",
//     clothes: "Airbag"
//   };
//   newCount++;
//   return newData;
// }
// function printResult(res) {
//   console.log("---------------------------------------");
//   if (res.add) {
//     res.add.forEach(function(rowNode) {
//       console.log("Added Row Node", rowNode);
//     });
//   }
//   if (res.remove) {
//     res.remove.forEach(function(rowNode) {
//       console.log("Removed Row Node", rowNode);
//     });
//   }
//   if (res.update) {
//     res.update.forEach(function(rowNode) {
//       console.log("Updated Row Node", rowNode);
//     });
//   }
// }
