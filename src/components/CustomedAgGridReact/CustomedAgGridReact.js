import React from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class CustomedAgGridReact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.defaultColDef = {
            sortable: true
        }
    }

    render() {
        return <AgGridReact
            columnDefs={this.props.columnDefs}
            rowData={this.props.rowData}
            defaultColDef={this.defaultColDef}
        />
    }
}

export default CustomedAgGridReact