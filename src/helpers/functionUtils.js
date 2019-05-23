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
  for (let j = 1; j < data.length; j++) {
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
      RSI_14: Number(data[data.length - 1].RSI.toFixed(0)) || 0
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
export function roundFloat(numberFloat, lenght) {
  try {
    if (numberFloat == null || lenght == null) {
      return 0;
    }
    // let itenDivison = '1';
    // for (let i = 0; i < lenght; i++) {
    //     itenDivison += '0';
    // }
    // const division = Number(itenDivison);
    let numberString = numberFloat + "";
    let arrNumber = numberString.split(".");
    if (!arrNumber[1]) return numberFloat;
    for (let i = 0; i < lenght; i++) {
      if (arrNumber[1][0]) {
        arrNumber[0] += arrNumber[1][0];
        arrNumber[1] = arrNumber[1].substr(1);
      } else {
        arrNumber[0] += "0";
      }
    }
    numberString = arrNumber.join(".");
    arrNumber = Math.round(numberString).toString();
    arrNumber = arrNumber.replace(/^(-?)/, "$1" + "0".repeat(lenght));
    let result = Number(
      arrNumber.substring(0, arrNumber.length - lenght) +
        "." +
        arrNumber.substr(-lenght)
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
