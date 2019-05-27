import React, { Component } from "react";
import axios from "axios";
import CustomedPieChart from "./../_customedComponents/CustomedPieChart";
import CustomedButton from "./../_customedComponents/CustomedButton";
import {
  mapStockData
  //  mapData
} from "./../../helpers/functionUtils";
import {
  updateAllStocksDatabase,
  getAllStocksUrl,
  deleteAllStocks,
  getQuickFilteredStocksUrl
} from "../../helpers/requests";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import Button from "@material-ui/core/Button";
import CustomedAgGridReact from "../_customedComponents/CustomedAgGridReact";

class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "Symbol",
          field: "Symbol"
        },
        {
          headerName: "Close",
          field: "Close",
          filter: "agNumberColumnFilter",
          cellRenderer: function (params) {
            if (params.data.Close) {
              return params.data.Close.toFixed(0);
            }
          }
        },
        {
          headerName: "ROE",
          field: "ROE",
          filter: "agNumberColumnFilter",
          cellRenderer: function (params) {
            if (params.data.ROE) {
              return params.data.ROE.toFixed(2);
            }
          }
        },
        {
          headerName: "EPS",
          field: "EPS",
          filter: "agNumberColumnFilter",
          cellRenderer: function (params) {
            if (params.data.EPS) {
              return params.data.EPS.toFixed(0);
            }
          }
        },
        {
          headerName: "MarketCapitalization",
          field: "MarketCapitalization",
          filter: "agNumberColumnFilter",
          cellRenderer: function (params) {
            if (params.data.MarketCapitalization) {
              return params.data.MarketCapitalization.toFixed(0);
            }
          }
        },
        {
          headerName: "Gia tri GD",
          field: "DayTradingValue"
        },
        {
          headerName: "Volume",
          field: "Volume",
          filter: "agNumberColumnFilter"
        },
        {
          headerName: "RSI_14",
          field: "RSI_14",
          filter: "agNumberColumnFilter"
        },
        {
          headerName: "RSI_14_diff",
          field: "RSI_14_diff",
          filter: "agNumberColumnFilter"
        },
        {
          headerName: "Index 1",
          field: "price_gap_index"
        }
      ],
      rowData: []
    };
  }

  render() {
    return (
      <div className="stock">
        Stock
        <div className="stockTable">
          <CustomedAgGridReact
            title="stock"
            columnDefs={this.state.columnDefs}
            rowData={mapStockData(this.state.rowData)}
          />
        </div>
        <div className="chartContainer">
          <CustomedPieChart data={this.state.minData} timeValue={251} />
          <CustomedPieChart data={this.state.minData} timeValue={18} />
          <CustomedPieChart
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
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
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
        <div className="updateButtons">
          <Button
            variant="contained"
            color="secondary"
            disabled={this.state.loading}
            onClick={() => {
              deleteAllStocks();
            }}
          >
            Delete all stocks
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={this.state.loading}
            onClick={() => {
              this.setState({
                loading: true
              }, () => updateAllStocksDatabase("HOSE_stocks", this))
            }}
          >
            Update HOSE_stocks
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={this.state.loading}
            onClick={() => {
              this.setState({
                loading: true
              }, () => updateAllStocksDatabase("HNX_stocks", this))
            }}
          >
            Update HNX_stocks
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={this.state.loading}
            onClick={() => {
              this.setState({
                loading: true
              }, () => updateAllStocksDatabase("UPCOM_stocks", this))
            }}
          >
            Update UPCOM_stocks
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={this.state.loading}
            onClick={this.getAllDatabase.bind(this)}
          >
            Get all database
          </Button>
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

  getAllDatabase() {
    //  axios
    // .get(getAllStocksUrl())
    // .then(response => {
    //   console.log(response);
    //   const rowData = response.data.stocks;
    //   const mappedData = mapData(rowData, "price_gap_index");
    //   console.log(mappedData);
    //   const minData = JSON.parse(rowData[2].price_data);

    // this.setState({
    // minData,
    // rowData: mappedData.returnedData,
    // barChartData: mappedData.barChartData
    //   });
    // })
    // .catch(error => {
    //   console.log(error);
    // });
    this.setState({
      loading: true
    }, () => {
      axios
        .get(getAllStocksUrl())
        .then(response => {
          console.log(response);
          this.setState({
            rowData: response.data.stocks,
            loading: false
          });
        })
        .catch(error => {
          console.log(error);
          this.setState({
            loading: false
          })
        });
    })

  }

  componentDidMount() {
    axios
      .get(getQuickFilteredStocksUrl())
      .then(response => {
        console.log(response);
        this.setState({
          rowData: response.data.stocks
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default Stock;
