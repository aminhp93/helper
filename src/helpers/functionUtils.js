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
  console.log(smallerCount, largerCount);
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
