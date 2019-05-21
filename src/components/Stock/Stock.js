import React, { Component } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import CustomPieChart from "./../CustomPieChart";
import { mapData } from "./../../helpers/functionUtils";
import { updateAllStocksDatabase, getAllStocksUrl } from '../../helpers/requests'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import Button from '@material-ui/core/Button'

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
          headerName: "close",
          field: "close",
          cellRenderer: function (params) {
            if (params.data.close) {
              return ((params.data.close) / 1000).toFixed(2)
            }
          }
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
        <Button variant="contained" color="secondary" onClick={() => {
          updateAllStocksDatabase()
        }}>
          Update data base
      </Button>

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
        <div>
          <BarChart
            width={500}
            height={300}
            data={this.state.barChartData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="increasedStockNumbers" fill="green" />
            <Bar dataKey="decreasedStockNumbers" fill="red" />
            <Bar dataKey="unchangedStockNumbers" fill="grey" />
          </BarChart>
        </div>
      </div>
    );
  }

  getAllStocks() {
    // axios.get('https://finfo-api.vndirect.com.vn/stocks?status=all')
    //   .then(response => {
    //     console.log(response)
    //     let array_HOSE = []
    //     let array_UPCOM = []
    //     let array_HNX = []
    //     const data = response.data.data.map(item => {
    //       if (item.floor === 'HOSE') {
    //         array_HOSE.push(item.symbol)
    //       } else if (item.floor === 'HNX') {
    //         array_HNX.push(item.symbol)
    //       } else if (item.floor === 'UPCOM') {
    //         array_UPCOM.push(item.symbol)
    //       }
    //     })
    //     console.log(String(array_HOSE), String(array_HNX), String(array_UPCOM))
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
  }

  componentDidMount() {
    axios
      .get(getAllStocksUrl())
      .then(response => {
        console.log(response);
        const rowData = response.data.stocks
        const mappedData = mapData(rowData, 'price_gap_index')
        console.log(mappedData)
        const minData = JSON.parse(rowData[2].price_data)

        this.setState({
          minData,
          rowData: mappedData.returnedData,
          barChartData: mappedData.barChartData
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default Stock;
