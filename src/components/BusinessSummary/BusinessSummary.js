import React from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import {
  formatNumber,
  mapDataBusinessSummary,
  strcmp
} from "../../helpers/functionUtils";
import { getLastestFinancialReports } from '../../helpers/requests';
import Button from "@material-ui/core/Button";
import businessSummaryTypes from '../../constants/businessSummaryTypes'
import analysisTypes from '../../constants/analysisTypes'
import durationReportEnums from '../../constants/durationReportEnums'

export default class BusinessSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: props.symbol || "FPT"
    };
    this.durationReport = props.durationReport || durationReportEnums.YEAR;
    this.typeBusinessSummary = props.typeBusinessSummary || businessSummaryTypes.KET_QUA_KINH_DOANH;

    this.columnDefs_year = [
      {
        headerName: "Name",
        field: "Name",
        width: 200,
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.title = params.data.Name;
          div.innerHTML = params.data.Name;
          return div;
        }
      },
      {
        headerName: "2014",
        width: 120,
        cellRenderer: function (params) {
          const div = document.createElement("div");
          let value = (params.data.Values[params.data.Values.length - 5] || {})
            .Value
            ? formatNumber(
              (params.data.Values[params.data.Values.length - 5] || {})
                .Value / Math.pow(10, 9),
              1,
              true
            )
            : "";
          div.innerHTML = value;
          div.className = "";
          div.classList.add('number')
          return div
        }
      },
      {
        headerName: "2015",
        width: 120,
        cellRenderer: function (params) {
          const div = document.createElement("div");
          let value = (params.data.Values[params.data.Values.length - 4] || {})
            .Value
            ? formatNumber(
              (params.data.Values[params.data.Values.length - 4] || {})
                .Value / Math.pow(10, 9),
              1,
              true
            )
            : "";
          div.innerHTML = value;
          div.className = "";
          div.classList.add('number')
          return div;
        }
      },
      {
        headerName: "2016",
        width: 120,
        cellRenderer: function (params) {
          const div = document.createElement("div");
          let value = (params.data.Values[params.data.Values.length - 3] || {})
            .Value
            ? formatNumber(
              (params.data.Values[params.data.Values.length - 3] || {})
                .Value / Math.pow(10, 9),
              1,
              true
            )
            : "";
          div.innerHTML = value;
          div.className = "";
          div.classList.add('number')
          return div;
        }
      },
      {
        headerName: "2017",
        width: 120,
        cellRenderer: function (params) {
          const div = document.createElement("div");
          let value = (params.data.Values[params.data.Values.length - 2] || {})
            .Value
            ? formatNumber(
              (params.data.Values[params.data.Values.length - 2] || {})
                .Value / Math.pow(10, 9),
              1,
              true
            )
            : "";
          div.innerHTML = value;
          div.className =
            [5, 15, 110].indexOf(params.data.ID) > -1 ? "highlight" : "";
          div.classList.add('number')
          return div;
        }
      },
      {
        headerName: "2018",
        width: 120,
        cellRenderer: function (params) {
          const div = document.createElement("div");
          let value = (params.data.Values[params.data.Values.length - 1] || {})
            .Value
            ? formatNumber(
              (params.data.Values[params.data.Values.length - 1] || {})
                .Value / Math.pow(10, 9),
              1,
              true
            )
            : "";
          div.innerHTML = value;
          div.className =
            [5, 15, 110].indexOf(params.data.ID) > -1 ? "highlight" : "";
          div.classList.add('number')
          return div;
        }
      }
    ];

    this.columnDefs_analysis_1 = [
      {
        headerName: "2016-2015",
        field: "",
        cellRenderer: function (params) {
          let value_2016 = (
            params.data.Values[params.data.Values.length - 3] || {}
          ).Value;

          let value_2015 = (
            params.data.Values[params.data.Values.length - 4] || {}
          ).Value;
          const div = document.createElement("div");
          div.innerHTML = formatNumber(
            (value_2016 - value_2015) / Math.pow(10, 9),
            1,
            true
          );
          div.className = "";
          div.classList.add('number')
          return div;
        }
      },
      {
        headerName: "2017-2016",
        field: "",
        cellRenderer: function (params) {
          let value_2017 = (
            params.data.Values[params.data.Values.length - 2] || {}
          ).Value;

          let value_2016 = (
            params.data.Values[params.data.Values.length - 3] || {}
          ).Value;
          const div = document.createElement("div");
          div.innerHTML = formatNumber(
            (value_2017 - value_2016) / Math.pow(10, 9),
            1,
            true
          );
          div.className =
            [1, 5].indexOf(params.data.ID) > -1 ? "highlight" : "";
          div.classList.add('number')
          return div;
        }
      },
      {
        headerName: "2018-2017",
        field: "",
        cellRenderer: function (params) {
          let value_2018 = (
            params.data.Values[params.data.Values.length - 1] || {}
          ).Value;

          let value_2017 = (
            params.data.Values[params.data.Values.length - 2] || {}
          ).Value;
          const div = document.createElement("div");
          div.innerHTML = formatNumber(
            (value_2018 - value_2017) / Math.pow(10, 9),
            1,
            true
          );
          div.className =
            [1, 5, 110, 15].indexOf(params.data.ID) > -1 ? "highlight" : "";
          div.classList.add('number')
          return div;
        }
      },
      {
        headerName: "2016/2015",
        field: "",
        cellRenderer: function (params) {
          let value_2016 = (
            params.data.Values[params.data.Values.length - 3] || {}
          ).Value;

          let value_2015 = (
            params.data.Values[params.data.Values.length - 4] || {}
          ).Value;
          const div = document.createElement("div");
          let value = ((value_2016 / value_2015 - 1) * 100).toFixed(2) + "%";
          div.innerHTML = value;
          div.className =
            params.data.ID === 1 || params.data.ID === 5 ? "highlight" : "";
          div.classList.add('number')
          return div;
        }
      },
      {
        headerName: "2017/2016",
        field: "",
        cellRenderer: function (params) {
          let value_2017 = (
            params.data.Values[params.data.Values.length - 2] || {}
          ).Value;

          let value_2016 = (
            params.data.Values[params.data.Values.length - 3] || {}
          ).Value;
          const div = document.createElement("div");
          let value = ((value_2017 / value_2016 - 1) * 100).toFixed(2) + "%";
          div.innerHTML = value;
          div.className =
            [1, 5].indexOf(params.data.ID) > -1 ? "highlight" : "";
          div.classList.add('number')
          return div;
        }
      },
      {
        headerName: "2018/2017",
        field: "",
        cellRenderer: function (params) {
          let value_2018 = (
            params.data.Values[params.data.Values.length - 1] || {}
          ).Value;

          let value_2017 = (
            params.data.Values[params.data.Values.length - 2] || {}
          ).Value;
          const div = document.createElement("div");
          let value = ((value_2018 / value_2017 - 1) * 100).toFixed(2) + "%";
          div.innerHTML = value;
          div.className =
            params.data.ID === 1 || params.data.ID === 5 ? "highlight" : "";
          div.classList.add('number')
          return div;
        }
      }
    ]

    this.columnDefs_analysis_2 = [
      {
        headerName: "2015",
        field: "",
        cellStyle: { 'background-color': 'gray' },
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.className = ''
          div.classList.add('number')
          if (params.data.ANALYSIS_2) {
            div.innerHTML = (params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 4] || {}).Value + '%'
          }
          return div
        }
      },
      {
        headerName: "2016",
        field: "",
        cellStyle: { 'background-color': 'gray' },
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.className = ''
          div.classList.add('number')
          if (params.data.ANALYSIS_2) {
            div.innerHTML = (params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 3] || {}).Value + '%'
          }
          return div
        }
      },
      {
        headerName: "2017",
        field: "",
        cellStyle: { 'background-color': 'gray' },
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.className = ''
          div.classList.add('number')
          if (params.data.ANALYSIS_2) {
            div.innerHTML = (params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 2] || {}).Value + '%'
          }
          return div
        }
      },
      {
        headerName: "2018",
        field: "",
        cellStyle: { 'background-color': 'gray' },
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.className = ''
          div.classList.add('number')
          if (params.data.ANALYSIS_2) {
            div.innerHTML = (params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 1] || {}).Value + '%'
          }
          return div
        }
      },
      {
        headerName: "2016-2015",
        field: "",
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.className = ''
          div.classList.add('number')
          if (params.data.ANALYSIS_2) {
            div.innerHTML = ((params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 3] || {}).Value - (params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 4] || {}).Value).toFixed(2) + '%'
          }
          return div
        }
      },
      {
        headerName: "2017-2016",
        field: "",
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.className = ''
          div.classList.add('number')
          if (params.data.ANALYSIS_2) {
            div.innerHTML = ((params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 2] || {}).Value - (params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 3] || {}).Value).toFixed(2) + '%'
          }
          return div
        }
      },
      {
        headerName: "2018-2017",
        field: "",
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.className = ''
          div.classList.add('number')
          if (params.data.ANALYSIS_2) {
            div.innerHTML = ((params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 1] || {}).Value - (params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 2] || {}).Value).toFixed(2) + '%'
          }
          return div
        }
      }
    ]

    this.columnDefs_analysis_3 = [
      {
        headerName: '2014',
        field: '',
        cellStyle: { 'background-color': 'gray' },
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.className = ''
          div.classList.add('number')
          if (params.data.ANALYSIS_3) {
            let value = (params.data.ANALYSIS_3[params.data.ANALYSIS_3.length - 5] || {}).Value
            if (typeof value === 'undefined' || value === '0.00') return null
            div.innerHTML = value + '%'
          }
          return div
        }
      },
      {
        headerName: '2015',
        field: '',
        cellStyle: { 'background-color': 'gray' },
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.className = ''
          div.classList.add('number')
          if (params.data.ANALYSIS_3) {
            let value = (params.data.ANALYSIS_3[params.data.ANALYSIS_3.length - 4] || {}).Value
            if (typeof value === 'undefined' || value === '0.00') return null
            div.innerHTML = value + '%'
          }
          return div
        }
      },
      {
        headerName: '2016',
        field: '',
        cellStyle: { 'background-color': 'gray' },
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.className = ''
          div.classList.add('number')
          if (params.data.ANALYSIS_3) {
            let value = (params.data.ANALYSIS_3[params.data.ANALYSIS_3.length - 3] || {}).Value
            if (typeof value === 'undefined' || value === '0.00') return null
            div.innerHTML = value + '%'
          }
          return div
        }
      },
      {
        headerName: '2017',
        field: '',
        cellStyle: { 'background-color': 'gray' },
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.className = ''
          div.classList.add('number')
          if (params.data.ANALYSIS_3) {
            let value = (params.data.ANALYSIS_3[params.data.ANALYSIS_3.length - 2] || {}).Value
            if (typeof value === 'undefined' || value === '0.00') return null
            div.innerHTML = value + '%'
          }
          return div
        }
      },
      {
        headerName: '2018',
        field: '',
        cellStyle: { 'background-color': 'gray' },
        cellRenderer: function (params) {
          const div = document.createElement("div");
          div.className = ''
          div.classList.add('number')
          if (params.data.ANALYSIS_3) {
            let value = (params.data.ANALYSIS_3[params.data.ANALYSIS_3.length - 1] || {}).Value
            if (typeof value === 'undefined' || value === '0.00') return null
            div.innerHTML = value + '%'
          }
          return div
        }
      },
    ]

    this.columnDefs_quarter = [
      {
        headerName: "Name",
        field: "Name",
        width: 200
      },
      {
        headerName: "Q2 2017",
        field: "Q2 2017",
        width: 120,
        cellRenderer: function (params) {
          return (params.data.Values[0] || {}).Value
            ? formatNumber(
              (params.data.Values[0] || {}).Value / 1000000,
              1,
              true
            )
            : "";
        }
      },
      {
        headerName: "Q3 2017",
        field: "Q3 2017",
        width: 120,
        cellRenderer: function (params) {
          return (params.data.Values[1] || {}).Value
            ? formatNumber(
              (params.data.Values[1] || {}).Value / 1000000,
              1,
              true
            )
            : "";
        }
      },
      {
        headerName: "Q4 2017",
        field: "Q4 2017",
        width: 120,
        cellRenderer: function (params) {
          return (params.data.Values[2] || {}).Value
            ? formatNumber(
              (params.data.Values[2] || {}).Value / 1000000,
              1,
              true
            )
            : "";
        }
      },
      {
        headerName: "Q1 2018",
        field: "Q1 2018",
        width: 120,
        cellRenderer: function (params) {
          return (params.data.Values[3] || {}).Value
            ? formatNumber(
              (params.data.Values[3] || {}).Value / 1000000,
              1,
              true
            )
            : "";
        }
      },
      {
        headerName: "Q2 2018",
        field: "Q2 2018",
        width: 120,
        cellRenderer: function (params) {
          return (params.data.Values[4] || {}).Value
            ? formatNumber(
              (params.data.Values[4] || {}).Value / 1000000,
              0,
              true
            )
            : "";
        }
      }
    ];

    this.defaultColDef = {
      width: 120,
      editable: true,
      sortable: true,
      filter: true,
      resizable: true
    };

    this.autoGroupColumnDef = {
      headerName: " CUSTOM! ",
      cellRendererParams: {
        suppressCount: true,
        checkbox: true
      },
      comparator: function (valueA, valueB) {
        if (valueA == null || valueB == null) return valueA - valueB;
        if (!valueA.substring || !valueB.substring) return valueA - valueB;
        if (valueA.length < 1 || valueB.length < 1) return valueA - valueB;
        return strcmp(
          valueA.substring(1, valueA.length),
          valueB.substring(1, valueB.length)
        );
      }
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onRowClicked(row) { }

  renderAnalysisOptions() {
    switch (this.typeBusinessSummary) {
      case businessSummaryTypes.KET_QUA_KINH_DOANH:
        return <div>
          <Button variant="contained" color="primary" onClick={() => this.handleAnalyse(analysisTypes.DEFAULT)}>Default</Button>
          <Button variant="contained" color="primary" onClick={() => this.handleAnalyse(analysisTypes.ANALYSIS_1)}>Chieu ngang</Button>
          <Button variant="contained" color="primary" onClick={() => this.handleAnalyse(analysisTypes.ANALYSIS_2)}>Chieu doc</Button>
        </div>
      case businessSummaryTypes.CAN_DOI_KE_TOAN:
        return <div>
          <Button variant="contained" color="primary" onClick={() => this.handleAnalyse(analysisTypes.DEFAULT)}>Default</Button>
          <Button variant="contained" color="primary" onClick={() => this.handleAnalyse(analysisTypes.ANALYSIS_3)}>phan tich 1</Button>
        </div>
      case businessSummaryTypes.LUU_CHUYEN_TIEN_TE_TRUC_TIEP:
        return null
      case businessSummaryTypes.LUU_CHUYEN_TIEN_TE_GIAN_TIEP:
        return null
      default:
        return null
    }
  }

  handleAnalyse(index) {
    switch (index) {
      case analysisTypes.DEFAULT:
        this.gridApi.setColumnDefs(this.columnDefs_year)
        break;
      case analysisTypes.ANALYSIS_1:
        this.gridApi.setColumnDefs(this.columnDefs_year.concat(this.columnDefs_analysis_1))
        break;
      case analysisTypes.ANALYSIS_2:
        this.gridApi.setColumnDefs(this.columnDefs_year.concat(this.columnDefs_analysis_2))
        this.gridApi.setRowData(mapDataBusinessSummary(this.rootData, this.typeBusinessSummary, analysisTypes.ANALYSIS_2))
        break;
      case analysisTypes.ANALYSIS_3:
        this.gridApi.setColumnDefs(this.columnDefs_year.concat(this.columnDefs_analysis_3))
        this.gridApi.setRowData(mapDataBusinessSummary(this.rootData, this.typeBusinessSummary, analysisTypes.ANALYSIS_3))
        break;
      default:
        this.gridApi.setColumnDefs(this.columnDefs_year);
        break;
    }

    this.gridApi.sizeColumnsToFit()
  }

  render() {
    return (
      <div
        className="ag-theme-balham businessSummary"
        style={{
          height: "500px"
        }}
      >
        {this.renderAnalysisOptions()}
        <AgGridReact
          columnDefs={
            this.durationReport === durationReportEnums.YEAR
              ? this.columnDefs_year
              : this.columnDefs_quarter
          }
          defaultColDef={this.defaultColDef}
          onGridReady={this.onGridReady.bind(this)}
          enableSorting={true}
          onRowClicked={this.onRowClicked.bind(this)}
          enableFilter={true}
          autoGroupColumnDef={this.autoGroupColumnDef}
          suppressDragLeaveHidesColumns={true}
        />
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.symbol && nextProps.symbol !== this.state.symbol) ||
      (nextProps.durationReport &&
        nextProps.durationReport !== this.durationReport) ||
      (nextProps.typeBusinessSummary &&
        nextProps.typeBusinessSummary !== this.typeBusinessSummary)
    ) {
      if (
        nextProps.typeBusinessSummary &&
        nextProps.typeBusinessSummary !== this.typeBusinessSummary
      ) {
        this.typeBusinessSummary = nextProps.typeBusinessSummary;
      }

      if (
        nextProps.durationReport &&
        nextProps.durationReport !== this.durationReport
      ) {
        this.durationReport = nextProps.durationReport;
      }
      if (
        nextProps.durationReport &&
        nextProps.durationReport === durationReportEnums.YEAR
      ) {
        this.getDataBusinessSummary(nextProps.symbol, durationReportEnums.YEAR);
      } else {
        this.getDataBusinessSummary(
          nextProps.symbol,
          durationReportEnums.QUARTER
        );
      }
    }
  }

  getDataBusinessSummary(symbol, index) {
    const url = getLastestFinancialReports(
      this.typeBusinessSummary,
      symbol,
      index === durationReportEnums.YEAR
        ? durationReportEnums.YEAR
        : durationReportEnums.QUARTER
    );
    axios
      .get(url)
      .then(response => {
        console.log(response);
        this.rootData = response.data
        this.gridApi.setRowData(
          mapDataBusinessSummary(this.rootData, this.typeBusinessSummary, analysisTypes.ANALYSIS_1)
        );
        this.gridApi.setColumnDefs(
          index === durationReportEnums.YEAR
            ? this.columnDefs_year
            : this.columnDefs_quarter
        );
        this.gridApi.sizeColumnsToFit();
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    if (!this.state.symbol) return;
    this.getDataBusinessSummary(this.state.symbol, this.durationReport);
  }
}
