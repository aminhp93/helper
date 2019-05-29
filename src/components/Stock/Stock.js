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
  getFilteredStocksUrl
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
import moment from "moment";
import io from 'socket.io-client';
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
          headerName: "TodayCapitalization",
          field: "today_capitalization",
          filter: "agNumberColumnFilter",
          cellRenderer: function (params) {
            return (params.data.today_capitalization / Math.pow(10, 9)).toFixed(
              0
            );
          }
        },
        {
          headerName: "% Change in Price",
          field: "percentage_change_in_price",
          filter: "agNumberColumnFilter",
          cellRenderer: function (params) {
            if (params.data.percentage_change_in_price) {
              return (params.data.percentage_change_in_price * 100).toFixed(2);
            }
          }
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
          headerName: "% Change in Volume",
          field: "percentage_change_in_volume",
          filter: "agNumberColumnFilter",
          cellRenderer: function (params) {
            if (params.data.percentage_change_in_volume) {
              return (params.data.percentage_change_in_volume * 100).toFixed(2);
            }
          }
        },
        {
          headerName: "Volume",
          field: "Volume",
          filter: "agNumberColumnFilter"
        },
        {
          headerName: "ROE",
          field: "ROE",
          filter: "agNumberColumnFilter",
          cellRenderer: function (params) {
            if (params.data.ROE) {
              return params.data.ROE.toFixed(0);
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
          headerName: "MarketCapitalization",
          field: "MarketCapitalization",
          filter: "agNumberColumnFilter",
          cellRenderer: function (params) {
            if (params.data.MarketCapitalization) {
              return params.data.MarketCapitalization.toFixed(0);
            }
          }
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
              this.setState(
                {
                  loading: true
                },
                () => updateAllStocksDatabase("HOSE_stocks", this)
              );
            }}
          >
            Update HOSE_stocks
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={this.state.loading}
            onClick={() => {
              this.setState(
                {
                  loading: true
                },
                () => updateAllStocksDatabase("HNX_stocks", this)
              );
            }}
          >
            Update HNX_stocks
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={this.state.loading}
            onClick={() => {
              this.setState(
                {
                  loading: true
                },
                () => updateAllStocksDatabase("UPCOM_stocks", this)
              );
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
    this.setState(
      {
        loading: true
      },
      () => {
        axios
          .get(getAllStocksUrl())
          .then(response => {
            console.log(response);
            // setTimeout(() => {
            this.setState({
              rowData: response.data.stocks,
              loading: false
            });
            // });
          })
          .catch(error => {
            console.log(error);
            this.setState({
              loading: false
            });
          });
      }
    );
  }

  componentDidMount() {
    let Volume_min = 10000;
    let RSI_14_max = 70;
    let RSI_14_min = 60;
    let RSI_14_diff_min = 0;
    let ROE_min = 17;
    let EPS_min = 3000;
    axios
      .post(getFilteredStocksUrl(), {
        Volume_min,
        RSI_14_max,
        RSI_14_min,
        RSI_14_diff_min,
        ROE_min,
        EPS_min
      })
      .then(response => {
        console.log(response);
        this.setState({
          rowData: response.data.stocks
        });
      })
      .catch(error => {
        console.log(error);
      });

    const endDay = moment()
      .subtract(1, "days")
      .format("YYYY-MM-DD");
    let item = "VJC";
    let url = `https://svr1.fireant.vn/api/Data/Markets/HistoricalQuotes?symbol=${item}&startDate=2012-1-1&endDate=${endDay}`;
    axios
      .get(url)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    // io.set('origins', '*:*')
    const socket = io('wss://www.fireant.vn/signalr/connect?transport=webSockets&clientProtocol=1.5&SessionID=ubjd4qzzvyjzmiisz0infqw3&connectionToken=65Io4MIjtEg35eA6eCpaoEuVEa%2Bq0dXWmCKk9iXItWBq5wv4%2Bx3nN87hxatafb2iwwRe9YEl5LeWdZQsqulAhWC%2FDtl%2FkVIcVB4FEynbjpTtMxsH%2BOkMOpSyrAdbOjjNMoeB%2BQ%3D%3D&connectionData=%5B%7B%22name%22%3A%22compressedappquotehub%22%7D%5D&tid=1')
    socket.on('connect', function (data) {
      console.log('connect', data)
    })
    socket.on('disconnect', function (data) {
      console.log('disconnect', data)
    })
    socket.on('event', function (data) {
      console.log('event', data)
    })

  }
}

export default Stock;
