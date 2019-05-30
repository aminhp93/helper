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
  getWatchingStocksUrl
} from "../../../helpers/requests";

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
      resizable: true
    };
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
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleOnRowClicked = params => {
    this.setState({ open: true, symbol: params.data.Symbol });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div className="ag-theme-balham customedAgGrid">
        <div className="header">
          <Input
            onChange={e => {
              console.log(e.target.value);
              this.gridApi.setQuickFilter(e.target.value);
            }}
          />
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

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()}>
            <StockDetail symbol={this.state.symbol} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default CustomedAgGridReact;
