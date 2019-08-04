import React from "react";
import { Tabs, Input, Button, Row, Col, Table, Divider, Tag } from "antd";

const InputGroup = Input.Group;

const { TabPane } = Tabs;

const tienChoThueNha_default = 17;
const tienLuong_default = 37;
const laiSuatNganHang_default = 0.07;
const noHientai_default = 400;
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <span>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a href="javascript:;">Invite {record.name}</a>
        <Divider type="vertical" />
        <a href="javascript:;">Delete</a>
      </span>
    ),
  },
];

const data = [
  {
    key: '1',
    year: '2020',
    data: [{
      FPTS: '25',
      timo: '45',
      ngan_hang: '54',
      trai_phieu: '251',
    }]
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];
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
            <Table columns={columns} dataSource={data} />
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
