import React, { Component } from "react";
import axios from "axios";
import Input from "@material-ui/core/Input";
import CustomedAgGridReact from "../_customedComponents/CustomedAgGridReact";
import CustomedPieChart from "./../_customedComponents/CustomedPieChart";
import {
  getCustomedPieChartData,
  getAverageSalary
} from "./../../helpers/functionUtils";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
const data = [
  {
    name: "Page A",
    value: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
];

class JobMarket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customedPieChartData: [],
      averageSalaryData: [],
      columnDefs: [
        {
          headerName: "Company",
          field: "",
          cellRenderer: function(params) {
            return (
              params.rowIndex +
              " - " +
              params.data.company +
              params.data.companyId
            );
          }
        },
        {
          headerName: "Job Title",
          field: "jobTitle"
        },
        {
          headerName: "Location",
          field: "locationIds",
          cellRenderer: function(params) {
            if (params.data.locationIds && params.data.locationIds.length) {
              return (
                params.data.locationIds[0] + " - " + params.data.locations[0]
              );
            }
          }
        },
        {
          headerName: "Job Salary",
          field: "jobSalary"
        },
        {
          headerName: "Salary Max",
          field: "salaryMax"
        },
        {
          headerName: "Salary Min",
          field: "salaryMin"
        },
        {
          headerName: "Time Published",
          field: "timestamp",
          cellRenderer: function(params) {
            const time = params.data.timestamp;
            const year = time.slice(0, 4);
            const month = time.slice(4, 6);
            const day = time.slice(6, 8);
            return `${day}/${month}/${year}`;
          }
        }
      ],
      rowData: []
    };
  }

  handleOnChangeQuerySearch(e) {
    const searchText = e.target.value;
    if (!searchText) return;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.search(searchText);
    }, 300);
  }

  render() {
    return (
      <div className="jobMarket">
        JobMarket
        <Input
          value={this.state.querySearch}
          onChange={e => this.handleOnChangeQuerySearch(e)}
        />
        Add chart to see the movement(compared to 1 month ago) and weight of job
        market
        <div>
          <CustomedAgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
          />
        </div>
        <div className="analysisContainer">
          <div>
            <CustomedPieChart data={this.state.customedPieChartData} />
          </div>
          <div>
            <BarChart
              width={500}
              height={300}
              data={this.state.averageSalaryData}
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
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </div>
    );
  }

  search(querySearch) {
    let hitsPerPage = "1000";
    let indexName = "vnw_job_v2";
    let maxValuesPerFacet = "20";
    let page = "0";
    let query = querySearch || "";
    let data = `{"requests":[{"indexName":"${indexName}","params":"query=${query}&hitsPerPage=${hitsPerPage}&maxValuesPerFacet=${maxValuesPerFacet}&page=${page}&restrictSearchableAttributes=%5B%22jobTitle%22%2C%22skills%22%2C%22company%22%5D&facets=%5B%22categoryIds%22%2C%22locationIds%22%2C%22categories%22%2C%22locations%22%2C%22skills%22%2C%22jobLevel%22%2C%22company%22%5D&tagFilters="}]}`;
    axios
      .post(
        "https://jf8q26wwud-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.30.0%3Binstantsearch.js%201.6.0%3BJS%20Helper%202.26.1&x-algolia-application-id=JF8Q26WWUD&x-algolia-api-key=ZmYwMTVkYTMwNTk4YmU5MGRhYzI1Y2I4ZjY1OGZkZTUyNjE4NDg3NDI0M2IyZjcwMmZjNDk3NWFkOGYzYjNkYXRhZ0ZpbHRlcnM9JnVzZXJUb2tlbj03NmUyNDExZjc1MGY2NjFjYTc5ZTRlNjgwZmFkYTZjZA%3D%3D",
        data
      )
      .then(response => {
        console.log(response);
        let customedPieChartData = getCustomedPieChartData(
          response.data.results[0].hits
        );
        let averageSalaryData = getAverageSalary(response.data.results[0].hits);
        this.setState({
          rowData: response.data.results[0].hits,
          customedPieChartData,
          averageSalaryData
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.search();
  }
}

export default JobMarket;
