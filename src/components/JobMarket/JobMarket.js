import React, { Component } from "react";
import axios from "axios";
import Input from "@material-ui/core/Input";
import CustomedAgGridReact from "../_customedComponents/CustomedAgGridReact";
import CustomedPieChart from "./../_customedComponents/CustomedPieChart";
import {
  getAllJobsUrl,
  getCreateJobUrl,
  getLastJobUrl,
  getUpdateJobUrl
} from "../../helpers/requests";
import {
  getCustomedPieChartData,
  getAverageSalary
} from "./../../helpers/functionUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Button } from "@material-ui/core";

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
    this.searchText = searchText;
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
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.handleUpdateJobsDatabase()}
        >
          Update jobs database
        </Button>
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
          <div className="barChartContainer">
            <BarChart
              width={800}
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
              <XAxis
                dataKey="name"
                //   tick={this.renderCustomAxisTick}
              />
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

  renderCustomAxisTick() {
    return <div>1</div>;
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

  async handleUpdateJobsDatabase() {
    let hitsPerPage = "1000";
    let indexName = "vnw_job_v2";
    let maxValuesPerFacet = "20";
    let page = "0";
    let query = this.searchText;
    let data = `{"requests":[{"indexName":"${indexName}","params":"query=${query}&hitsPerPage=${hitsPerPage}&maxValuesPerFacet=${maxValuesPerFacet}&page=${page}&restrictSearchableAttributes=%5B%22jobTitle%22%2C%22skills%22%2C%22company%22%5D&facets=%5B%22categoryIds%22%2C%22locationIds%22%2C%22categories%22%2C%22locations%22%2C%22skills%22%2C%22jobLevel%22%2C%22company%22%5D&tagFilters="}]}`;
    let url =
      "https://jf8q26wwud-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.30.0%3Binstantsearch.js%201.6.0%3BJS%20Helper%202.26.1&x-algolia-application-id=JF8Q26WWUD&x-algolia-api-key=ZmYwMTVkYTMwNTk4YmU5MGRhYzI1Y2I4ZjY1OGZkZTUyNjE4NDg3NDI0M2IyZjcwMmZjNDk3NWFkOGYzYjNkYXRhZ0ZpbHRlcnM9JnVzZXJUb2tlbj03NmUyNDExZjc1MGY2NjFjYTc5ZTRlNjgwZmFkYTZjZA%3D%3D";
    let success;
    let lastJob;
    const lastJobData = {};
    lastJobData.searchWord = this.searchText || "";
    await axios
      .post(getLastJobUrl(), lastJobData)
      .then(response => {
        lastJob = response.data;
      })
      .catch(error => {
        console.log(error);
      });
    console.log(lastJob);
    if (!lastJob || lastJob.data === "Invalid data") return;
    await axios
      .post(url, data)
      .then(response => {
        console.log(response);
        success = response.data;
      })
      .catch(error => {
        console.log(error);
      });
    if (!success) return;

    const jobData = {};
    jobData.content = JSON.stringify(success);
    jobData.timestamp = new Date().getTime();
    jobData.searchWord = this.searchText;
    if (
      lastJob.job &&
      lastJob.job.id &&
      new Date(lastJob.job.timestamp).toDateString() ===
        new Date().toDateString()
    ) {
      // update last job search
      jobData.id = lastJob.job.id;
      await axios
        .post(getUpdateJobUrl(), jobData)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      // create new database last job search
      await axios
        .post(getCreateJobUrl(), jobData)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  componentDidMount() {
    this.search();
    axios
      .get(getAllJobsUrl())
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default JobMarket;
