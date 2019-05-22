export function calculateClose(data, timeValue, percentValue = 0) {
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
  let timeValue = 0
  let smallerCount = 0;
  let largerCount = 0;
  let returnedSmallerCount = 0
  let returnedLargerCount = 0
  let currentPercent = 0
  for (let j = 1; j < 251; j++) {
    for (let i = 0; i < data.length - j; i++) {
      if (data[i].Close < data[i + j].Close * (1 + percentValue / 100)) {
        smallerCount += 1;
      } else {
        largerCount += 1;
      }
    }
    if ((largerCount / (data.length - j)) > currentPercent) {
      currentPercent = largerCount / (data.length - j)
      timeValue = j
      returnedSmallerCount = smallerCount
      returnedLargerCount = largerCount
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
  }
  return returnedData;
}

export function mapData(data, key) {
  let returnedData = []
  let decreasedStockNumbers = 0
  let increasedStockNumbers = 0
  let unchangedStockNumbers = 0
  for (let i = 0; i < data.length; i++) {
    let price_data_item = JSON.parse(data[i].price_data)
    let lastDay = price_data_item[price_data_item.length - 1]
    let lastTwoDays = price_data_item[price_data_item.length - 2]

    let financial_data_item = JSON.parse(data[i].financial_data)
    // console.log(lastDay)
    let returnItem = {}
    returnItem['symbol'] = data[i]['symbol']
    returnItem['close'] = lastDay && lastDay.Close
    if (financial_data_item) {
      returnItem['ROE'] = financial_data_item && financial_data_item.ROE
      returnItem['EPS'] = financial_data_item.EPS
      returnItem['MarketCapitalization'] = financial_data_item.MarketCapitalization
    }
    returnItem[key] = key
    returnedData.push(returnItem)

    if (lastDay && lastDay.Close && lastTwoDays && lastTwoDays.Close) {
      if (lastDay.Close > lastTwoDays.Close) {
        increasedStockNumbers += 1
      } else if (lastDay.Close < lastTwoDays.Close) {
        decreasedStockNumbers += 1
      } else {
        unchangedStockNumbers += 1
      }
    }
  }
  return {
    returnedData,
    barChartData: [
      {
        name: 'Name 1',
        increasedStockNumbers,
        decreasedStockNumbers,
        unchangedStockNumbers
      }
    ]
  }
}