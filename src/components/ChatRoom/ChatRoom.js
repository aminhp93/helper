import React from 'react';
import UserHeader from './UserHeader';
import RoomList from './RoomList';
import RoomHeader from './RoomHeader';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';
import CreateMessageForm from './CreateMessageForm';
import UserList from './UserList';
import JoinRoomScreen from './JoinRoomScreen';
import WelcomeScreen from './WelcomeScreen';

class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            room: {},
            messages: {},
            typing: {},
            sidebarOpen: false,
            userListOpen: window.innerWidth > 1000,
        }
    }

    render() {
        const {
            user,
            room,
            messages,
            typing,
            sidebarOpen,
            userListOpen,
        } = this.state
        return (
            <main>
                <aside>
                    <UserHeader />
                    <RoomList />
                </aside>
                <section>
                    <RoomHeader />
                    {
                        room.id
                            ? <row>
                                <col>
                                    <MessageList />
                                    <TypingIndicator />
                                    <CreateMessageForm />
                                </col>
                                {
                                    userListOpen && (
                                        <UserList />
                                    )
                                }
                            </row>
                            : (
                                user.id
                                    ? <JoinRoomScreen />
                                    : <WelcomeScreen />
                            )
                    }

                </section>
            </main>
        )
    }
}

export default ChatRoom