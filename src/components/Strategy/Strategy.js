import React from "react";
import { Tabs, Input, Button, Table } from "antd";
import axios from "axios";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  // LineChart,
  // Line
} from "recharts";
// import "antd/dist/antd.css";
import {
  getAnalyzeStockUrl,
  getBackTestStockUrl,
  // getStrategyResultUrl
} from "../../helpers/requests";
import Strategy1 from "./Strategy1";
import Strategy2 from "./Strategy2";
import Strategy3 from "./Strategy3";

const config = {
  pagination: {
    pageSize: 300
    // pageSizeOptions: ["300"],
    // showSizeChanger: true
  }
};

const columns = [
  {
    title: "Max count",
    key: "max_count",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.max_count - b.max_count,
    render: data => {
      return data.max_count;
    }
  },
  {
    title: "Percent",
    key: "percent",
    render: data => {
      return data.percent;
    }
  },
  {
    title: "Period",
    key: "period",
    render: data => {
      return data.period;
    }
  },
  {
    title: "Count > 20",
    key: "count",
    render: data => {
      let result = 0;
      for (let i = 0; i < data.mapped_result.length; i++) {
        if (data.mapped_result[i].value > 20) result += 1;
      }
      return result;
    }
  }
];

const { TabPane } = Tabs;
class Strategy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      tableData: [],
      tableData2: [],
      initAmount: 10,
      finalAmount: 10
    };
    this.percent = 1.05;
    this.period = 19;
  }

  analyze = justify => {
    const data = {
      period: this.period,
      percent: this.percent
    };
    if (justify) data.justify = true;
    axios
      .post(getAnalyzeStockUrl(), data)
      .then(response => {
        console.log(response.data);
        // const mappedData = this.mapData(response.data.symbol)
        // if (this.count )
        this.setState({
          data: response.data.symbol,
          tableData: response.data.list_obj || [],
          tableData2: response.data.list_stocks || []
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  mapLineData = data => {
    console.log(data);
    const results = [];

    for (let j = 0; j < 60; j++) {
      const item = {};
      let content;
      for (let i = 0; i < 12; i++) {
        // console.log(JSON.parse(data[i].content))
        content = JSON.parse(data[i].content);
        const content_data = content[content.length - 1];
        // console.log(content)
        let name = "name_" + j;
        item["title"] = data[i].title;
        item["name"] = name;
        item["value" + i] = content_data[j] ? content_data[j].NAV : 0;
      }
      results.push(item);
    }

    console.log(results);
    return results;
  };

  componentDidMount() {
  // 
  }

  handleChangePeriod = data => {
    this.period = data.target.value;
    this.analyze();
  };

  handleChangePercent = data => {
    this.percent = data.target.value;
    this.analyze();
  };

  handleJustify = () => {
    // loop through period 4 - 31 && percent 1.05 - 1.25 to get the highest number of total count
    this.analyze(true);
  };

  calculateProfit = data => {
    let { finalAmount } = this.state;
    for (let i = 0; i < data.length; i++) {
      finalAmount =
        (finalAmount * data[i].end_obj.High) / data[i].start_obj.Open;
      data[i].profit = finalAmount;
    }
    return data;
  };

  handleFindDay = test => {
    const data = {};
    if (test) data.test = true;
    axios
      .post(getBackTestStockUrl(), data)
      .then(response => {
        console.log(response.data);
        const mappedData = this.calculateProfit(response.data.data);
        this.setState({
          tableData2: mappedData,
          finalAmount: mappedData[mappedData.length - 1].profit
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="strategy">
        <React.Fragment>
          <Tabs defaultActiveKey="3">
            <TabPane tab="Strategy 1" key="1">
              <Strategy1 />
            </TabPane>
            <TabPane tab="Strategy 2" key="2">
              <Strategy2 />
            </TabPane>
            <TabPane tab="Paybacktime Strategy" key="3">
              <Strategy3 />
            </TabPane>
          </Tabs>
        </React.Fragment>
      </div>
    );
  }
}

export default Strategy;
