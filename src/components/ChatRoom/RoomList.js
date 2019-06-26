import React from 'react';

class RoomList extends React.Component {
    render() {
        const { rooms, user, messages, current, typing, actions } = this.props;
        console.log(rooms, user, messages, current, typing, actions)
        return <ul>
            {(rooms || []).map(room => {
                const messageKeys = Object.keys(messages[room.id] || {})
                const latestMessage = messageKeys.length > 0 && messages[room.id][messageKeys.pop()]
                const firstUser = room.users.find(x => x.id !== user.id)
                return (
                    <li>
                        {
                            room.name.match(user.id) && firstUser
                                ? <img src={firstUser.avatarUrl} alt={firstUser.id} />
                                : (room.isPrivate ? 'lock' : 'public')
                        }
                        <col>
                            <p>{room.name.replace(user.id, '')}</p>
                            <span>{latestMessage && latestMessage.text}</span>
                        </col>
                        {
                            room.id !== current.id
                                ? <label>unreadCount</label>
                                : (
                                    Object.keys(typing[room.id] || {}).length > 0
                                        ? <div>
                                            {[0, 1, 2].map(x => <div key={x} />)}
                                        </div>
                                        : null
                                )
                        }
                    </li>
                )
            })}
        </ul>
    }
}

export default RoomList