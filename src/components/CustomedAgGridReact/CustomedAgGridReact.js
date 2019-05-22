import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

class CustomedAgGridReact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.defaultColDef = {
      sortable: true,
      filter: true
    };
  }

  setQuickFilter() {
    const hardCodedFilter = {
      EPS: {
        type: "greaterThan",
        filter: "3000"
      },
      ROE: {
        type: "greaterThan",
        filter: "17"
      },
      volume: {
        type: "greaterThan",
        filter: "10000"
      }
    };
    this.gridApi.setFilterModel(hardCodedFilter);
    this.gridApi.onFilterChanged();
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  renderQuickFilterButton() {
    switch (this.props.title) {
      case "stock":
        return (
          <div onClick={this.setQuickFilter.bind(this)}>
            QuickFilter EPS > 3000, ROE > 17, Volume > 10000
          </div>
        );

      default:
        return null;
    }
  }

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{
          height: "500px"
        }}
      >
        {this.renderQuickFilterButton()}
        <AgGridReact
          columnDefs={this.props.columnDefs}
          rowData={this.props.rowData}
          defaultColDef={this.defaultColDef}
          onGridReady={this.onGridReady.bind(this)}
        />
      </div>
    );
  }
}

export default CustomedAgGridReact;
