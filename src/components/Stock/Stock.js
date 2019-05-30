import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import StockDetail from "../StockDetail";
import { RowNode } from "ag-grid-community";

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
  getUpdateStockUrl,
  getFilteredStocksUrl,
  deleteSymbolWatchlistUrl,
  getWatchingStocksUrl
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

function getModalStyle() {
  return {
    top: `5px`,
    left: `5px`
  };
}

class Stock extends Component {
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      columnDefs: [
        {
          headerName: "Symbol",
          field: "Symbol",
          cellRenderer: function (params) {
            const div = document.createElement('div')
            div.className = 'symbolCellContainer'
            const content = document.createElement('div')
            const detail = document.createElement('div')
            const deleteButton = document.createElement('div')
            content.innerHTML = params.data.Symbol
            detail.innerHTML = 'detail'
            detail.addEventListener('click', function () {
              that.openModal(params)
            })
            deleteButton.innerHTML = 'delete'
            deleteButton.addEventListener('click', function () {
              console.log('delete')
              that.deleteSymbolWatchlist(params)
            })
            div.appendChild(content)
            div.appendChild(detail)
            div.appendChild(deleteButton)

            return div
          }
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
      rowData: [],
      open: false
    };
  }

  async getWatchingStocks() {
    let watching_stocks;
    await axios
      .get(getWatchingStocksUrl())
      .then(response => {
        console.log(response);
        let index = response.data.findIndex(
          item => item.id === "5cea9628838fae3176909129"
        );
        if (index > -1) {
          watching_stocks = response.data[index].symbols;
        }
      })
      .catch(error => {
        console.log(error);
      });
    if (!watching_stocks) return;
    await axios
      .post(getFilteredStocksUrl(), { watching_stocks })
      .then(response => {
        console.log(response);
        this.setState({
          rowData: response.data.stocks
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  deleteSymbolWatchlist(params) {
    const url = deleteSymbolWatchlistUrl(params.data.Symbol)
    axios.delete(url)
      .then(response => {
        console.log(response)
        this.getWatchingStocks()
      })
      .catch(error => {
        console.log(error)
      })
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
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.closeModal.bind(this)}
        >
          <div style={getModalStyle()}>
            <StockDetail symbol={this.state.symbol} />
          </div>
        </Modal>
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

  openModal(params) {
    console.log(params)
    this.setState({ open: true, symbol: params.data.Symbol });
  }

  closeModal() {
    this.setState({ open: false });
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
            this.setState({
              rowData: response.data.stocks,
              loading: false
            });
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
    const that = this
    let Volume_min = 10000;
    let RSI_14_max = 70;
    let RSI_14_min = 60;
    let RSI_14_diff_min = 0;
    let ROE_min = 17;
    let EPS_min = 3000;
    // axios
    //   .post(getFilteredStocksUrl(), {
    //     Volume_min,
    //     RSI_14_max,
    //     RSI_14_min,
    //     RSI_14_diff_min,
    //     ROE_min,
    //     EPS_min
    //   })
    //   .then(response => {
    //     console.log(response);
    //     this.setState({
    //       rowData: response.data.stocks
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    // const endDay = moment()
    //   .subtract(1, "days")
    //   .format("YYYY-MM-DD");
    // let item = "VJC";
    // let url = `https://svr1.fireant.vn/api/Data/Markets/HistoricalQuotes?symbol=${item}&startDate=2012-1-1&endDate=${endDay}`;
    // axios
    //   .get(url)
    //   .then(response => {
    //     console.log(response);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    let watching_stocks = ['D2D']
    axios
      .post(getFilteredStocksUrl(), { watching_stocks })
      .then(response => {
        console.log(response);
        this.setState({
          rowData: response.data.stocks
        })
      })
      .catch(error => {
        console.log(error);
      });


  }
}

export default Stock;
