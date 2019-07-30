import React from "react";
import { Tabs, Input, Button, Row, Col } from "antd";

const InputGroup = Input.Group;

const { TabPane } = Tabs;

const tienChoThueNha_default = 17;
const tienLuong_default = 37;
const laiSuatNganHang_default = 0.07;
const noHientai_default = 400;

class Invest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthToPayOff: 0
    };
    this.obj = {
      tienChoThueNha: tienChoThueNha_default,
      tienLuong: tienLuong_default,
      laiSuatNganHang: laiSuatNganHang_default,
      noHientai: noHientai_default
    };
  }

  handleCalculate = () => {
    console.log(this.obj);
    const monthToPayOff =
      Number(
        (
          this.obj.noHientai /
          (this.obj.tienChoThueNha + this.obj.tienLuong)
        ).toFixed(0)
      ) + 1;
    this.setState({
      monthToPayOff
    });
    return;
  };

  handleChangeTienLuong = e => {
    console.log(e.target.value);
    this.obj.tienLuong = e.target.value;
  };

  handleChangeLaiSuatNganHang = e => {
    this.obj.laiSuatNganHang = e.target.value;
  };

  handleChangeNoHienTai = e => {
    this.obj.noHientai = e.target.value;
  };

  handleChangeTienChoThueNha = e => {
    this.obj.tienChoThueNha = e.target.value;
  };

  render() {
    return (
      <div className="invest">
        Invest
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tab 1" key="1">
            <div className="inputContainer">
              <InputGroup>
                <Row gutter={8}>
                  <Col span={2}>
                    <div>tien luong/thang</div>
                  </Col>
                  <Col span={2}>
                    <Input
                      placeholder="tien luong"
                      defaultValue={tienLuong_default}
                      onChange={data => this.handleChangeTienLuong(data)}
                    />
                  </Col>
                </Row>
              </InputGroup>
              <InputGroup>
                <Row gutter={8}>
                  <Col span={2}>
                    <div>tien cho thue nha/thang</div>
                  </Col>
                  <Col span={2}>
                    <Input
                      placeholder="tien cho thue nha"
                      defaultValue={tienChoThueNha_default}
                      onChange={data => this.handleChangeTienChoThueNha(data)}
                    />
                  </Col>
                </Row>
              </InputGroup>
              <InputGroup>
                <Row gutter={8}>
                  <Col span={2}>
                    <div>lai suat ngan hang/nam</div>
                  </Col>
                  <Col span={2}>
                    <Input
                      placeholder="lai suat ngan hang"
                      defaultValue={laiSuatNganHang_default}
                      onChange={data => this.handleChangeLaiSuatNganHang(data)}
                    />
                  </Col>
                </Row>
              </InputGroup>
              <InputGroup>
                <Row gutter={8}>
                  <Col span={2}>
                    <div>No hien tai</div>
                  </Col>
                  <Col span={2}>
                    <Input
                      placeholder="no hien tai"
                      defaultValue={noHientai_default}
                      onChange={data => this.handleChangeNoHienTai(data)}
                    />
                  </Col>
                </Row>
              </InputGroup>
            </div>

            <Button onClick={() => this.handleCalculate()}>Calculate</Button>
            <InputGroup>
              <Row gutter={8}>
                <Col span={2}>
                  <div>monthToPayOff</div>
                </Col>
                <Col span={2}>{this.state.monthToPayOff} months</Col>
              </Row>
            </InputGroup>
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Invest;
