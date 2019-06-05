import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

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

  handleOnRowClicked = params => { };

  onGridReady(params) {
    this.props.onGridReady(params);
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  render() {
    return (
      <div className="agGridReactRoot">
        <AgGridReact
          columnDefs={this.props.columnDefs}
          rowData={this.props.rowData}
          defaultColDef={this.defaultColDef}
          onGridReady={this.onGridReady.bind(this)}
          onRowClicked={this.handleOnRowClicked.bind(this)}
        />
      </div>
    );
  }
}

export default CustomedAgGridReact;
