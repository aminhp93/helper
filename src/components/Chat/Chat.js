import React from 'react';
import { List, Avatar, Input } from 'antd';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'

class ChatApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    title: 'Ant Design Title 1',
                },
                {
                    title: 'Ant Design Title 2',
                },
                {
                    title: 'Ant Design Title 3',
                },
                {
                    title: 'Ant Design Title 4',
                },
            ]
        }
    }

    handleSendMessage = (e) => {
        console.log(e.target.value, 1244)
        const { data } = this.state;
        data.push({
            title: e.target.value
        })

        this.setState({
            data
        }, () => {
            this.inputDom.input.value = ''
        })
    }

    render() {
        const { data } = this.state;
        return (<div>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={<a href="https://ant.design">{item.title}</a>}
                            description="Ant Desig"
                        />
                    </List.Item>
                )}
            />
            <Input ref={dom => this.inputDom = dom} onPressEnter={e => this.handleSendMessage(e)} />
        </div>
        )
    }
}

export default ChatApp