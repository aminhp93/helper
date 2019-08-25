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
  Legend,
  LineChart,
  Line
} from "recharts";
// import "antd/dist/antd.css";
import {
  getAnalyzeStockUrl,
  getBackTestStockUrl,
  getStrategyResultUrl
} from "../../helpers/requests";
import Strategy3 from './Strategy3';

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
      return data.NAV;
    }
  }
];

const columns3 = [
  {
    title: "Title",
    key: "title",
    render: data => {
      return data.title
    }
  },
  {
    title: "Content",
    key: "content",
    render: data => {
      return data.content
    }
  },
]

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
    // Count FPT in last 3 years
    // this.analyze();
    axios
      .get(getStrategyResultUrl())
      .then(response => {
        console.log(response.data);
        this.setState({
          // data123: this.mapLineData(response.data.data),
          tableData3: response.data.data
        });
      })
      .catch(error => console.log(error));
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

  handleFindDay = (test) => {
    const data = {};
    if (test) data.test = true
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

  getArray = number => {
    const result = [];
    for (let i = 0; i < number; i++) {
      result.push(i);
    }
    return result;
  };

  getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  render() {
    const { data, tableData, tableData2, tableData3 } = this.state;
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
              <Button onClick={() => this.handleFindDay(true)}>
                Test
              </Button>

              <Table {...config} columns={columns2} dataSource={tableData2} />
              <LineChart
                width={1000}
                height={500}
                data={this.state.data123 || []}
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
                {this.getArray(12).map((item, index) => {
                  const dataKey = "value" + index;
                  return (
                    <Line
                      type="monotone"
                      dataKey={dataKey}
                      stroke={this.getRandomColor()}
                    />
                  );
                })}
                {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
              </LineChart>
              <Table {...config} columns={columns3} dataSource={tableData3} />
            </TabPane>
            <TabPane tab="Strategy 3" key="3">
            <Strategy3/>
            </TabPane>
          </Tabs>
        </React.Fragment>
      </div>
    );
  }
}

export default Strategy;
