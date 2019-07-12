import React from "react";
import axios from "axios";
import { List, Button, Select } from "antd";
import CustomedAvatar from "../_customedComponents/CustomedAvatar";
import "antd/dist/antd.css";

const { Option } = Select;

class Tinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filterOptions: {
        status: "active"
      }
    };
  }

  handleUpdateTinder = () => {
    for (let i = 0; i < 100; i++) {
      axios
        .get("https://api.gotinder.com/v2/recs/core?locale=en", {
          headers: {
            "X-Auth-Token": "4a899f39-634b-4cbe-afe0-dea9e2eabc63"
          }
        })
        .then(response => {
          console.log(response);
          if (
            response.data &&
            response.data.data &&
            response.data.data.results
          ) {
            let results = response.data.data.results;
            for (let i = 0; i < results.length; i++) {
              let user = results[i];
              axios
                .post("http://localhost:8001/tinder/create/", {
                  user_id: user.user._id,
                  content: JSON.stringify(user)
                })
                .then(response => {
                  console.log(response);
                })
                .catch(error => {
                  console.log(error);
                });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  handleDeleteAllTinders = () => {
    axios
      .post("http://localhost:8001/tinder/delete/all/")
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleFilter = () => {
    const { data } = this.state;
    const filterData = data.filter(item => {
      const parsed_item = JSON.parse(item.content);
      if (/ig/i.test(parsed_item.user.bio)) return true;
      if (/instagram/i.test(parsed_item.user.bio)) return true;
    });
    this.setState({
      data: filterData
    });
  };

  handleFilterRemove = value => {
    console.log(value);
    this.setState(
      {
        filterOptions: { ...this.state.filterOptions, status: value }
      },
      this.filter
    );
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <div>{data.length}</div>
        <Button onClick={() => this.handleUpdateTinder()}>Update tinder</Button>
        <Button onClick={() => this.handleFilter()}>Filter</Button>
        {/* <Button onClick={() => this.handleDeleteAllTinders()}>Delete all tinders</Button> */}
        <Select
          defaultValue="active"
          onChange={value => this.handleFilterRemove(value)}
        >
          <Option value="active">Active</Option>
          <Option value="removed">Removed</Option>
        </Select>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => {
            const parsed_item = JSON.parse(item.content);
            return (
              <List.Item>
                <List.Item.Meta
                  title={
                    <a href="https://ant.design">{parsed_item.user.name}</a>
                  }
                  description={`${parsed_item.user.birth_date} - ${
                    parsed_item.user.bio
                  } - ${parsed_item.distance_mi}`}
                />
                {parsed_item &&
                  parsed_item.user &&
                  parsed_item.user.photos &&
                  parsed_item.user.photos.map(item => {
                    return <CustomedAvatar src={item.processedFiles[0].url} />;
                  })}
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  filter() {
    let url = "http://localhost:8001/tinder?";
    const { filterOptions } = this.state;
    for (let key in filterOptions) {
      url += `${key}=${filterOptions[key]}`;
    }
    console.log(url);
    axios
      .get(url)
      .then(response => {
        console.log(response);
        if (response.data && response.data.results) {
          this.setState({
            data: response.data.results
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.filter();
  }
}

export default Tinder;
