import React from "react";
import { Tabs, Input, Button, Table, Divider, Tag } from "antd";
import axios from "axios";
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
// import "antd/dist/antd.css";
import {
  getAnalyzeStockUrl,
  getBackTestStockUrl
} from "../../helpers/requests";

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

const columns2 = [
  {
    title: "Symbol",
    key: "symbol",
    render: data => {
      return data.start_obj.Symbol;
    }
  },
  {
    title: "Start Date",
    key: "start_date",
    render: data => {
      return data.start_obj.Date.slice(0, 10);
    }
  },
  {
    title: "Start Open",
    key: "start_open",
    render: data => {
      return data.start_obj.Open.toFixed(0);
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
    title: "End High",
    key: "end_high",
    render: data => {
      return data.end_obj.High.toFixed(0);
    }
  },
  {
    title: 'Profit',
    key: 'profit',
    render: data => {
      return data.profit
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

  callback = key => {
    console.log(key);
  };

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

  componentDidMount() {
    // Count FPT in last 3 years
    // this.analyze();
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

  calculateProfit = (data) => {
    let { finalAmount } = this.state
    for (let i=0; i < data.length; i++) {
      finalAmount = finalAmount * data[i].end_obj.High / data[i].start_obj.Open
      data[i].profit = finalAmount
    }
    return data
  }

  handleFindDay = () => {
    const data = {};
    axios
      .post(getBackTestStockUrl(), data)
      .then(response => {
        console.log(response.data);
        const mappedData = this.calculateProfit(response.data.data)
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
    const { data, tableData, tableData2 } = this.state;
    return (
      <div className="strategy">
        <React.Fragment>
          <Tabs defaultActiveKey="2" onChange={this.callback}>
            <TabPane tab="Strategy 1" key="1">
              <div>
                1. Count the number of increase 10%, keep it continuously 12
                times - 6 months - 2 weeks period
              </div>
              <div>2. Remove all result not include 2019</div>
              <div>
                3. Count the number of stocks that satisfy the requirement each
                day since 1/1/2019 - now
              </div>
              <div>
                4. Not select the total count of each day, but take the day with
                highest percentage of days containing > 20 stocks
              </div>

              <div className="header">
                <Input
                  defaultValue={this.period}
                  onPressEnter={dataInput => this.handleChangePeriod(dataInput)}
                />
                <Input
                  defaultValue={this.percent}
                  onPressEnter={dataInput =>
                    this.handleChangePercent(dataInput)
                  }
                />
                <Button onClick={() => this.handleJustify()}>Justify</Button>
              </div>
              <BarChart
                width={1500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="8 8" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  // fill="#8884d8"
                  onClick={data1 => {
                    console.log(data1);
                    this.props.cb(data1);
                  }}
                >
                  {data.map((obj, index) => {
                    return <Cell fill={obj.value < 20 ? "red" : "#8884d8"} />;
                  })}
                </Bar>
              </BarChart>
              <Table {...config} columns={columns} dataSource={tableData} />
            </TabPane>
            <TabPane tab="Strategy 2" key="2">
              <div>
                1. Create a list of stocks to buy with value from strategy 1:
                1.05-19
              </div>
              <div>Update database based on the period of time 2017, 2018</div>
              <div>Tinh thanh khoan voi so tien lon dan</div>
              <div>Delay time: for buy: 3-7 days, for sell: 0-3 days</div>
              <div>Init Amount {this.state.initAmount}</div>
              <div>Final Amount {this.state.finalAmount}</div>
              <Button onClick={() => this.handleFindDay()}>
                Handle calculate the day get % returned
              </Button>

              <Table {...config} columns={columns2} dataSource={tableData2} />
            </TabPane>
            <TabPane tab="Tab 3" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </React.Fragment>
      </div>
    );
  }
}

export default Strategy;
