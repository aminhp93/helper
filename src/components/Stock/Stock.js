import React, { Component } from "react";
import { Input } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import StockDetail from "../StockDetail";
import axios from "axios";
import CustomedPieChart from "./../_customedComponents/CustomedPieChart";
import Icon from "@material-ui/core/Icon";
import { mapStockData } from "./../../helpers/functionUtils";
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
import ReactDOM from "react-dom";
import CustomedToggleButtonGroup from "../_customedComponents/CustomedToggleButtonGroup";
import filterButtonsEnums from "../../constants/filterButtonsEnums";

function getModalStyle() {
  return {
    top: `5px`,
    left: `5px`
  };
}

const filterButtonsOptions = [
  {
    value: filterButtonsEnums.CANSLIM_STOCKS,
    display_value: "Canslim Stocks"
  },
  {
    value: filterButtonsEnums.QUICK_FILTER_STOCKS,
    display_value:
      "Quick filter(EPS > 3000, ROE > 17, VOLUME > 10000, ROI > 60)"
  },
  {
    value: filterButtonsEnums.WATCHING_STOCKS,
    display_value: "Watching Stocks"
  }
];

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
            const div = document.createElement("div");
            div.className = "symbolCellContainer";
            const container = document.createElement("div");
            const content = document.createElement("div");
            const detail = document.createElement("div");
            const deleteButton = document.createElement("div");

            container.className = "container";
            content.innerHTML = params.data.Symbol;
            content.className = "content";
            detail.className = "detail";
            ReactDOM.render(<Icon>info</Icon>, detail);
            detail.addEventListener("click", function () {
              that.openModal(params);
            });
            ReactDOM.render(<Icon>delete</Icon>, deleteButton);
            deleteButton.className = "deleteButton";
            deleteButton.addEventListener("click", function () {
              that.deleteSymbolWatchlist(params);
            });

            container.appendChild(content);
            container.appendChild(detail);
            div.appendChild(container);
            div.appendChild(deleteButton);

            return div;
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
      open: false,
      loading: true
    };

    this.toggleButton = filterButtonsEnums.QUICK_FILTER_STOCKS
  }

  canslimFilter() {
    let today_capitalization_min = 5000000000;
    let percentage_change_in_price_min = 0.01;
    axios
      .post(getFilteredStocksUrl(), {
        today_capitalization_min,
        percentage_change_in_price_min
      })
      .then(response => {
        console.log(response);
        this.gridApi.setRowData(response.data.stocks);
      })
      .catch(error => {
        console.log(error);
      });
  }

  startRealtimeSocket(dataStocks) {
    const that = this;
    const socket = new WebSocket(
      "wss://www.fireant.vn/signalr/connect?transport=webSockets&clientProtocol=1.5&SessionID=ubjd4qzzvyjzmiisz0infqw3&connectionToken=65Io4MIjtEg35eA6eCpaoEuVEa%2Bq0dXWmCKk9iXItWBq5wv4%2Bx3nN87hxatafb2iwwRe9YEl5LeWdZQsqulAhWC%2FDtl%2FkVIcVB4FEynbjpTtMxsH%2BOkMOpSyrAdbOjjNMoeB%2BQ%3D%3D&connectionData=%5B%7B%22name%22%3A%22compressedappquotehub%22%7D%5D&tid=1"
    );

    // Connection opened
    socket.addEventListener("open", function (event) {
      socket.send("Hello Server!");
    });

    // Listen for messages
    socket.addEventListener("message", function (event) {
      // console.log(event.data);

      let data = event.data;
      let M_0 = JSON.parse(data).M && JSON.parse(data).M[0];
      let A = M_0 && M_0.A && M_0.A[0];
      if (A && A.length) {
        for (let i = 0; i < A.length; i++) {
          let index = dataStocks.findIndex(item => item.Symbol === A[i].S);
          // console.log(index, dataStocks, A[i].S)
          if (index > -1) {
            let update = false;
            // console.log(A[i]);
            const obj = A[i];
            let old_Symbol = dataStocks[index].Symbol;
            let old_Volume = dataStocks[index].Volume;
            let old_Close = dataStocks[index].Close;
            let new_Volume = old_Volume;
            let new_Close = old_Close;
            if (obj.hasOwnProperty("TV")) {
              new_Volume = obj.TV;
              update = true;
            }
            if (obj.hasOwnProperty("P")) {
              new_Close = obj.P;
              update = true;
            }
            if (update) {
              // console.log(index);
              update = false;
              let dataUpdate = {};
              dataUpdate.id = dataStocks[index].id
              dataUpdate.Symbol = old_Symbol;
              dataUpdate.Volume = new_Volume;
              dataUpdate.Close = new_Close;
              dataUpdate.today_capitalization = new_Volume * new_Close;
              dataUpdate.percentage_change_in_price =
                (new_Close - dataStocks[index].yesterday_Close) /
                dataStocks[index].yesterday_Close;
              // Update in db
              axios
                .post(getUpdateStockUrl(dataStocks[index].id), dataUpdate)
                .then(response => {
                  // console.log(response);
                  if (!response.data.stock) return
                  if (that.toggleButton === filterButtonsEnums.CANSLIM_STOCKS) {
                    that.gridApi.setRowData(response.data.stocks);
                  } else {
                    let new_stock = response.data.stock;
                    // console.log(new_stock, that.gridApi, index)
                    that.gridApi.forEachNode(function (node) {
                      if (node.data.id === new_stock.id) {
                        // console.log(node.data);
                        node.setData({ ...node.data, new_stock });
                      }
                      return;
                    });
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
          }
        }
      }
    });
  }

  setQuickFilter() {
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
        this.gridApi.setRowData(response.data.stocks);
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleCbCustomedToggleButtonGroup(index) {
    this.toggleButton = index
    switch (index) {
      case filterButtonsEnums.QUICK_FILTER_STOCKS:
        this.setQuickFilter();
        break;
      case filterButtonsEnums.WATCHING_STOCKS:
        this.getWatchingStocks();
        break;
      case filterButtonsEnums.CANSLIM_STOCKS:
        this.canslimFilter();
        break;
      default:
        break;
    }
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
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  deleteSymbolWatchlist(params) {
    const url = deleteSymbolWatchlistUrl(params.data.Symbol);
    axios
      .delete(url)
      .then(response => {
        console.log(response);
        this.getWatchingStocks();
      })
      .catch(error => {
        console.log(error);
      });
  }

  searchSymbol(e) {
    let Symbol_search = (e.target.value + "").toUpperCase();
    axios
      .post(getFilteredStocksUrl(), {
        Symbol_search
      })
      .then(response => {
        console.log(response);
        this.gridApi.setRowData(response.data.stocks);
      })
      .catch(error => {
        console.log(error);
      });
  }

  onGridReadyCb(params) {
    this.gridApi = params.api;
  }

  render() {
    return (
      <div className="stock">
        Stock
        <div className="stockTable">
          <div className="ag-theme-balham customedAgGrid">
            <div className="header">
              <Input onChange={e => this.searchSymbol(e)} />
              <CustomedToggleButtonGroup
                options={filterButtonsOptions}
                cb={this.handleCbCustomedToggleButtonGroup.bind(this)}
              />
            </div>
            <CustomedAgGridReact
              title="stock"
              columnDefs={this.state.columnDefs}
              rowData={mapStockData(this.state.rowData)}
              onGridReady={this.onGridReadyCb.bind(this)}
            />
          </div>
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
    this.setState({ open: true, symbol: params.data.Symbol });
  }

  closeModal() {
    this.setState({ open: false });
  }

  getAllDatabase() {
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

  async componentDidMount() {
    await axios
      .post(getFilteredStocksUrl(), {})
      .then(response => {
        console.log(response);
        this.setState({
          loading: false
        });
        this.startRealtimeSocket(response.data.stocks);
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        console.log(error);
      });
    await this.canslimFilter();
  }
}

export default Stock;
