import React from "react";
import { Tabs, Input, Button } from "antd";
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
import "antd/dist/antd.css";
import { getAnalyzeStockUrl } from "../../helpers/requests";

const { TabPane } = Tabs;
class Strategy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.percent = 1.1;
    this.period = 14;
  }

  callback = key => {
    console.log(key);
  };

  mapData = data => {
    const result = [];
    const converted_result = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i].result;
      for (let j = 0; j < item.length; j++) {
        if (!result[item[j]]) {
          result[item[j]] = [];
        }
        result[item[j]].push(data[i].Symbol);
      }
    }
    console.log(result);
    const keys = Object.keys(result).sort();
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k].slice(0, 10);
      if (/(2016|2017|2018|2019)/.test(key)) {
        converted_result.push({
          name: keys[k].slice(0, 10),
          data: result[keys[k]],
          value: result[keys[k]].length
        });
      }
    }

    console.log(converted_result);
    return converted_result;
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
        console.log(response.data)
        // const mappedData = this.mapData(response.data.symbol)
        // if (this.count )
        this.setState({
          data: response.data.symbol
        })
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    // Count FPT in last 3 years
    this.analyze();
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

  render() {
    const { data } = this.state;
    return (
      <div className="strategy">
        <React.Fragment>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
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
                  defaultValue={14}
                  onPressEnter={dataInput => this.handleChangePeriod(dataInput)}
                />
                <Input
                  defaultValue={1.1}
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
            </TabPane>
            <TabPane tab="Strategy 2" key="2">
              <div>
                1. Create a list of stocks to buy with value from strategy 1:
                1.05-14
              </div>
              <div>2. Select 5 stocks from that list</div>
              <div>3. Compare how many chosen stock in that list</div>
              <div>4. Find 1 criteria that 5 stocks has in common</div>
              <div>4. Calculate the profit base on the 5 stocks</div>
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
