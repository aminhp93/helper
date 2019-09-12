import React from "react";
import { Input, Button, Table } from "antd";
// import axios from "axios";
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
// import {
//   getAnalyzeStockUrl,
//   getBackTestStockUrl,
//   getStrategyResultUrl
// } from "../../helpers/requests";

import { getArray, getRandomColor } from "../../helpers/functionUtils";

const config = {
  pagination: {
    pageSize: 300
    // pageSizeOptions: ["300"],
    // showSizeChanger: true
  }
};

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
      return data.title;
    }
  },
  {
    title: "Content",
    key: "content",
    render: data => {
      return data.content;
    }
  }
];

// const { TabPane } = Tabs;

class Strategy2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { tableData2, tableData3 } = this.state;

    return (
      <div>
        <div>
          1. Create a list of stocks to buy with value from strategy 1: 1.05-19
        </div>
        <div>Update database based on the period of time 2017, 2018</div>
        <div>Tinh thanh khoan voi so tien lon dan</div>
        <div>Delay time: for buy: 3-7 days, for sell: 0-3 days</div>
        <div>Init Amount {this.state.initAmount}</div>
        <div>Final Amount {this.state.finalAmount}</div>
        <div className="">
          <div>
            time_period: <Input defaultValue={this.time_period} />
          </div>
          <div>
            position_stock: <Input defaultValue={this.position_stock} />
          </div>
          <div>
            percent: <Input defaultValue={this.percent} />
          </div>
        </div>

        <Button onClick={() => this.handleFindDay()}>
          Handle calculate the day get % returned
        </Button>
        <Button onClick={() => this.handleFindDay(true)}>Test</Button>

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
          {getArray(12).map((item, index) => {
            const dataKey = "value" + index;
            return (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={getRandomColor()}
              />
            );
          })}
          {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
        <Table {...config} columns={columns3} dataSource={tableData3} />
      </div>
    );
  }
}

export default Strategy2;
