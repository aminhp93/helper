import React from 'react';
import axios from 'axios';
import { List, Avatar } from 'antd';

class Tinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    render() {
        const { data } = this.state;
        return <div>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar size={400} src={item.user.photos[0].processedFiles[0].url} />}
                            title={<a href="https://ant.design">{item.user.name}</a>}
                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                    </List.Item>
                )}
            />
        </div>
    }

    componentDidMount() {
        axios.get('https://api.gotinder.com/v2/recs/core?locale=en', {
            headers: {
                'X-Auth-Token': '20aaaae5-262b-489d-bdb1-a83b4d166928',
            }
        })
            .then(response => {
                if (response.data && response.data.data && response.data.data.results) {
                    this.setState({
                        data: response.data.data.results
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
}

export default Tinder