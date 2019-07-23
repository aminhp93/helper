import React from "react";
import { Tabs } from "antd";
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
import { List, Avatar, Button, Modal, Carousel, Input, Select } from "antd";
import { getAnalyzeStockUrl } from "../../helpers/requests";
import { Table, Divider, Tag } from 'antd';

const columns = [
  {
    title: 'Date',
    dataIndex: '',
    key: 'date',
    render: data => {
      console.log(data)
      return data.name
    }
  },
  {
    title: 'Symbol',
    dataIndex: '',
    key: 'Symbol',
    render: data => {
      return data.data.join()
    }
  },
];

const { TabPane } = Tabs;
class Strategy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }
  callback = key => {
    console.log(key);
  };

  mapData = (data) => {
    const result = [];
    const converted_result = [];
    for (let i=0; i < data.length; i++) {
      const item = data[i].result;
      for (let j=0; j < item.length; j++) {
        if (!result[item[j]]) {
          result[item[j]] = []
        }
        result[item[j]].push(data[i].Symbol)
      }
    }
    console.log(result);
    const keys = Object.keys(result).sort()
    for (let k=0; k < keys.length; k++) {
      const key = keys[k].slice(0, 10);
      if (/(2016|2017|2018|2019)/.test(key)){
        converted_result.push({
          name: keys[k].slice(0, 10),
          data: result[keys[k]],
          value: result[keys[k]].length
        })
      }
    }
    console.log(converted_result)
    return converted_result
  }

  componentDidMount() {
    // Count FPT in last 3 years
    axios
      .post(getAnalyzeStockUrl(), { symbol: "FPT" })
      .then(response => {
        // console.log(response.data);
        // console.log(this.mapData(response.data.symbol))
        this.setState({
          data: this.mapData(response.data.symbol)
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const {data} = this.state;
    return (
      <React.Fragment>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="Strategy 1" key="1">
            1. Count the number of increase 10%, keep it continuously 12 times - 6
            months - 2 weeks period
            2. Remove all result not include 2019
            3. Count the number of stocks that satisfy the requirement each day since 1/1/2019 - now
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
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
            <Bar dataKey="value" fill="#8884d8" onClick={(data1) => {
              console.log(data1)
              this.props.cb(data1)
            }} />
          </BarChart>
          {/* <Table columns={columns} dataSource={data} /> */}
      </React.Fragment>
    );
  }
}

export default Strategy;
