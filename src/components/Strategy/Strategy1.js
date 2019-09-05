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
    return <div>Strategy1</div>;
  }
}

export default Strategy1;
