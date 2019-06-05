import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import Modal from "@material-ui/core/Modal";
import StockDetail from "../../StockDetail/StockDetail";
import Button from "@material-ui/core/Button";
import { Input } from "@material-ui/core";
import axios from "axios";
import {
  getFilteredStocksUrl,
  getWatchingStocksUrl,
  getUpdateStockUrl
} from "../../../helpers/requests";
import { RowNode } from "ag-grid-community";

function getModalStyle() {
  return {
    top: `5px`,
    left: `5px`
  };
}

class CustomedAgGridReact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
      enableCellChangeFlash: true
    };
  }

  async canslimFilter() {
    let today_capitalization_min = 5000000000;
    let percentage_change_in_price_min = 0.01;
    let allData = []
    await axios
      .post(getFilteredStocksUrl(), {})
      .then(response => {
        console.log(response);
        this.startRealtimeSocket(response.data.stocks);
      })
      .catch(error => {
        console.log(error);
      });

    await axios
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

  startRealtimeSocket(dataStocks, updateOnly) {
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
              dataUpdate.Symbol = old_Symbol;
              dataUpdate.Volume = new_Volume;
              dataUpdate.Close = new_Close;
              dataUpdate.today_capitalization = new_Volume * new_Close;
              dataUpdate.percentage_change_in_price =
                (new_Close - dataStocks[index].yesterday_Close) /
                dataStocks[index].yesterday_Close;
              // Update in db

              axios
                .post(getUpdateStockUrl(), dataUpdate)
                .then(response => {
                  // console.log(response);
                  if (!response.data.stock) return
                  if (updateOnly) {
                    let new_stock = response.data.stock
                    // console.log(new_stock, that.gridApi, index)
                    that.gridApi.forEachNode(function (node) {
                      if (node.data.id === new_stock.id) {
                        console.log(node.data)
                        node.setData({ ...node.data, new_stock })
                      }
                      return
                    })

                    // dataStocks[index] = { ...dataStocks[index], new_stock }
                    // that.gridApi.setData(dataStocks)
                  } else {
                    that.gridApi.setRowData(response.data.stocks);
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  renderQuickFilterButton() {
    switch (this.props.title) {
      case "stock":
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={this.setQuickFilter.bind(this)}
            >
              Quick filter(EPS > 3000, ROE > 17, VOLUME > 10000, ROI > 60)
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.getWatchingStocks.bind(this)}
            >
              Watching Stocks
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.canslimFilter.bind(this)}
            >
              Canslim filter
            </Button>
          </div>
        );
      default:
        return null;
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
        this.gridApi.setRowData(response.data.stocks);
        this.startRealtimeSocket(response.data.stocks, true)
      })
      .catch(error => {
        console.log(error);
      });

  }

  handleOnRowClicked = params => { };

  handleClose = () => { };

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

  render() {
    return (
      <div className="ag-theme-balham customedAgGrid">
        <div className="header">
          <Input onChange={e => this.searchSymbol(e)} />
          {this.renderQuickFilterButton()}
        </div>
        <div className="agGridReactRoot">
          <AgGridReact
            columnDefs={this.props.columnDefs}
            rowData={this.props.rowData}
            defaultColDef={this.defaultColDef}
            onGridReady={this.onGridReady.bind(this)}
            onRowClicked={this.handleOnRowClicked.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default CustomedAgGridReact;
