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

class Strategy1 extends React.Component {
  render() {
    const { data, tableData } = this.state;

    return <div>
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
              {/* <Table {...config} columns={columns} dataSource={tableData} /> */}
    </div>;
  }
}

export default Strategy1;
