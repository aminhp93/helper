import React from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import {
  formatNumber,
  mapDataBusinessSummary,
  strcmp
} from "../../helpers/functionUtils";
import { getLastestFinancialReports } from "../../helpers/requests";
import Button from "@material-ui/core/Button";
import businessSummaryTypes from "../../constants/businessSummaryTypes";
import analysisTypes from "../../constants/analysisTypes";
import durationReportEnums from "../../constants/durationReportEnums";
import { Input } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
// import CustomHeader from "./CustomHeader";

export default class BusinessSummary extends React.Component {
  constructor(props) {
    super(props);

    // this.frameworkComponents = { agColumnHeader: CustomHeader };
    this.state = {
      period: durationReportEnums.YEAR
    };
    this.symbol = props.symbol;
    this.typeBusinessSummary =
      props.typeBusinessSummary || businessSummaryTypes.KET_QUA_KINH_DOANH;

    this.columnDefs_year = [
      {
        headerName: "Name",
        field: "Name",
        width: 200,
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.title = params.data.Name;
          div.innerHTML = params.data.Name;
          return div;
        }
      },
      {
        headerName: "2014",
        width: 120,
        cellRenderer: function(params) {
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
          div.classList.add("number");
          return div;
        }
      },
      {
        headerName: "2015",
        width: 120,
        cellRenderer: function(params) {
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
          div.classList.add("number");
          return div;
        }
      },
      {
        headerName: "2016",
        width: 120,
        cellRenderer: function(params) {
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
          div.classList.add("number");
          return div;
        }
      },
      {
        headerName: "2017",
        width: 120,
        cellRenderer: function(params) {
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
          div.classList.add("number");
          return div;
        }
      },
      {
        headerName: "2018",
        width: 120,
        cellRenderer: function(params) {
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
          div.classList.add("number");
          return div;
        }
      }
    ];

    this.columnDefs_analysis_1 = [
      {
        headerName: "2016-2015",
        field: "",
        cellRenderer: function(params) {
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
          div.classList.add("number");
          return div;
        }
      },
      {
        headerName: "2017-2016",
        field: "",
        cellRenderer: function(params) {
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
          div.classList.add("number");
          return div;
        }
      },
      {
        headerName: "2018-2017",
        field: "",
        cellRenderer: function(params) {
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
          div.classList.add("number");
          return div;
        }
      },
      {
        headerName: "2016/2015",
        field: "",
        cellRenderer: function(params) {
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
          div.classList.add("number");
          return div;
        }
      },
      {
        headerName: "2017/2016",
        field: "",
        cellRenderer: function(params) {
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
          div.classList.add("number");
          return div;
        }
      },
      {
        headerName: "2018/2017",
        field: "",
        cellRenderer: function(params) {
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
          div.classList.add("number");
          return div;
        }
      }
    ];

    this.columnDefs_analysis_2 = [
      {
        headerName: "2015",
        field: "",
        cellStyle: { "background-color": "gray" },
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.className = "";
          div.classList.add("number");
          if (params.data.ANALYSIS_2) {
            div.innerHTML =
              (params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 4] || {})
                .Value + "%";
          }
          return div;
        }
      },
      {
        headerName: "2016",
        field: "",
        cellStyle: { "background-color": "gray" },
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.className = "";
          div.classList.add("number");
          if (params.data.ANALYSIS_2) {
            div.innerHTML =
              (params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 3] || {})
                .Value + "%";
          }
          return div;
        }
      },
      {
        headerName: "2017",
        field: "",
        cellStyle: { "background-color": "gray" },
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.className = "";
          div.classList.add("number");
          if (params.data.ANALYSIS_2) {
            div.innerHTML =
              (params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 2] || {})
                .Value + "%";
          }
          return div;
        }
      },
      {
        headerName: "2018",
        field: "",
        cellStyle: { "background-color": "gray" },
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.className = "";
          div.classList.add("number");
          if (params.data.ANALYSIS_2) {
            div.innerHTML =
              (params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 1] || {})
                .Value + "%";
          }
          return div;
        }
      },
      {
        headerName: "2016-2015",
        field: "",
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.className = "";
          div.classList.add("number");
          if (params.data.ANALYSIS_2) {
            div.innerHTML =
              (
                (
                  params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 3] ||
                  {}
                ).Value -
                (
                  params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 4] ||
                  {}
                ).Value
              ).toFixed(2) + "%";
          }
          return div;
        }
      },
      {
        headerName: "2017-2016",
        field: "",
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.className = "";
          div.classList.add("number");
          if (params.data.ANALYSIS_2) {
            div.innerHTML =
              (
                (
                  params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 2] ||
                  {}
                ).Value -
                (
                  params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 3] ||
                  {}
                ).Value
              ).toFixed(2) + "%";
          }
          return div;
        }
      },
      {
        headerName: "2018-2017",
        field: "",
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.className = "";
          div.classList.add("number");
          if (params.data.ANALYSIS_2) {
            div.innerHTML =
              (
                (
                  params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 1] ||
                  {}
                ).Value -
                (
                  params.data.ANALYSIS_2[params.data.ANALYSIS_2.length - 2] ||
                  {}
                ).Value
              ).toFixed(2) + "%";
          }
          return div;
        }
      }
    ];

    this.columnDefs_analysis_3 = [
      {
        headerName: "2014",
        field: "",
        cellStyle: { "background-color": "gray" },
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.className =
            [301, 302, 30101].indexOf(params.data.ID) > -1 ? "highlight" : "";
          div.classList.add("number");
          if (params.data.ANALYSIS_3) {
            let value = (
              params.data.ANALYSIS_3[params.data.ANALYSIS_3.length - 5] || {}
            ).Value;
            if (typeof value === "undefined" || value === "0.00") return null;
            div.innerHTML = value + "%";
          }
          return div;
        }
      },
      {
        headerName: "2015",
        field: "",
        cellStyle: { "background-color": "gray" },
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.className =
            [301, 302, 30101].indexOf(params.data.ID) > -1 ? "highlight" : "";
          div.classList.add("number");
          if (params.data.ANALYSIS_3) {
            let value = (
              params.data.ANALYSIS_3[params.data.ANALYSIS_3.length - 4] || {}
            ).Value;
            if (typeof value === "undefined" || value === "0.00") return null;
            div.innerHTML = value + "%";
          }
          return div;
        }
      },
      {
        headerName: "2016",
        field: "",
        cellStyle: { "background-color": "gray" },
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.className =
            [301, 302, 30101].indexOf(params.data.ID) > -1 ? "highlight" : "";
          div.classList.add("number");
          if (params.data.ANALYSIS_3) {
            let value = (
              params.data.ANALYSIS_3[params.data.ANALYSIS_3.length - 3] || {}
            ).Value;
            if (typeof value === "undefined" || value === "0.00") return null;
            div.innerHTML = value + "%";
          }
          return div;
        }
      },
      {
        headerName: "2017",
        field: "",
        cellStyle: { "background-color": "gray" },
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.className =
            [301, 302, 30101].indexOf(params.data.ID) > -1 ? "highlight" : "";
          div.classList.add("number");
          if (params.data.ANALYSIS_3) {
            let value = (
              params.data.ANALYSIS_3[params.data.ANALYSIS_3.length - 2] || {}
            ).Value;
            if (typeof value === "undefined" || value === "0.00") return null;
            div.innerHTML = value + "%";
          }
          return div;
        }
      },
      {
        headerName: "2018",
        field: "",
        cellStyle: { "background-color": "gray" },
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.className =
            [301, 302, 30101].indexOf(params.data.ID) > -1 ? "highlight" : "";
          div.classList.add("number");
          if (params.data.ANALYSIS_3) {
            let value = (
              params.data.ANALYSIS_3[params.data.ANALYSIS_3.length - 1] || {}
            ).Value;
            if (typeof value === "undefined" || value === "0.00") return null;
            div.innerHTML = value + "%";
          }
          return div;
        }
      }
    ];
    this.columnDefs_analysis_4 = [
      {
        headerName: "Name",
        field: "Name",
        width: 200,
        cellRenderer: function(params) {
          const div = document.createElement("div");
          div.title = params.data.Name;
          div.innerHTML = params.data.Name;
          return div;
        }
      },
      {
        headerName: "2017",
        width: 120,
        cellRenderer: function(params) {
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
          div.className = "";
          div.classList.add("number");
          return div;
        }
      },
      {
        headerName: "2018",
        width: 120,
        cellRenderer: function(params) {
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
          div.className = "";
          div.classList.add("number");
          return div;
        }
      },
      {
        headerName: "Su dung von",
        field: "",
        pinnedRowCellRenderer: function(params) {
          console.log(params, 508);
          return "pinned";
        },
        cellRenderer: function(params) {
          if (
            [10102, 10105, 3010103, 3010111, 30102, 30201, 2, 4].indexOf(
              params.data.ID
            ) > -1
          )
            return null;
          const div = document.createElement("div");
          let value1 = (params.data.Values[params.data.Values.length - 1] || {})
            .Value;
          let value2 = (params.data.Values[params.data.Values.length - 2] || {})
            .Value;
          let value = value1 - value2;
          div.innerHTML = value
            ? formatNumber(value / Math.pow(10, 9), 1, true)
            : "";
          div.className = "";
          div.classList.add("number");
          return div;
        }
      },
      {
        headerName: "nguon von",
        field: "",
        cellRenderer: function(params) {
          if (
            [10101, 10103, 10104, 102, 3010101, 3010113, 30202, 2, 4].indexOf(
              params.data.ID
            ) > -1
          )
            return null;
          const div = document.createElement("div");
          let value1 = (params.data.Values[params.data.Values.length - 1] || {})
            .Value;
          let value2 = (params.data.Values[params.data.Values.length - 2] || {})
            .Value;
          let value = value2 - value1;
          div.innerHTML = value
            ? formatNumber(value / Math.pow(10, 9), 1, true)
            : "";
          div.className = "";
          div.classList.add("number");
          return div;
        }
      }
    ];

    this.columnDefs_quarter = this.getColumnDefs_quarter();

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
      comparator: function(valueA, valueB) {
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

  getColumnDefs_quarter() {
    let result = [
      {
        headerName: "Name",
        field: "Name",
        width: 200
      }
    ];
    let periods = ["Q1 2018", "Q2 2018", "Q3 2018", "Q4 2018", "Q1 2019"];
    for (let i = 0; i < periods.length; i++) {
      let item = {
        headerName: periods[i],
        field: "",
        width: 120,
        cellRenderer: function(params) {
          return (params.data.Values[i] || {}).Value
            ? formatNumber(
                (params.data.Values[i] || {}).Value / 1000000,
                1,
                true
              )
            : "";
        }
      };
      result.push(item);
    }
    return result;
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onRowClicked(row) {}

  renderAnalysisOptions() {
    switch (this.typeBusinessSummary) {
      case businessSummaryTypes.KET_QUA_KINH_DOANH:
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleAnalyse(analysisTypes.DEFAULT)}
            >
              Default
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleAnalyse(analysisTypes.ANALYSIS_1)}
            >
              ANALYSIS_1 - Chieu ngang
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleAnalyse(analysisTypes.ANALYSIS_2)}
            >
              ANALYSIS_2 - Chieu doc
            </Button>
          </div>
        );
      case businessSummaryTypes.CAN_DOI_KE_TOAN:
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleAnalyse(analysisTypes.DEFAULT)}
            >
              Default
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleAnalyse(analysisTypes.ANALYSIS_3)}
            >
              ANALYSIS_3
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleAnalyse(analysisTypes.ANALYSIS_4)}
            >
              ANALYSIS_4
            </Button>
          </div>
        );
      case businessSummaryTypes.LUU_CHUYEN_TIEN_TE_TRUC_TIEP:
        return null;
      case businessSummaryTypes.LUU_CHUYEN_TIEN_TE_GIAN_TIEP:
        return null;
      default:
        return null;
    }
  }

  handleAnalyse(index) {
    switch (index) {
      case analysisTypes.DEFAULT:
        this.gridApi.setColumnDefs(this.columnDefs_year);
        this.gridApi.setRowData(this.rootData);
        break;
      case analysisTypes.ANALYSIS_1:
        this.gridApi.setColumnDefs(
          this.columnDefs_year.concat(this.columnDefs_analysis_1)
        );
        break;
      case analysisTypes.ANALYSIS_2:
        this.gridApi.setColumnDefs(
          this.columnDefs_year.concat(this.columnDefs_analysis_2)
        );
        this.gridApi.setRowData(
          mapDataBusinessSummary(this.rootData, analysisTypes.ANALYSIS_2)
        );
        break;
      case analysisTypes.ANALYSIS_3:
        this.gridApi.setColumnDefs(
          this.columnDefs_year.concat(this.columnDefs_analysis_3)
        );
        this.gridApi.setRowData(
          mapDataBusinessSummary(this.rootData, analysisTypes.ANALYSIS_3)
        );
        break;
      case analysisTypes.ANALYSIS_4:
        this.gridApi.setColumnDefs(this.columnDefs_analysis_4);
        this.gridApi.setRowData(
          mapDataBusinessSummary(this.rootData, analysisTypes.ANALYSIS_4)
        );
        break;
      default:
        this.gridApi.setColumnDefs(this.columnDefs_year);
        break;
    }

    this.gridApi.sizeColumnsToFit();
  }

  handleChangePeriod(event, newPeriod) {
    if (!newPeriod) return;
    this.setState(
      {
        period: newPeriod
      },
      () => {
        this.getDataBusinessSummary();
      }
    );
  }

  render() {
    return (
      <div
        className="ag-theme-balham businessSummary"
        style={{
          height: "500px"
        }}
      >
        <div className="header">
          <Input
            onChange={e => {
              console.log(e.target.value);
              this.gridApi.setQuickFilter(e.target.value);
            }}
          />
          <ToggleButtonGroup
            value={this.state.period}
            exclusive
            onChange={this.handleChangePeriod.bind(this)}
          >
            <ToggleButton value={durationReportEnums.QUARTER}>
              Quarterly
            </ToggleButton>
            <ToggleButton value={durationReportEnums.YEAR}>Yearly</ToggleButton>
          </ToggleButtonGroup>
          {this.renderAnalysisOptions()}
        </div>
        <AgGridReact
          columnDefs={
            this.state.period === durationReportEnums.YEAR
              ? this.columnDefs_year
              : this.columnDefs_quarter
          }
          // frameworkComponents={this.frameworkComponents}
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

  getDataBusinessSummary() {
    if (!this.symbol) return;
    const url = getLastestFinancialReports(
      this.typeBusinessSummary,
      this.symbol,
      this.state.period === durationReportEnums.YEAR
        ? durationReportEnums.YEAR
        : durationReportEnums.QUARTER
    );
    axios
      .get(url)
      .then(response => {
        console.log(response);
        this.rootData = response.data;
        this.gridApi.setRowData(
          mapDataBusinessSummary(this.rootData, analysisTypes.ANALYSIS_1)
        );
        this.gridApi.setColumnDefs(
          this.state.period === durationReportEnums.YEAR
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
    this.getDataBusinessSummary();
  }
}
