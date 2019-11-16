import React from 'react';
import ReactDOM from 'react-dom';
import { ChatBox, MessagesList } from './components/MessagesPanel';
import { UsersList } from './components/UsersPanel';
import './styles.css';

import { w3cwebsocket as WebSocket } from 'websocket';
const ws = new WebSocket('ws://127.0.0.1:8080');


class WebsChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enteredText: String(),
            messagesList: [{
                id: undefined,
                color: undefined,
                nick: undefined,
                time: undefined,
                text: undefined,
            }],
            usersList: [{
                id: -1,
                userId: -1,
                userName: String(),
                color: String(),
            }]
        };
    }

    getTimeString() {
        const date = new Date();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const seconds = date.getSeconds();
        const time = `${hour}:${(minute < 10 ? "0" + minute : minute)}:${(seconds < 10 ? "0" + seconds : seconds)}`

        return time;
    }

    scrollToBottom() {
        const scrollHeight = this.messageList.scrollHeight;
        const height = this.messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    componentWillMount() {

        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };
        ws.onmessage = (messageEvent) => {
            const data = JSON.parse(messageEvent.data);
            if (data.type === 'message') {
                const messagesList = this.state.messagesList.slice(0, this.state.messagesList.length);
                const rawColor = data.message.color.toLowerCase();
                const color = rawColor === 'white' || rawColor === 'black' ? 'white' : rawColor;
                this.setState({
                    messagesList: messagesList.concat([{ id: messagesList.length, color: color, nick: data.message.author, time: this.getTimeString(), text: data.message.text }]),
                });
            }
            else if (data.type === 'usersList') {
                const usersList = this.state.usersList.slice(0, this.state.usersList.length);
                let userIdExists = false;
                for (var i = 0; i < usersList.length; i++) {
                    if (usersList[i].userId == data.data.userId) {
                        userIdExists = true;
                        break;
                    }
                }
                if (userIdExists === true) {
                    usersList.splice(i, 1);
                    this.setState({
                        usersList: usersList,
                    })
                } else {
                    this.setState({
                        usersList: usersList.concat([{ id: usersList.length, userId: data.data.userId, userName: data.data.userName, color: data.data.color.toLowerCase() }]),
                    });
                }
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.messagesList !== this.state.messagesList) {
            this.scrollToBottom();
        }
    }

    render() {
        const messagesList = this.state.messagesList;
        const usersList = this.state.usersList;

        return (

            <div id='chat-window' >
                <div id='users-column'>

                    <p>WebSocket Chat in React</p>

                    <div className='horizontal-spacer'></div>

                    <div id='users-list'>
                        <UsersList usersList={usersList}></UsersList>
                    </div>

                </div>
                <div id='chat-column'>

                    <div className='message-list' ref={(div) => { this.messageList = div; }}>
                        <MessagesList messagesList={messagesList} />
                    </div>

                    <div className='horizontal-spacer'></div>
                    <ChatBox
                        onChange={(evt) => {
                            this.setState({
                                enteredText: evt.target.value
                            });
                        }
                        }
                        onClick={(evt) => {
                            evt.preventDefault();
                            if (this.state.enteredText.trimLeft() === '') {
                                return;
                            }
                            ws.send(this.state.enteredText);
                            this.setState({ enteredText: '' });
                        }
                        }
                        value={this.state.enteredText}
                    />
                </div>

            </div>
        );
    }
}

//====================================================================================
ReactDOM.render(
    <WebsChat />,
    document.getElementById('root')
);
