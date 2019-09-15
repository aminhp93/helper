import React from "react";
import { Input, Button, Table } from "antd";
import axios from "axios";
import {
  // BarChart,
  // Bar,
  // Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from "recharts";
// import "antd/dist/antd.css";
import {
  // getAnalyzeStockUrl,
  getBackTestStockUrl,
  getStrategyResultUrl,
} from "../../helpers/requests";

import { getArray, getRandomColor } from "../../helpers/functionUtils";
import { filterButtonsEnums } from "./constants";
import CustomedToggleButtonGroup from "../_customedComponents/CustomedToggleButtonGroup";
import { Empty } from 'antd';
import Loading from './../Loading';

const timePeriodDefault = 5;
const positionStockDefault = 1;
const percentDefault = 105

const config = {
  pagination: {
    pageSize: 300
    // pageSizeOptions: ["300"],
    // showSizeChanger: true
  }
};

const filterButtonsOptions = [
  {
    value: filterButtonsEnums.CALCULATE,
    display_value: 'CALCULATE'
  },
  {
    value: filterButtonsEnums.TEST,
    display_value: 'TEST'
  },
  {
    value: filterButtonsEnums.REPORT,
    display_value: 'REPORT'
  },
];

const testColumns = [
  {
    title: "Symbol",
    key: "symbol",
    render: data => {
      return data.start_obj.Symbol;
    }
  },
  {
    title: "Buy Date",
    key: "buy_date",
    render: data => {
      return data.start_obj.Date.slice(0, 10);
    }
  },
  {
    title: "Buy Price",
    key: "buy_price",
    render: data => {
      return data.buy_price.toFixed(0);
    }
  },
  {
    title: "End Date",
    key: "end_date",
    render: data => {
      return data.end_obj.Date.slice(0, 10);
    }
  },
  {
    title: "Sell Price",
    key: "sell_price",
    render: data => {
      return data.sell_price.toFixed(0);
    }
  },
  {
    title: "Total Volume Stock",
    key: "total_volume_stock",
    render: data => {
      return data.end_obj.Volume;
    }
  },
  {
    title: "Volume",
    key: "volume",
    render: data => {
      return `${data.volume.toFixed(0)} - ${(
        (data.volume * 100) /
        data.end_obj.Volume
      ).toFixed(4)}`;
    }
  },
  {
    title: "percent",
    key: "percent",
    render: data => {
      return (data.sell_price / data.buy_price).toFixed(3);
    }
  },
  {
    title: "NAV",
    key: "NAV",
    render: data => {
      return data.NAV.toFixed(0);
    }
  },
  {
    title: "total_NAV",
    key: "total_NAV",
    render: data => {
      return data.total_NAV.toFixed(0);
    }
  }
];

const reportColumns = [
  {
    title: "Title",
    key: "title",
    render: data => {
      return data.title;
    }
  },
  {
    title: "NAV",
    key: "NAV",
    render: data => {
      return data.NAV && data.NAV.toFixed(0);
    }
  },
  {
    title: "total_NAV",
    key: "total_NAV",
    render: data => {
      return data.total_NAV;
    }
  }
];

// const { TabPane } = Tabs;

class Strategy2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        time_period: timePeriodDefault,
        position_stock: positionStockDefault,
        percent: percentDefault,
      },
      lineChartData: [],
      testTableData: [],
      loading: false
    };
  }

  handleFindDay = test => {
    const data = {};
    if (test) data.test = true;

    Object.keys(this.state.data).map(key => (
      data[key] = this.state.data[key]
    ))
    this.setState({
      loading: true
    })
    axios
      .post(getBackTestStockUrl(), data)
      .then(response => {
        console.log(response.data);
        // const mappedData = this.calculateProfit(response.data.data);
        if (response.data && response.data.data) {
          this.setState({
            testTableData: (response.data.data || []).sort((a, b) => b.content - a.content),
            loading: false
          //   finalAmount: mappedData[mappedData.length - 1].profit
          });
        }
      })
      .catch(error => {
        this.setState({
          loading: false
        })
        console.log(error);
      });
  };

  handleChangeInput = (key, e) => {
    e.preventDefault();
    const { data } = this.state;
    data[key] = Number(e.target.value)
    console.log(data)
    this.setState({
      data
    })
  }

  getReport = () => {
    this.setState({
      loading: true
    })
    axios
      .get(getStrategyResultUrl())
      .then(response => {
        console.log(response.data);
        if (response.data && response.data.data) {
          this.setState({
            // data123: this.mapLineData(response.data.data),
            reportTableData: (response.data.data || []).sort((a, b) => b.NAV - a.NAV),
            loading: false
          });
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({
          loading: false
        })
      });
  }

  handleCbCustomedToggleButtonGroup = (index) => {
    this.toggleButton = index;
    switch (index) {
      case filterButtonsEnums.CALCULATE:
          this.handleFindDay()
        break;
      case filterButtonsEnums.TEST:
          this.handleFindDay(true)
        break;
      case filterButtonsEnums.REPORT:
          this.getReport()
        break;
      default:
        break;
    }
  }

  renderChart = () => {
    const { testTableData, lineChartData, reportTableData } = this.state;
    switch (this.toggleButton) {
      case filterButtonsEnums.CALCULATE:
        return null;
      case filterButtonsEnums.TEST:
        return <Table {...config} columns={testColumns} dataSource={testTableData} />
      case filterButtonsEnums.REPORT:
        return <React.Fragment>
          <LineChart
            width={1000}
            height={500}
            data={lineChartData}
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
            {/* <Line type="monotone" dataKey='value0' stroke="#82ca9d" />
                  <Line type="monotone" dataKey='value1' stroke="#82ca9d" />
                    */}
            {getArray(12).map((item, index) => {
              const dataKey = "value" + index;
              return (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={dataKey}
                  stroke={getRandomColor()}
                />
              );
            })}
            {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
          </LineChart>
          <Table {...config} columns={reportColumns} dataSource={reportTableData} />
        </React.Fragment>
      default:
        return <Empty />
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }
    return (
      <div className="strategy2">
        <div>
          1. Create a list of stocks to buy with value from strategy 1: 1.05-19
        </div>
        <div>Update database based on the period of time 2017, 2018</div>
        <div>Tinh thanh khoan voi so tien lon dan</div>
        <div>Delay time: for buy: 3-7 days, for sell: 0-3 days</div>
        <div>Init Amount {this.state.initAmount}</div>
        <div>Final Amount {this.state.finalAmount}</div>
        <div className="inputContainer">
          <div className='inputBox'>
            <Input addonBefore="time_period" defaultValue={timePeriodDefault} onChange={(e) => this.handleChangeInput('time_period', e)} />
          </div>
          <div className='inputBox'>
            <Input addonBefore="position_stock" defaultValue={positionStockDefault} onChange={e => this.handleChangeInput('position_stock', e)} />
          </div>
          <div className='inputBox'>
            <Input addonBefore="percent" defaultValue={percentDefault} onChange={e => this.handleChangeInput('percent', e)} />
          </div>
        </div>
        <CustomedToggleButtonGroup
          options={filterButtonsOptions}
          cb={this.handleCbCustomedToggleButtonGroup.bind(this)}
        />
        { this.renderChart()}
      </div>
    );
  }
}

export default Strategy2;
