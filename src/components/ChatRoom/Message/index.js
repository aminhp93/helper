import React from 'react';
import style from './index.module.css';
import Linkify from 'react-linkify';

class Attachment extends React.Component {
    render() {
        return <div>Attachment</div>
    }
}

class Message extends React.Component {
    render() {
        const message = this.props.message || {}
        console.log(message)
        if (message.sender) {
            return (
                <li key={message.id} className={style.component}>
                    <img
                    // onClick={null}
                    // src={message.sender.avatarURL}
                    // alt={message.sender.name} 
                    />
                    <div>
                        <span className={''}>
                            {`${message.sender.name}`}
                        </span>
                        <p>
                            <Linkify properties={{ target: '_blank' }}>{message.text}</Linkify>
                        </p>
                        {
                            message.attachment
                                ? <Attachment />
                                : null
                        }
                    </div>
                </li>
            )
        } else {
            return null
        }
    }
}

export default Message