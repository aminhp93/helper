import React from 'react';
import style from './ChatRoom.module.css';

const placeholder =
    'https://homepages.cae.wisc.edu/~ece533/images/airplane.png'


class UserHeader extends React.Component {
    render() {
        const user = this.props.user || {}
        console.log(user)
        return <header className={style.component}>
            <img src={user.avatarURL || placeholder} alt={user.name} />
            <div>
                <h3>{user.name}</h3>
                <h5>{user.id && `@${user.id}`}</h5>
            </div>
        </header>
    }
}

export default UserHeader