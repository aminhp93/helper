import React from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import {
  mapDataBusinessSummary,
  getColumnDefs_quarter,
  getColumnDefs_year,
  getColumnDefs_analysis_1,
  getColumnDefs_analysis_2,
  getColumnDefs_analysis_3,
  getColumnDefs_analysis_4
} from "../../helpers/functionUtils";
import { getLastestFinancialReports } from "../../helpers/requests";
import businessSummaryTypes from "../../constants/businessSummaryTypes";
import analysisTypes from "../../constants/analysisTypes";
import durationReportEnums from "../../constants/durationReportEnums";
import { Input } from "@material-ui/core";
import CustomedToggleButtonGroup from "../_customedComponents/CustomedToggleButtonGroup";
import { InputNumber } from "antd";

const ketQuaKinhDoanhOptions = [
  {
    value: analysisTypes.DEFAULT,
    display_value: "Default"
  },
  {
    value: analysisTypes.ANALYSIS_1,
    display_value: "ANALYSIS_1 - Muc tang giam"
  },
  {
    value: analysisTypes.ANALYSIS_2,
    display_value: "ANALYSIS_2 - % tang giam"
  }
];

const canDoiKeToanOptions = [
  {
    value: analysisTypes.DEFAULT,
    display_value: "Default"
  },
  {
    value: analysisTypes.ANALYSIS_3,
    display_value: "ANALYSIS_3"
  },
  {
    value: analysisTypes.ANALYSIS_4,
    display_value: "ANALYSIS_4"
  }
];

const periodOptions = [
  {
    value: durationReportEnums.YEAR,
    display_value: "Yearly"
  },
  {
    value: durationReportEnums.QUARTER,
    display_value: "Quarterly"
  }
];

export default class BusinessSummary extends React.Component {
  constructor(props) {
    super(props);
    this.period = durationReportEnums.YEAR;
    this.analysis = analysisTypes.DEFAULT;
    this.symbol = props.symbol;
    this.typeBusinessSummary =
      props.typeBusinessSummary || businessSummaryTypes.KET_QUA_KINH_DOANH;

    this.columnDefs_year = getColumnDefs_year();
    this.columnDefs_analysis_1 = getColumnDefs_analysis_1();
    this.columnDefs_analysis_2 = getColumnDefs_analysis_2();
    this.columnDefs_analysis_3 = getColumnDefs_analysis_3();
    this.columnDefs_analysis_4 = getColumnDefs_analysis_4();
    this.columnDefs_quarter = getColumnDefs_quarter(5);

    this.defaultColDef = {
      width: 120,
      editable: true,
      sortable: true,
      filter: true,
      resizable: true
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onRowClicked(row) {}

  renderAnalysisOptions() {
    switch (this.typeBusinessSummary) {
      case businessSummaryTypes.KET_QUA_KINH_DOANH:
        return (
          <CustomedToggleButtonGroup
            options={ketQuaKinhDoanhOptions}
            cb={this.handleCbCustomedToggleButtonGroup.bind(this)}
          />
        );
      case businessSummaryTypes.CAN_DOI_KE_TOAN:
        return (
          <CustomedToggleButtonGroup
            options={canDoiKeToanOptions}
            cb={this.handleCbCustomedToggleButtonGroup.bind(this)}
          />
        );
      case businessSummaryTypes.LUU_CHUYEN_TIEN_TE_TRUC_TIEP:
        return null;
      case businessSummaryTypes.LUU_CHUYEN_TIEN_TE_GIAN_TIEP:
        return null;
      default:
        return null;
    }
  }

  handleCbCustomedToggleButtonGroup(index) {
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
      case durationReportEnums.YEAR:
      case durationReportEnums.QUARTER:
        this.period = index;
        this.getDataBusinessSummary();
        break;
      default:
        break;
    }
    this.gridApi.sizeColumnsToFit();
  }

  handleChangeNumberOfQuarter = number => {
    if (!number) return;
    if (this.period === durationReportEnums.QUARTER) {
      this.getDataBusinessSummary(number);
    }
  };

  render() {
    return (
      <div className="ag-theme-balham businessSummary">
        <div className="header">
          <Input onChange={e => this.gridApi.setQuickFilter(e.target.value)} />
          <CustomedToggleButtonGroup
            options={periodOptions}
            cb={this.handleCbCustomedToggleButtonGroup.bind(this)}
          />
          <InputNumber
            min={0}
            max={10}
            defaultValue={5}
            onChange={this.handleChangeNumberOfQuarter}
          />
          {this.renderAnalysisOptions()}
        </div>
        <AgGridReact
          defaultColDef={this.defaultColDef}
          onGridReady={this.onGridReady.bind(this)}
          onRowClicked={this.onRowClicked.bind(this)}
          suppressDragLeaveHidesColumns={true}
        />
      </div>
    );
  }

  getDataBusinessSummary(countQuarter) {
    if (!this.symbol) return;
    const url = getLastestFinancialReports(
      this.typeBusinessSummary,
      this.symbol,
      this.period === durationReportEnums.YEAR
        ? durationReportEnums.YEAR
        : durationReportEnums.QUARTER,
      countQuarter
    );
    axios
      .get(url)
      .then(response => {
        // console.log(response);
        this.rootData = response.data;
        this.gridApi.setRowData(
          mapDataBusinessSummary(this.rootData, analysisTypes.ANALYSIS_1)
        );
        this.gridApi.setColumnDefs(
          this.period === durationReportEnums.YEAR
            ? getColumnDefs_year(this.rootData)
            : getColumnDefs_quarter(this.rootData)
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
