import React, { Component } from "react";
import axios from "axios";
import { getData } from "./../../helpers/data";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { PieChart, Pie, Legend, Tooltip } from "recharts";
import CustomPieChart from "./../CustomPieChart";
import { calculateClose, mapData } from "./../../helpers/functionUtils";
import moment from "moment";

class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "symbol",
          field: "symbol"
        },
        {
          headerName: "price_data",
          field: "price_data"
        },
        {
          headerName: 'Index 1',
          field: 'price_gap_index'
        }
      ],
      rowData: []
    };
  }
  render() {
    return (
      <div className="stock">
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
        <div className="chartContainer">
          <CustomPieChart data={this.state.minData} timeValue={251} />
          <CustomPieChart data={this.state.minData} timeValue={18} />
          <CustomPieChart
            data={this.state.minData}
            timeValue={251}
            percentValue={20}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    const array = [
      "ROS",
      "FLC",
      "VRE",
      "HQC",
      "HBC",
      "ITA",
      "PVD",
      "HAG",
      "SCR",
      "ASM"
    ];
    const endDay = moment()
      .subtract(1, "days")
      .format("YYYY-MM-DD");
    // array.map(item => {
    //   axios
    //     .get(
    //       `https://svr1.fireant.vn/api/Data/Markets/HistoricalQuotes?symbol=${item}&startDate=2012-1-1&endDate=${endDay}`
    //     )
    //     .then(response => {
    //       console.log(response.data);
    //       // axios
    //       //   .post("https://project-2018-backend.herokuapp.com/note/update", {
    //       //     note: JSON.stringify(response.data)
    //       //   })
    //       //   .then(response => {
    //       //     console.log(response.data);
    //       //   })
    //       //   .catch(error => {
    //       //     console.log(error);
    //       //   });
    //       axios
    //         .post("http://localhost:8000/stock/create", {
    //           symbol: item,
    //           price_data: JSON.stringify(response.data)
    //         })
    //         .then(response => {
    //           console.log(response);
    //         })
    //         .catch(error => {
    //           console.log(error);
    //         });
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // });

    // axios
    //   .get("https://project-2018-backend.herokuapp.com/notes/all")
    //   .then(response => {
    //     const rowData = JSON.parse(response.data.note);
    //     console.log(rowData);
    //     this.setState({
    //       rowData
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    axios
      .get("http://localhost:8000/stocks/all")
      .then(response => {
        console.log(response);
        const rowData = response.data.stocks
        const mappedData = mapData(rowData, 'price_gap_index')
        const minData = JSON.parse(rowData[2].price_data)
        this.setState({
          minData,
          rowData: mappedData
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default Stock;
