import React, { Component } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import Input from "@material-ui/core/Input";

class JobMarket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                {
                    headerName: 'Company',
                    field: '',
                    cellRenderer: function (params) {
                        return params.rowIndex + ' - ' + params.data.company + params.data.companyId
                    }
                },
                {
                    headerName: 'Job Title',
                    field: 'jobTitle'
                },
                {
                    headerName: 'Job Salary',
                    field: 'jobSalary'
                },
                {
                    headerName: 'Salary Max',
                    field: 'salaryMax'
                },
                {
                    headerName: 'Salary Min',
                    field: 'salaryMin'
                },
                {
                    headerName: 'Time Published',
                    field: 'timestamp',
                    cellRenderer: function (params) {
                        const time = params.data.timestamp
                        const year = time.slice(0, 4)
                        const month = time.slice(4, 6)
                        const day = time.slice(6, 8)
                        return `${day}/${month}/${year}`
                    }
                }
            ],
            rowData: [

            ]
        }
        this.defaultColDef = {
            sortable: true
        }
    }

    handleOnChangeQuerySearch(e) {
        this.search(e.target.value)
    }

    render() {
        return (
            <div className="jobMarket">
                JobMarket
                <Input
                    value={this.state.querySearch}
                    onChange={e => this.handleOnChangeQuerySearch(e)}
                />
                <div
                    className="ag-theme-balham"
                    style={{
                        height: "500px"
                    }}
                >
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowData}
                        defaultColDef={this.defaultColDef}
                    />
                </div>
            </div>
        );
    }

    search(querySearch) {
        let hitsPerPage = '1000'
        let indexName = 'vnw_job_v2'
        let maxValuesPerFacet = '20'
        let page = '0'
        let query = querySearch || ''
        let data = `{"requests":[{"indexName":"${indexName}","params":"query=${query}&hitsPerPage=${hitsPerPage}&maxValuesPerFacet=${maxValuesPerFacet}&page=${page}&restrictSearchableAttributes=%5B%22jobTitle%22%2C%22skills%22%2C%22company%22%5D&facets=%5B%22categoryIds%22%2C%22locationIds%22%2C%22categories%22%2C%22locations%22%2C%22skills%22%2C%22jobLevel%22%2C%22company%22%5D&tagFilters="}]}`
        axios.post('https://jf8q26wwud-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.30.0%3Binstantsearch.js%201.6.0%3BJS%20Helper%202.26.1&x-algolia-application-id=JF8Q26WWUD&x-algolia-api-key=ZmYwMTVkYTMwNTk4YmU5MGRhYzI1Y2I4ZjY1OGZkZTUyNjE4NDg3NDI0M2IyZjcwMmZjNDk3NWFkOGYzYjNkYXRhZ0ZpbHRlcnM9JnVzZXJUb2tlbj03NmUyNDExZjc1MGY2NjFjYTc5ZTRlNjgwZmFkYTZjZA%3D%3D', data)
            .then(response => {
                console.log(response)
                this.setState({
                    rowData: response.data.results[0].hits
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    componentDidMount() {
        this.search()
    }
}

export default JobMarket;
