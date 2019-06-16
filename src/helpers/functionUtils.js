import analysisTypes from "../constants/analysisTypes";
import countValueEnums from "../constants/countValueEnums";
import { YEAR } from "./requests";

export function calculateClose(data, timeValue, percentValue = 0) {
  if (!data) return;
  let smallerCount = 0;
  let largerCount = 0;
  for (let i = 0; i < data.length - timeValue; i++) {
    if (data[i].Close < data[i + timeValue].Close * (1 + percentValue / 100)) {
      smallerCount += 1;
    } else {
      largerCount += 1;
    }
  }
  const returnedData = [
    {
      name: "smallerCount",
      value: smallerCount
    },
    {
      name: "largerCount",
      value: largerCount
    }
  ];
  return returnedData;
}

export function findMaxPercent(data, percentValue = 0) {
  let timeValue = 0;
  let smallerCount = 0;
  let largerCount = 0;
  let returnedSmallerCount = 0;
  let returnedLargerCount = 0;
  let currentPercent = 0;
  for (let j = 1; j < 251; j++) {
    for (let i = 0; i < data.length - j; i++) {
      if (data[i].Close < data[i + j].Close * (1 + percentValue / 100)) {
        smallerCount += 1;
      } else {
        largerCount += 1;
      }
    }
    if (largerCount / (data.length - j) > currentPercent) {
      currentPercent = largerCount / (data.length - j);
      timeValue = j;
      returnedSmallerCount = smallerCount;
      returnedLargerCount = largerCount;
    }
    smallerCount = 0;
    largerCount = 0;
  }
  const returnedData = {
    timeValue: timeValue,
    customedData: [
      {
        name: "smallerCount",
        value: returnedSmallerCount
      },
      {
        name: "largerCount",
        value: returnedLargerCount
      }
    ]
  };
  return returnedData;
}

export function calculateRSI(data) {
  let sumGain = 0;
  let sumLoss = 0;
  let sum_volume = 0;
  for (let j = 1; j < data.length; j++) {
    if (j > data.length - 17 && j < data.length - 1) {
      sum_volume += data[j].Volume;
    }
    let change = data[j].Close - data[j - 1].Close;
    if (change > 0) {
      data[j].Gain = change;
      data[j].Loss = 0;
    }
    if (change < 0) {
      data[j].Loss = -change;
      data[j].Gain = 0;
    }
    if (change === 0) {
      data[j].Loss = 0;
      data[j].Gain = 0;
    }
    sumGain += data[j].Gain || 0;
    sumLoss += data[j].Loss || 0;
    if (j < 14) {
      data[j].AverageGain = sumGain / 14;
      data[j].AverageLoss = sumLoss / 14;
    } else {
      data[j].AverageGain = (data[j - 1].AverageGain * 13 + data[j].Gain) / 14;
      data[j].AverageLoss = (data[j - 1].AverageLoss * 13 + data[j].Loss) / 14;
      data[j].RSI = 100 - 100 / (1 + data[j].AverageGain / data[j].AverageLoss);
    }
  }

  if (
    data[data.length - 1] &&
    data[data.length - 2] &&
    data[data.length - 1].RSI &&
    data[data.length - 2].RSI
  ) {
    return {
      RSI_14_previous: Number(data[data.length - 2].RSI.toFixed(0)) || 0,
      RSI_14: Number(data[data.length - 1].RSI.toFixed(0)) || 0,
      percentage_change_in_volume:
        (data[data.length - 1].Volume - sum_volume / 15) / (sum_volume / 15),
      percentage_change_in_price:
        (data[data.length - 1].Close - data[data.length - 2].Close) /
        data[data.length - 2].Close,
      yesterday_Close: data[data.length - 2].Close
    };
  }
  return {};
}

export function mapData(data, key) {
  let returnedData = [];
  let decreasedStockNumbers = 0;
  let increasedStockNumbers = 0;
  let unchangedStockNumbers = 0;
  for (let i = 0; i < data.length; i++) {
    let price_data_item = JSON.parse(data[i].price_data);
    let lastDay = price_data_item[price_data_item.length - 1];
    let lastTwoDays = price_data_item[price_data_item.length - 2];

    let financial_data_item = JSON.parse(data[i].financial_data);
    // console.log(lastDay)
    let returnItem = {};
    returnItem["Symbol"] = data[i]["Symbol"];
    if (lastDay) {
      returnItem["Close"] = lastDay.Close / 1000;
      returnItem["Volume"] = lastDay.Volume;
      const calculateRSI_result = calculateRSI(price_data_item);
      returnItem["RSI_14"] = calculateRSI_result.RSI_14;
      returnItem["RSI_14_diff"] =
        calculateRSI_result.RSI_14 - calculateRSI_result.RSI_14_previous;
    }
    if (financial_data_item) {
      returnItem["ROE"] = financial_data_item && financial_data_item.ROE * 100;
      returnItem["EPS"] = financial_data_item.EPS;
      returnItem["MarketCapitalization"] =
        financial_data_item.MarketCapitalization / Math.pow(10, 9);
    }
    returnItem[key] = key;
    returnedData.push(returnItem);

    if (lastDay && lastDay.Close && lastTwoDays && lastTwoDays.Close) {
      if (lastDay.Close > lastTwoDays.Close) {
        increasedStockNumbers += 1;
      } else if (lastDay.Close < lastTwoDays.Close) {
        decreasedStockNumbers += 1;
      } else {
        unchangedStockNumbers += 1;
      }
    }
  }
  return {
    returnedData,
    barChartData: [
      {
        name: "Name 1",
        increasedStockNumbers,
        decreasedStockNumbers,
        unchangedStockNumbers
      }
    ]
  };
}

export function formatNumber(input, decimal, fill, nonFixToZero) {
  try {
    if (input === null || isNaN(input) || input === undefined) {
      return "--";
    }
    if (input === "" && !nonFixToZero) {
      return "0";
    }
    if (decimal == null) {
      if (parseFloat(input) >= 2) {
        input = roundFloat(input, 2);
      } else {
        input = roundFloat(input, 3);
      }
    } else {
      input = roundFloat(input, decimal);
    }
    input = input.toString().split(".");
    input[0] = input[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    if (decimal && fill) {
      if (!input[1]) input[1] = "0".repeat(decimal);
      else input[1] += "0".repeat(decimal - input[1].length);
    }
    return input.join(".");
  } catch (ex) {
    console.error(ex);
  }
}
export function roundFloat(numberFloat, length) {
  try {
    if (numberFloat == null || length == null) {
      return 0;
    }
    // let itenDivison = '1';
    // for (let i = 0; i < length; i++) {
    //     itenDivison += '0';
    // }
    // const division = Number(itenDivison);
    let numberString = numberFloat + "";
    let arrNumber = numberString.split(".");
    if (!arrNumber[1]) return numberFloat;
    for (let i = 0; i < length; i++) {
      if (arrNumber[1][0]) {
        arrNumber[0] += arrNumber[1][0];
        arrNumber[1] = arrNumber[1].substr(1);
      } else {
        arrNumber[0] += "0";
      }
    }
    numberString = arrNumber.join(".");
    arrNumber = Math.round(numberString).toString();
    arrNumber = arrNumber.replace(/^(-?)/, "$1" + "0".repeat(length));
    let result = Number(
      arrNumber.substring(0, arrNumber.length - length) +
        "." +
        arrNumber.substr(-length)
    );
    return result;
  } catch (e) {
    console.error(e);
  }
  return 0;
}

export function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

export function getCustomedPieChartData(data) {
  if (!data || !data.length) return [];
  const returnObj = {};
  let returnArray = [];
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let key = item.locations && item.locations[0];
    if (key) {
      if (!returnObj.hasOwnProperty(key)) {
        returnObj[key] = 0;
      } else {
        returnObj[key] += 1;
      }
    }
  }
  for (let key in returnObj) {
    returnArray.push({
      name: key,
      value: returnObj[key]
    });
  }
  returnArray.sort((a, b) => b.value - a.value);
  console.log(returnArray);
  return returnArray;
}

export function getAverageSalary(data) {
  if (!data || !data.length) return [];
  const returnObj = {};
  let returnArray = [];
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let key = item.locations && item.locations[0];
    if (key) {
      if (!returnObj.hasOwnProperty(key)) {
        returnObj[key] = [];
      } else {
        returnObj[key].push(item.jobSalary);
      }
    }
  }
  for (let key in returnObj) {
    returnArray.push({
      name: key,
      value: calculateAverage(returnObj[key])
    });
  }
  returnArray.sort((a, b) => b.value - a.value);
  console.log(returnArray);
  return returnArray.slice(0, 5);
}

export function calculateAverage(data) {
  if (!data || !data.length) return 0;
  let sum = 0;
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    count += 1;
  }
  return sum / count;
}

export function mapStockData(data) {
  return data;
}

export function mapDataBusinessSummary(data, analysisType) {
  // console.log(data, analysisType);
  if (analysisType === analysisTypes.ANALYSIS_1) {
    const addItem = {};
    addItem.Expanded = true;
    addItem.Field = null;
    addItem.ID = 110;
    addItem.Level = 1;
    addItem.Name = "110. Loi nhuan hoat dong kinh doanh chinh (5) - (9) - (10)";
    addItem.ParentId = -1;
    addItem.Values = [];
    for (let i = 0; i < data[4].Values.length; i++) {
      let loi_nhuan_gop_5 = data[4].Values[i].Value;
      let chi_phi_ban_hang_9 = data[9].Values[i].Value;
      let chi_phi_quan_ly_10 = data[10].Values[i].Value;
      let loi_nhuan_hoat_dong_kinh_doanh_chinh_110 =
        loi_nhuan_gop_5 - chi_phi_ban_hang_9 - chi_phi_quan_ly_10;
      addItem.Values.push({
        Period: data[4].Values[i].Period,
        Year: data[4].Values[i].Period,
        Quarter: data[4].Values[i].Period,
        Value: loi_nhuan_hoat_dong_kinh_doanh_chinh_110
      });
    }
    data.splice(12, 0, addItem);
  } else if (analysisType === analysisTypes.ANALYSIS_2) {
    for (let i = 0; i < data[4].Values.length; i++) {
      let doanh_thu_thuan_3 = data[2].Values[i].Value;
      for (let j = 3; j < 23; j++) {
        if (!data[j].ANALYSIS_2) data[j].ANALYSIS_2 = [];
        data[j].ANALYSIS_2.push({
          Value: (
            ((data[j].Values[i] || {}).Value / doanh_thu_thuan_3) *
            100
          ).toFixed(2)
        });
      }
    }
  } else if (analysisType === analysisTypes.ANALYSIS_3) {
    for (let i = 0; i < data[4].Values.length; i++) {
      let tong_cong_tai_san_2 = data[62].Values[i].Value;
      for (let j = 1; j < 116; j++) {
        if (!data[j].ANALYSIS_3) data[j].ANALYSIS_3 = [];
        data[j].ANALYSIS_3.push({
          Value: (
            ((data[j].Values[i] || {}).Value / tong_cong_tai_san_2) *
            100
          ).toFixed(2)
        });
      }
    }
  } else if (analysisType === analysisTypes.ANALYSIS_4) {
    let newArray = [];
    for (let i = 0; i < data.length; i++) {
      if (
        [
          1,
          10101,
          10102,
          10103,
          10104,
          10105,
          102,
          2,
          3,
          3010101,
          3010103,
          3010111,
          3010113,
          30102,
          30201,
          30202,
          4
        ].indexOf(data[i].ID) > -1
      ) {
        newArray.push(data[i]);
      }
    }
    data = newArray;
  }

  // console.log(data);
  return data;
}

export function strcmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function getColumnDefs_year() {
  let result = [
    {
      headerName: "Name",
      field: "Name",
      width: 200,
      cellRenderer: function(params) {
        const div = document.createElement("div");
        div.title = params.data.Name;
        div.innerHTML = params.data.Name;
        return div;
      }
    }
  ];
  let periods = [];
  for (let i = 0; i < countValueEnums.YEAR; i++) {
    let item = Number(YEAR) - countValueEnums.YEAR + i;
    periods.push(String(item));
  }
  for (let i = 0; i < periods.length; i++) {
    let item = {
      headerName: periods[i],
      width: 120,
      cellRenderer: function(params) {
        const div = document.createElement("div");
        let value = (params.data.Values[i] || {}).Value
          ? formatNumber(
              (params.data.Values[i] || {}).Value / Math.pow(10, 9),
              1,
              true
            )
          : "";
        div.innerHTML = value;
        div.className = "";
        div.classList.add("number");
        return div;
      }
    };
    result.push(item);
  }
  return result;
}

export function getColumnDefs_quarter() {
  let result = [
    {
      headerName: "Name",
      field: "Name",
      width: 200
    }
  ];
  let periods = [
    "Q2 2017",
    "Q3 2017",
    "Q4 2017",
    "Q1 2018",
    "Q2 2018",
    "Q3 2018",
    "Q4 2018",
    "Q1 2019"
  ];
  for (let i = 0; i < periods.length; i++) {
    let item = {
      headerName: periods[i],
      field: "",
      width: 120,
      cellRenderer: function(params) {
        return (params.data.Values[i] || {}).Value
          ? formatNumber((params.data.Values[i] || {}).Value / 1000000, 1, true)
          : "";
      }
    };
    result.push(item);
  }
  return result;
}

export function getColumnDefs_analysis_1() {
  let result = [];
  let periods_1 = [];

  for (let i = 0; i < countValueEnums.YEAR - 1; i++) {
    let item_1 = Number(YEAR) - countValueEnums.YEAR + i + 1;
    let item_2 = Number(YEAR) - countValueEnums.YEAR + i;
    periods_1.push(item_1 + "-" + item_2);
  }

  for (let i = 0; i < periods_1.length; i++) {
    let item = {
      headerName: periods_1[i],
      field: "",
      width: 120,
      cellRenderer: function(params) {
        let value_1 = (params.data.Values[i + 1] || {}).Value;

        let value_2 = (params.data.Values[i] || {}).Value;
        if (!value_1 || !value_2) return "";
        const div = document.createElement("div");
        div.innerHTML = formatNumber(
          (value_1 - value_2) / Math.pow(10, 9),
          1,
          true
        );
        div.className =
          [1, 5, 110, 15].indexOf(params.data.ID) > -1 ? "highlight" : "";
        div.classList.add("number");
        return div;
      }
    };
    result.push(item);
  }

  let periods_2 = [];

  for (let i = 0; i < countValueEnums.YEAR - 1; i++) {
    let item_1 = Number(YEAR) - countValueEnums.YEAR + i + 1;
    let item_2 = Number(YEAR) - countValueEnums.YEAR + i;
    periods_2.push(item_1 + "/" + item_2);
  }

  for (let i = 0; i < periods_2.length; i++) {
    let item = {
      headerName: periods_2[i],
      field: "",
      width: 120,
      cellRenderer: function(params) {
        let value_1 = (params.data.Values[i + 1] || {}).Value;

        let value_2 = (params.data.Values[i] || {}).Value;
        if (!value_1 || !value_2) return "";
        const div = document.createElement("div");
        let value = ((value_1 / value_2 - 1) * 100).toFixed(2) + "%";
        div.innerHTML = value;
        div.className =
          params.data.ID === 1 || params.data.ID === 5 ? "highlight" : "";
        div.classList.add("number");
        return div;
      }
    };
    result.push(item);
  }
  return result;
}

export function getColumnDefs_analysis_2() {
  let result = [];
  let periods_1 = [];
  for (let i = 0; i < countValueEnums.YEAR; i++) {
    let item = Number(YEAR) - countValueEnums.YEAR + i;
    periods_1.push(String(item));
  }
  for (let i = 0; i < periods_1.length; i++) {
    let item = {
      headerName: periods_1[i],
      field: "",
      cellStyle: { "background-color": "gray" },
      cellRenderer: function(params) {
        const div = document.createElement("div");
        div.className = "";
        div.classList.add("number");
        if (params.data.ANALYSIS_2) {
          div.innerHTML = (params.data.ANALYSIS_2[i] || {}).Value + "%";
        }
        return div;
      }
    };
    result.push(item);
  }
  let periods_2 = [];
  for (let i = 0; i < countValueEnums.YEAR - 1; i++) {
    let item_1 = Number(YEAR) - countValueEnums.YEAR + i + 1;
    let item_2 = Number(YEAR) - countValueEnums.YEAR + i;
    periods_2.push(item_1 + "-" + item_2);
  }
  for (let i = 0; i < periods_2.length; i++) {
    let item = {
      headerName: periods_2[i],
      field: "",
      cellRenderer: function(params) {
        const div = document.createElement("div");
        div.className = "";
        div.classList.add("number");
        if (!params.data.ANALYSIS_2) return "";
        const value_1 = (params.data.ANALYSIS_2[i + 1] || {}).Value;
        const value_2 = (params.data.ANALYSIS_2[i] || {}).Value;
        if (!value_1 || !value_2) return "";
        div.innerHTML = (value_1 - value_2).toFixed(2) + "%";
        return div;
      }
    };
    result.push(item);
  }
  return result;
}

export function getColumnDefs_analysis_3() {
  let result = [];
  let periods = ["2014", "2015", "2016", "2017", "2018"];
  for (let i = 0; i < periods.length; i++) {
    let item = {
      headerName: periods[i],
      field: "",
      cellStyle: { "background-color": "gray" },
      cellRenderer: function(params) {
        const div = document.createElement("div");
        div.className =
          [301, 302, 30101].indexOf(params.data.ID) > -1 ? "highlight" : "";
        div.classList.add("number");
        if (params.data.ANALYSIS_3) {
          let value = (params.data.ANALYSIS_3[i] || {}).Value;
          if (typeof value === "undefined" || value === "0.00") return null;
          div.innerHTML = value + "%";
        }
        return div;
      }
    };
    result.push(item);
  }
  return result;
}

export function getColumnDefs_analysis_4() {
  return [
    {
      headerName: "Name",
      field: "Name",
      width: 200,
      cellRenderer: function(params) {
        const div = document.createElement("div");
        div.title = params.data.Name;
        div.innerHTML = params.data.Name;
        return div;
      }
    },
    {
      headerName: "2017",
      width: 120,
      cellRenderer: function(params) {
        const div = document.createElement("div");
        let value = (params.data.Values[params.data.Values.length - 2] || {})
          .Value
          ? formatNumber(
              (params.data.Values[params.data.Values.length - 2] || {}).Value /
                Math.pow(10, 9),
              1,
              true
            )
          : "";
        div.innerHTML = value;
        div.className = "";
        div.classList.add("number");
        return div;
      }
    },
    {
      headerName: "2018",
      width: 120,
      cellRenderer: function(params) {
        const div = document.createElement("div");
        let value = (params.data.Values[params.data.Values.length - 1] || {})
          .Value
          ? formatNumber(
              (params.data.Values[params.data.Values.length - 1] || {}).Value /
                Math.pow(10, 9),
              1,
              true
            )
          : "";
        div.innerHTML = value;
        div.className = "";
        div.classList.add("number");
        return div;
      }
    },
    {
      headerName: "Su dung von",
      field: "",
      pinnedRowCellRenderer: function(params) {
        console.log(params, 508);
        return "pinned";
      },
      cellRenderer: function(params) {
        if (
          [10102, 10105, 3010103, 3010111, 30102, 30201, 2, 4].indexOf(
            params.data.ID
          ) > -1
        )
          return null;
        const div = document.createElement("div");
        let value1 = (params.data.Values[params.data.Values.length - 1] || {})
          .Value;
        let value2 = (params.data.Values[params.data.Values.length - 2] || {})
          .Value;
        let value = value1 - value2;
        div.innerHTML = value
          ? formatNumber(value / Math.pow(10, 9), 1, true)
          : "";
        div.className = "";
        div.classList.add("number");
        return div;
      }
    },
    {
      headerName: "nguon von",
      field: "",
      cellRenderer: function(params) {
        if (
          [10101, 10103, 10104, 102, 3010101, 3010113, 30202, 2, 4].indexOf(
            params.data.ID
          ) > -1
        )
          return null;
        const div = document.createElement("div");
        let value1 = (params.data.Values[params.data.Values.length - 1] || {})
          .Value;
        let value2 = (params.data.Values[params.data.Values.length - 2] || {})
          .Value;
        let value = value2 - value1;
        div.innerHTML = value
          ? formatNumber(value / Math.pow(10, 9), 1, true)
          : "";
        div.className = "";
        div.classList.add("number");
        return div;
      }
    }
  ];
}
