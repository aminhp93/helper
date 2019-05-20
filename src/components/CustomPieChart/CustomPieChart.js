import React, { Component } from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
import { calculateClose, findMaxPercent } from "./../../helpers/functionUtils";
import Input from "@material-ui/core/Input";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class CustomPieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: props.data,
      customedData: [],
      timeValue: props.timeValue || 20,
      percentValue: props.percentValue || 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rowData: nextProps.data,
      customedData: calculateClose(
        nextProps.data,
        this.state.timeValue,
        this.state.percentValue
      )
    });
  }

  handleOnChangeTime(e) {
    if (!/[0-9]+/.test(e.target.value)) return;
    this.setState({
      timeValue: Number(e.target.value),
      customedData: calculateClose(
        this.state.rowData,
        Number(e.target.value),
        this.state.percentValue
      )
    });
  }

  handleOnChangePercent(e) {
    if (!/[0-9]+/.test(e.target.value)) return;
    this.setState({
      percentValue: Number(e.target.value),
      customedData: calculateClose(
        this.state.rowData,
        this.state.timeValue,
        Number(e.target.value)
      )
    });
  }

  handleOnClick(e) {
    const result = findMaxPercent(this.state.rowData)
    console.log(result)
    this.setState({
      timeValue: result.timeValue,
      customedData: result.customedData
    })

  }

  render() {
    return (
      <div>
        <div>{this.state.rowData && this.state.rowData.length && this.state.rowData[0].Symbol}</div>
        <div onClick={e => this.handleOnClick(e)}>Find</div>
        <Input
          value={this.state.timeValue}
          onChange={e => this.handleOnChangeTime(e)}
        />
        <Input
          defaultValue={this.state.percentValue}
          onChange={e => this.handleOnChangePercent(e)}
        />
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={this.state.customedData}
            cx={200}
            cy={200}
            outerRadius={80}
            fill="#8884d8"
            label={renderCustomizedLabel}
          >
            {this.state.customedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    );
  }
}

export default CustomPieChart;
