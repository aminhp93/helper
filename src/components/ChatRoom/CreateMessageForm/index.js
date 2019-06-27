import React from 'react';
import style from './index.module.css'

class CreateMessageForm extends React.Component {
    render() {
        const { state, actions } = this.props;
        const room = (state && state.room) || {};
        const user = (state && state.user) || {};
        const message = (state && state.message) || '';
        const runCommand = actions && actions.runCommand;
        return (
            room.id
                ? (
                    <form className={style.component}>
                        <input placeholder='Type a message' />
                        <button type='submit'>
                            Submit
                        </button>
                    </form>
                )
                : null
        )
    }
}

export default CreateMessageForm