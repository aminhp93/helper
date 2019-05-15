import React, { Component } from "react";
import axios from "axios";
import { getData } from "./../../helpers/data";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "Date",
          field: "Date"
        },
        {
          headerName: "Open",
          field: "Open",
          cellRenderer: function(params) {
            return params.data.Open.toFixed(0);
          }
        },
        {
          headerName: "Close",
          field: "Close",
          cellRenderer: function(params) {
            return params.data.Close.toFixed(0);
          }
        },
        {
          headerName: "High",
          field: "High",
          cellRenderer: function(params) {
            return params.data.High.toFixed(0);
          }
        },
        {
          headerName: "Low",
          field: "Low",
          cellRenderer: function(params) {
            return params.data.Low.toFixed(0);
          }
        },
        {
          headerName: "Volume",
          field: "Volume",
          cellRenderer: function(params) {
            return params.data.Volume.toFixed(0);
          }
        },
        {
          headerName: "Value",
          field: "Value",
          cellRenderer: function(params) {
            return params.data.Value.toFixed(0);
          }
        }
      ],
      rowData: []
    };
  }
  render() {
    return (
      <div>
        Stock
        <div>
          Api du lieu tu fireant --> so sanh gia tai 1 thoi diem va truoc do 1
          nam
        </div>
        <div
          className="ag-theme-balham"
          style={{
            height: "500px"
          }}
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    // console.log(getData());
    // axios
    //   .get(
    //     "https://svr1.fireant.vn/api/Data/Markets/HistoricalQuotes?symbol=FPT&startDate=2012-1-1&endDate=2018-12-31"
    //   )
    //   .then(response => {
    //     console.log(response.data);
    //     axios
    //       .post("https://project-2018-backend.herokuapp.com/note/update", {
    //         note: JSON.stringify(response.data)
    //       })
    //       .then(response => {
    //         console.log(response.data);
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    axios
      .get("https://project-2018-backend.herokuapp.com/notes/all")
      .then(response => {
        console.log(response.data);
        this.setState({
          rowData: JSON.parse(response.data.note)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default Stock;
