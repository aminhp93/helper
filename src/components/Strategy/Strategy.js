import React from "react";
import { Tabs } from "antd";
import axios from "axios";
import { getAnalyzeStockUrl } from "../../helpers/requests";

const { TabPane } = Tabs;

class Strategy extends React.Component {
  callback = key => {
    console.log(key);
  };

  componentDidMount() {
    // Count FPT in last 3 years
    axios
      .post(getAnalyzeStockUrl(), { symbol: "FPT" })
      .then(response => {
        console.log(response);
        // const a = JSON.parse(
        //     '[{"Symbol":"FPT","Close":46900,"Open":47000,"High":47500,"Low":46650,"Volume":1600280,"Value":75267000000,"Date":"2019-07-02T00:00:00Z","OpenInt":0,"Loss":200,"Gain":0,"AverageGain":313.3989247509673,"AverageLoss":180.209584316696,"RSI":63.4913942919908},{"Symbol":"FPT","Close":46800,"Open":46700,"High":46900,"Low":46550,"Volume":1275860,"Value":59599000000,"Date":"2019-07-03T00:00:00Z","OpenInt":0,"Loss":100,"Gain":0,"AverageGain":291.01328726875533,"AverageLoss":174.4803282940749,"RSI":62.51713826770534},{"Symbol":"FPT","Close":46950,"Open":47000,"High":47200,"Low":46800,"Volume":1275800,"Value":59925000000,"Date":"2019-07-04T00:00:00Z","OpenInt":0,"Gain":150,"Loss":0,"AverageGain":280.9409096067014,"AverageLoss":162.01744770164098,"RSI":63.42377448612828},{"Symbol":"FPT","Close":46600,"Open":46800,"High":47000,"Low":46400,"Volume":1137770,"Value":53161000000,"Date":"2019-07-05T00:00:00Z","OpenInt":0,"Loss":350,"Gain":0,"AverageGain":260.87370177765126,"AverageLoss":175.44477286580948,"RSI":59.78974463339541},{"Symbol":"FPT","Close":46300,"Open":46500,"High":46900,"Low":46050,"Volume":1303050,"Value":60510000000,"Date":"2019-07-08T00:00:00Z","OpenInt":0,"Loss":300,"Gain":0,"AverageGain":242.23986593639046,"AverageLoss":184.34157480396593,"RSI":56.78631154603664},{"Symbol":"FPT","Close":46750,"Open":46300,"High":46850,"Low":46100,"Volume":992570,"Value":46176000000,"Date":"2019-07-09T00:00:00Z","OpenInt":0,"Gain":450,"Loss":0,"AverageGain":257.07987551236255,"AverageLoss":171.1743194608255,"RSI":60.02973900313054},{"Symbol":"FPT","Close":47050,"Open":46950,"High":47450,"Low":46800,"Volume":1281980,"Value":60512000000,"Date":"2019-07-10T00:00:00Z","OpenInt":0,"Gain":300,"Loss":0,"AverageGain":260.1455986900509,"AverageLoss":158.9475823564808,"RSI":62.07345059645986},{"Symbol":"FPT","Close":47000,"Open":47150,"High":47250,"Low":46800,"Volume":854140,"Value":40162000000,"Date":"2019-07-11T00:00:00Z","OpenInt":0,"Loss":50,"Gain":0,"AverageGain":241.56377021219012,"AverageLoss":151.16561218816076,"RSI":61.50896292397558},{"Symbol":"FPT","Close":47000,"Open":47100,"High":47450,"Low":46800,"Volume":1241970,"Value":58509000000,"Date":"2019-07-12T00:00:00Z","OpenInt":0,"Loss":0,"Gain":0,"AverageGain":224.30921519703367,"AverageLoss":140.368068460435,"RSI":61.50896292397558},{"Symbol":"FPT","Close":47300,"Open":46950,"High":47550,"Low":46850,"Volume":1176060,"Value":55533000000,"Date":"2019-07-15T00:00:00Z","OpenInt":0,"Gain":300,"Loss":0,"AverageGain":229.71569982581698,"AverageLoss":130.34177785611823,"RSI":63.79973033881592},{"Symbol":"FPT","Close":47300,"Open":47350,"High":47800,"Low":47250,"Volume":1160000,"Value":55070000000,"Date":"2019-07-16T00:00:00Z","OpenInt":0,"Loss":0,"Gain":0,"AverageGain":213.30743555254435,"AverageLoss":121.0316508663955,"RSI":63.79973033881593},{"Symbol":"FPT","Close":47050,"Open":47300,"High":47500,"Low":47000,"Volume":1292630,"Value":60952000000,"Date":"2019-07-17T00:00:00Z","OpenInt":0,"Loss":250,"Gain":0,"AverageGain":198.07119015593403,"AverageLoss":130.2436758045101,"RSI":60.32964409835707},{"Symbol":"FPT","Close":46800,"Open":47000,"High":47100,"Low":46800,"Volume":1035440,"Value":48570000000,"Date":"2019-07-18T00:00:00Z","OpenInt":0,"Loss":250,"Gain":0,"AverageGain":183.92324800193873,"AverageLoss":138.7976989613308,"RSI":56.991419284249915},{"Symbol":"FPT","Close":48200,"Open":46950,"High":48300,"Low":46900,"Volume":2811560,"Value":134207000000,"Date":"2019-07-19T00:00:00Z","OpenInt":0,"Gain":1400,"Loss":0,"AverageGain":270.7858731446574,"AverageLoss":128.88357760695004,"RSI":67.7524570955886}]'
        //   );
        let data = JSON.parse(response.data.symbol[0].price_data).slice(
          -750,
          -1
        );
        let result = [];
        console.log(data);
        for (let i = 0; i < data.length - 14; i++) {
          if (data[i].Close * 1.1 < data[i + 14].Close) {
            result.push(data[i].Date);
          }
        }

        console.log(result, response.data.symbol[0].result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab="Strategy 1" key="1">
          Count the number of increase 10%, keep it continuously 12 times - 6
          months - 2 weeks period
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    );
  }
}

export default Strategy;
