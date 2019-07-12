import React from 'react';
import axios from 'axios';
import { List, Avatar, Button, Modal, Carousel, Input } from 'antd';
import 'antd/dist/antd.css';
// import uuidv4 from "uuid/v4";
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
const { Search } = Input;

class Tinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            visible: false,
            detailTinder: {},
            modalContent: '',
        }
    }

    handleUpdateTinder = () => {
        for (let i = 0; i < 20; i++) {
            axios.get('https://api.gotinder.com/v2/recs/core?locale=en', {
                headers: {
                    'X-Auth-Token': '38b5f4ab-9c65-4b3c-bade-1970fcf15fb3',
                }
            })
                .then(response => {
                    console.log(response)
                    if (response.data && response.data.data && response.data.data.results) {
                        let results = response.data.data.results
                        for (let i = 0; i < results.length; i++) {
                            let user = results[i]
                            axios.post('http://localhost:8001/tinder/create/', { user_id: user.user._id, content: JSON.stringify(user) })
                                .then(response => {
                                    console.log(response)
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        }
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }

    }

    handleDeleteAllTinders = () => {
        axios.post('http://localhost:8001/tinder/delete/all/')
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    handleFilter = () => {
        const { data } = this.state;
        const filterData = data.filter(item => {
            const parsed_item = JSON.parse(item.content);
            if (/ig/i.test(parsed_item.user.bio)) return true
            if (/instagram/i.test(parsed_item.user.bio)) return true
        })
        this.setState({
            data: filterData
        })
    }

    showModal = (data) => {
        this.setState({
            visible: true,
            detailTinder: data,
            modalContent: 'carousel'
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
            modalContent: ''
        });
    };

    handleSearch = (data) => {
        console.log(data);
        let url = `http://localhost:8001/tinder?q=${data}`
        axios.get(url)
            .then(response => {
                if (response.data && response.data.results) {
                    this.setState({
                        data: response.data.results
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    handleAnalyze = () => {
        axios.get('http://localhost:8001/tinder/analyze')
            .then(response => {
                console.log(response)
                this.setState({
                    modalContent: 'analyze',
                    visible: true,
                    countAnalyzeData: response.data.data.count
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        const { data, visible } = this.state;
        return <div className='tinder'>
            <div className='header'>
                <span>{data.length}</span>
                <Button onClick={() => this.handleUpdateTinder()}>Update tinder</Button>
                <Button onClick={() => this.handleFilter()}>Filter</Button>
                <Button onClick={() => this.handleDeleteAllTinders()}>Delete all tinders</Button>
                <Button onClick={() => this.handleAnalyze()}>Analyze</Button>
                <Search
                    placeholder="input search text"
                    onSearch={value => this.handleSearch(value)}
                    style={{ width: 200 }}
                />
            </div>
            <List
                className='content'
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => {
                    const parsed_item = JSON.parse(item.content);
                    return <List.Item>
                        <List.Item.Meta

                            title={<a href="https://ant.design">{parsed_item.user.name}</a>}
                            description={`${parsed_item.user.birth_date} - ${parsed_item.user.bio} - ${parsed_item.distance_mi}`}
                        />
                        <Avatar size={200} src={parsed_item.user.photos[0].processedFiles[0].url} onClick={() => this.handleShowDetailTinder(parsed_item)} />
                    </List.Item>
                }}
            />
            {
                visible
                    ? <Modal
                        className='tinderModal'
                        title="Basic Modal"
                        visible={true}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        {this.renderContenModal()}
                    </Modal>
                    : null
            }

        </div >
    }

    renderContenModal = () => {
        const { detailTinder, modalContent, countAnalyzeData } = this.state;
        switch (modalContent) {
            case 'carousel':
                return <Carousel>
                    {
                        detailTinder.user && detailTinder.user.photos.map(item => {
                            return <img src={item.url} size={100} alt={123} />
                        })
                    }
                </Carousel>
            case 'analyze':
                return <BarChart
                    width={800}
                    height={300}
                    data={countAnalyzeData}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="8 8" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            default:
                return null
        }

    }

    handleShowDetailTinder = (data) => {
        console.log(data);
        this.showModal(data);
    }

    componentDidMount() {
        axios.get('http://localhost:8001/tinder/')
            .then(response => {
                console.log(response)
                if (response.data && response.data.results) {
                    this.setState({
                        data: response.data.results
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
}

export default Tinder