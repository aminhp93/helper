import React, { Component } from "react";
import axios from "axios";
import { getData } from "./../../helpers/data";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import {
  PieChart, Pie, Legend, Tooltip,
} from 'recharts';

const data01 = [
  { name: 'Group A', value: 400 }, { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 }, { name: 'Group D', value: 200 },
  { name: 'Group E', value: 278 }, { name: 'Group F', value: 189 },
];

const data02 = [
  { name: 'Group A', value: 2400 }, { name: 'Group B', value: 4567 },
  { name: 'Group C', value: 1398 }, { name: 'Group D', value: 9800 },
  { name: 'Group E', value: 3908 }, { name: 'Group F', value: 4800 },
];

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
          cellRenderer: function (params) {
            return params.data.Open.toFixed(0);
          }
        },
        {
          headerName: "Close",
          field: "Close",
          cellRenderer: function (params) {
            return params.data.Close.toFixed(0);
          }
        },
        {
          headerName: "High",
          field: "High",
          cellRenderer: function (params) {
            return params.data.High.toFixed(0);
          }
        },
        {
          headerName: "Low",
          field: "Low",
          cellRenderer: function (params) {
            return params.data.Low.toFixed(0);
          }
        },
        {
          headerName: "Volume",
          field: "Volume",
          cellRenderer: function (params) {
            return params.data.Volume.toFixed(0);
          }
        },
        {
          headerName: "Value",
          field: "Value",
          cellRenderer: function (params) {
            return params.data.Value.toFixed(0);
          }
        }
      ],
      rowData: []
    };
  }
  render() {
    return (
      <div className='stock'>
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
        <div className='chartContainer'>
          <PieChart width={400} height={400}>
            <Pie dataKey="value" isAnimationActive={false} data={this.state.yearData} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
            {/* <Pie dataKey="value" data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" /> */}
            <Tooltip />
          </PieChart>
          <PieChart width={400} height={400}>
            <Pie dataKey="value" isAnimationActive={false} data={this.state.monthData} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
            {/* <Pie dataKey="value" data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" /> */}
            <Tooltip />
          </PieChart>
        </div>

      </div>
    );
  }

  calculateClose(data, number) {
    let smallerCount = 0;
    let largerCount = 0
    for (let i = 0; i < data.length - number; i++) {
      if (data[i].Close < data[i + number].Close) {
        smallerCount += 1
      } else {
        largerCount += 1
      }
    }
    console.log(smallerCount, largerCount)
    const returnedData = [
      {
        name: 'smallerCount',
        value: smallerCount
      },
      {
        name: 'largerCount',
        value: largerCount
      }
    ]
    return returnedData
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
        const rowData = JSON.parse(response.data.note)
        console.log(rowData)
        const yearData = this.calculateClose(rowData, 365)
        const monthData = this.calculateClose(rowData, 30)
        this.setState({
          rowData,
          yearData,
          monthData
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default Stock;
