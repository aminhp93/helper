import React from "react";
import { Tabs } from "antd";

const { TabPane } = Tabs;

class Wine extends React.Component {
  render() {
    return (
      <div>
        <div>
          Research about wine, all of wine, how to make the best use of wine |{" "}
          <a
            target="_blank"
            href="https://khoruou.vn/"
            rel="noopener noreferrer"
          >
            khoruou
          </a>{" "}
          |{" "}
          <a
            target="_blank"
            href="https://redapron.vn/wset/wsetvn.html"
            rel="noopener noreferrer"
          >
            Wine certificate - WSET
          </a>
          <div>Vintage</div>
          <div>Single - Varietal Wine</div>
          <div>Wine Blend</div>
          <div>
            <div>Huong vi ruou</div>
            <div>Tinh axit</div>
            <div>Su ngot ngao</div>
            <div>Con - 10 - 15% ABV</div>
            <div>Tannin</div>
          </div>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Ruou vang Phap" key="1">
              <div>{`4 cap do: Vin de Table < Vin de Pay < VDQS < AOC`}</div>
              <div>
                <div>8 vung noi bat</div>
                <div>Bordeaux (Sauternes(Botrytis), Chateau dYquem)</div>
                <div>Bourgogne</div>
                <div>Rhone</div>
                <div>Alsace</div>
                <div>Sud & Sud - Ouest</div>
                <div>Loire</div>
                <div>Cognac</div>
              </div>
              <div>
                VD: <br />
                <a
                  href="https://www.topwine.com.vn/chateau-lynch-moussas-grand-cru-classe-2010.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chateau Lynch-Moussas Grand Cru Classe 2010
                </a>
                <br />
                <a
                  href="https://www.topwine.com.vn/lapogee-saint-chinian-2013.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  L'Apogee Saint-Chinian 2013
                </a>
                <br />
                <a
                  href="https://www.topwine.com.vn/the-illustrious-2012.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Illustrious - Coteausx d'Ensuerune 2012
                </a>
                <br />
                <a
                  href="https://www.topwine.com.vn/chateau-la-faviere-bordeaux-superieur.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chateau la Faviewer Bordeaux Superieur 2011
                </a>
              </div>
            </TabPane>
            <TabPane tab="Tab 2" key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="Tab 3" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
          {/* <div>
            <div>Ruou vang do</div>
            <div>Syrah/Shiraz</div>
            <div>Merlot</div>
            <div>Cabernet Sauvignon</div>
            <div>Malbec</div>
            <div>Pinot Noir</div>
            <div>Zinfandel</div>
            <div>Sangiovese</div>
            <div>Barbera</div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default Wine;
