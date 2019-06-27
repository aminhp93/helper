import React from 'react';
import style from './index.module.css'

class RoomHeader extends React.Component {
    render() {
        const { room, user, sidebarOpen, userListOpen } = this.props.state || {};
        const { setSidebar, setUserList } = this.props.actions || {};
        console.log(room, user, sidebarOpen, userListOpen)

        return <header className={style.component}>
            <button onClick={e => setSidebar(!sidebarOpen)}>
                <svg>
                    <use xlinkHref="index.svg#menu" />
                </svg>
            </button>
            <h1>{room && room.name && room.name.replace(user.id, '')}</h1>
            {room && room.users && (
                <div onClick={e => setUserList(!userListOpen)}>
                    <span>{room.users.length}</span>
                    <svg>
                        <use xlinkHref="index.svg#members" />
                    </svg>
                </div>
            )}
        </header>
    }
}

export default RoomHeader